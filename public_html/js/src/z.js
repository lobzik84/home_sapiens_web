var global_serverJSONUrl = "http://my.moidom.molnet.ru:8083/hs/json";
var global_rsa_e = "10001";
var global_aes_mode = slowAES.modeOfOperation.CFB; //AES mode of operation for all symmetric encryption, including messages, posts, comments, files, keyfile

$(function () {
    //init
    $('.home').hide();
    $('.login').hide();
    $('.registration').hide();

    updateData();

    function updateData() {
        var kf = new KeyFile();

        var obj = {
            "action": "get_data",
            "user_id": kf.userId,
            "box_id": kf.boxId,
            "session_key": localStorage["session_key"]
        }

        $.ajax({
            type: "POST",
            url: global_serverJSONUrl,
            dataType: 'json',
            crossDomain: true,
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                if (data["result"] === "success") {
                    localStorage["session_key"] = data["session_key"];
                    console.log("successfully loaded data, decrypting");
                    decryptData(kf, data);
                    $('.registration').hide();
                    $('.login').hide();
                    $('.home').show();
                } else if (data["result"] === "do_register") {
                    console.log("registration needed");
                    $('.registration').show();
                } else if (data["result"] === "do_login") {
                    localStorage["session_key"] = data["session_key"];
                    console.log("login requested");
                    if (typeof kf.getMyPrivateKey() !== "undefined" && kf.getMyPrivateKey().length === 256) {
                        console.log("trying to login with RSA");
                        authWithRSA(kf, data);
                    } else {
                        console.log("no private key, SRP auth forced");
                        $('.login').show();
                    }
                }

            },
            fail: function () {
                alert("Error while registering");
            }
        })

    }

    function decryptData(kf, data) {
        console.log("decrypting \n" + JSON.stringify(data));
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());
        var res = rsa.decrypt(data["key_cipher"]);
        console.log("symmetric key is " + res);
        var key = cryptoHelpers.toNumbers(res); //creating key
        
        var bytesToDecrypt = cryptoHelpers.toNumbers(data["parameters"]); //decoding cipher
        var bytes = slowAES.decrypt(bytesToDecrypt, global_aes_mode, key, key); //decrypting message
        var plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes)); //decoding utf-8
        console.log("Data decrypted: " + plain);
    }

    function authWithRSA(kf, data) {
        var challenge = data["challenge"];
        console.log("Authenticating with RSA, challenge=" + challenge);
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());
        var digest = rsa.signString(challenge, "sha256");//generating signature with author's private key
        var obj = {
            "action": "login_rsa",
            "user_id": kf.userId,
            "box_id": kf.boxId,
            "digest": digest,
            "session_key": localStorage["session_key"]
        }
        $.ajax({
            type: "POST",
            url: global_serverJSONUrl,
            dataType: 'json',
            crossDomain: true,
            async: true,
            data: JSON.stringify(obj),
            success: function (data) {
                if (data["result"] === "success") {
                    console.log("successfully authenticated with RSA");
                    updateData();
                } else {
                    console.error("Error while RSA auth: " + data["message"] + ". Falling back to SRP.");
                    $('.login').show();
                }
            },
            fail: function () {
                console.error("Error while RSA auth. Falling back to SRP.");
                $('.login').show();
            }
        })
    }

    $('#login_srp').click(function () {
        console.log("logging in with SRP, handshaking");
        var srp = new SRP();
        var login = $("#login_phone").val();
        srp.I = login;
        srp.p = $("#srp__password").val();
        srp.forward_url = "#";//
        srp.url = global_serverJSONUrl;
        srp.success = function () {
            var scrypt = scrypt_module_factory();
            var scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8($("#login_phone").val() + ":" + $("#srp__password").val()), scrypt.encode_utf8(""), 16384, 8, 1, 32);
            var pbkdf = cryptoHelpers.ua2hex(scryptBytes);
            var ls = localStorage;
            ls["userId"] = srp.userId;
            ls["boxId"] = srp.boxId;
            kf = new KeyFile();
            kf.downloadKeyFile(global_serverJSONUrl, pbkdf, function () {
                console.log("sucessfully logged in with SRP, keyfile downloaded");
                updateData();
            });
        }
        srp.identify();
    });




    $('#register').click(function () {

        var rsa = new RSAKey();
        console.log("generating RSA...");
        rsa.generate(1024, global_rsa_e); //1024 bits, public exponent = 10001
        console.log("RSA generated, generating salt");
        var srp = new SRP();
        var login = $("#phone").val();
        srp.I = login;
        srp.p = $("#new__password").val(); //TODO check passwords are similiar

        var salt = srp.generateSalt();
        var verifier = srp.getVerifier();
        var publicKey = rsa.n.toString(16);
        console.log("Generated s=" + salt + ", v=" + verifier + ", public key=" + publicKey + " for login " + login + ", password " + srp.p);

        var regObj = {
            "action": "register",
            "login": login,
            "salt": salt,
            "verifier": verifier,
            "public_key": publicKey
        }

        $.ajax({
            type: "POST",
            url: global_serverJSONUrl,
            dataType: 'json',
            crossDomain: true,
            async: true,
            data: JSON.stringify(regObj),
            success: function (data) {
                if (data["result"] === "success") {
                    var scrypt = scrypt_module_factory();
                    var scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8($("#phone").val() + ":" + $("#new__password").val()), scrypt.encode_utf8(""), 16384, 8, 1, 32);
                    var pbkdf = cryptoHelpers.ua2hex(scryptBytes);
                    var kf = new KeyFile();
                    kf.initKeyFile(data["new_user_id"], data["box_id"], rsa.d.toString(16), rsa.n.toString(16), pbkdf);
                    kf.addBoxKey(data["box_id"], data["box_public_key"]);
                    localStorage["session_key"] = data["session_key"];
                    console.log("created keyfile: \n" + kf.getKeyFileAsStirng());
                    kf.uploadKeyFile(global_serverJSONUrl, function () {
                        if (kf.xhr.readyState === 4 && kf.xhr.status == 200) {
                            alert("Successfully registered! UserId = " + data["new_user_id"]);
                            $('.registration').hide();
                            $('.home').show();
                        }
                    });

                } else
                    alert("Error while registering: " + data["message"]);
            },
            fail: function () {
                alert("Error while registering");
            }
        })

    });

    $('#dev_logout').click(function () {
        console.log("Logging out...");
        ls.clear();
        $('.registration').hide();
        $('.home').hide();
        $('.login').show();
    });
});