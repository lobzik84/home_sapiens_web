var global_serverJSONUrl = "http://my.moidom.molnet.ru:8083/hs/json";
var global_rsa_e = "10001";
var global_aes_mode = slowAES.modeOfOperation.CFB; //AES mode of operation for all symmetric encryption, including messages, posts, comments, files, keyfile
$(function () {
    $('#register').click(function () {
        var rsa = new RSAKey();
        var srp = new SRP();
        var login = $("#phone").val();
        srp.I = login;
        srp.p = $("#new__passowrd").val(); //TODO check passwords are similiar
        rsa.generate(1024, global_rsa_e); //1024 bits, public exponent = 10001

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
                if (data["result"] == "success") {
                    var scrypt = scrypt_module_factory();
                    var scryptBytes = scrypt.crypto_scrypt(scrypt.encode_utf8($("#phone").val() + ":" + $("#new__passowrd").val()), scrypt.encode_utf8(""), 16384, 8, 1, 32);
                    var pbkdf = cryptoHelpers.ua2hex(scryptBytes);
                    var kf = new KeyFile();
                    kf.initKeyFile(data["new_user_id"], data["box_id"], rsa.d.toString(16), rsa.n.toString(16), pbkdf);
                    kf.addBoxKey(data["box_id"], data["box_public_key"]);
                    localStorage["session_key"] = data["session_key"];
                    console.log("created keyfile: \n" + kf.getKeyFileAsStirng());
                    kf.uploadKeyFile(global_serverJSONUrl, function () {
                        alert("Successfully registered! UserId = " + data["new_user_id"]);
                        $('.registration').hide();
                        $('.home').show();
                    });

                } else
                    alert("Error while registering: " + data["message"]);
            },
            fail: function () {
                alert("Error while registering");
            }
        })

    });
});