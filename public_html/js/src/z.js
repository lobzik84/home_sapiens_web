var global_serverJSONUrl = "http://192.168.11.22:8080/hs/json";
var global_rsa_e = "10001";
var global_aes_mode = slowAES.modeOfOperation.CFB; //AES mode of operation for all symmetric encryption, including messages, posts, comments, files, keyfile
var data_update_interval = 10000;
var print_debug_to_console = false;

$(function () {
    //init
    $('.home').hide();
    $('.login').hide();
    $('.registration').hide();
//hide everything
    updateData(); //try to fetch data
    updateCapture();

    //button handlers
    $('#update_capture').click(function () {
        updateCapture();
    });

    $('#dev_logout').click(function () {
        if (print_debug_to_console)
            console.log("Logging out...");
        ls.clear();
        $('.registration').hide();
        $('.home').hide();
        $('.login').show();
    });

    $('#lamp--first-status').click(function () {
        $('.control__status', this).toggleClass('on');
        if ($('.control__status', this).hasClass('on')) {   
            sendUartCommand("led1=on");
            $('.control__status', this).text('Включена');
            $('.control__img img', this).attr('src', 'images/lamp.png');

        } else {
            sendUartCommand("led1=off");
            $('.control__status', this).text('Выключена');
            $('.control__img img', this).attr('src', 'images/lamp-off.png');
        }
    });


    $('#lamp--second-status').click(function () {
        $('.control__status', this).toggleClass('on');
        if ($('.control__status', this).hasClass('on')) {
            sendUartCommand("led2=on");            
            $('.control__status', this).text('Включена');
            $('.control__img img', this).attr('src', 'images/lamp.png');
        } else {
            sendUartCommand("led2=off");
            $('.control__status', this).text('Выключена');
            $('.control__img img', this).attr('src', 'images/lamp-off.png');
        }
    });


    $('#socket--status').click(function () {
        $('.control__status', this).toggleClass('on');
        if ($('.control__status', this).hasClass('on')) {
            sendUartCommand("433_TX=10044428,200");
            $('.control__status', this).text('Включена');
            $('.control__img img', this).attr('src', 'images/socket.png');
        } else {
            sendUartCommand("433_TX=10044420,200");
            $('.control__status', this).text('Выключена');
            $('.control__img img', this).attr('src', 'images/socket-off.png');
        }
    });

    $('#login_srp').click(function () {
        if (print_debug_to_console)
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
            var kf = new KeyFile();
            kf.downloadKeyFile(global_serverJSONUrl, pbkdf, function () {
                if (print_debug_to_console)
                    console.log("sucessfully logged in with SRP, keyfile downloaded");
                updateData();
            });
        }
        srp.identify();
    });




    $('#register').click(function () {

        var rsa = new RSAKey();
        if (print_debug_to_console)
            console.log("generating RSA...");
        rsa.generate(1024, global_rsa_e); //1024 bits, public exponent = 10001
        if (print_debug_to_console)
            console.log("RSA generated, generating salt");
        var srp = new SRP();
        var login = $("#phone").val();
        srp.I = login;
        srp.p = $("#new__password").val(); //TODO check passwords are similiar

        var salt = srp.generateSalt();
        var verifier = srp.getVerifier();
        var publicKey = rsa.n.toString(16);
        if (print_debug_to_console)
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
                    if (print_debug_to_console)
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
    
    function sendUartCommand(content) {
    
        var obj = {
            "uart_command": content            
        }
            
        sendCommand("internal_uart_command", obj);
    }
        
    function sendCommand(name, command_data) {
        var kf = new KeyFile();

        var obj = {
            "action": "command",
            "command_name":name,
            "command_data": command_data,
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
                    decryptData(kf, data);
                }
            },
            fail: function () {
                console.error("network error");

            }
        })
    }

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
                    if (print_debug_to_console)
                        console.log("successfully loaded data, decrypting");
                    setTimeout(updateData, data_update_interval);
                    decryptData(kf, data);
                    $('.registration').hide();
                    $('.login').hide();
                    $('.home').show();
                } else if (data["result"] === "do_register") {
                    if (print_debug_to_console)
                        console.log("registration needed");
                    $('.registration').show();
                } else if (data["result"] === "do_login") {
                    localStorage["session_key"] = data["session_key"];
                    if (print_debug_to_console)
                        console.log("login requested");
                    if (typeof kf.getMyPrivateKey() !== "undefined" && kf.getMyPrivateKey().length === 256) {
                        if (print_debug_to_console)
                            console.log("trying to login with RSA");
                        authWithRSA(kf, data);
                    } else {
                        if (print_debug_to_console)
                            console.log("no private key, SRP auth forced");
                        $('.login').show();
                    }
                }

            },
            fail: function () {
                console.error("network error");
                setTimeout(updateData, data_update_interval);
            }
        })

    }



    function updateCapture() {
        var kf = new KeyFile();

        var obj = {
            "action": "get_capture",
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
                    if (print_debug_to_console)
                        console.log("successfully loaded capture, decrypting");
                    decryptCapture(kf, data);

                }

            },
            fail: function () {
                console.error("network error while getting capture");
            }
        })

    }

    function decryptData(kf, data) {
        if (print_debug_to_console)
            console.log("decrypting \n" + JSON.stringify(data));
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());
        var res = rsa.decrypt(data["key_cipher"]);
        if (print_debug_to_console)
            console.log("symmetric key is " + res);
        var key = cryptoHelpers.toNumbers(res); //creating key
        var cipher = data["parameters"];
        var bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //decoding cipher
        var bytes = slowAES.decrypt(bytesToDecrypt, global_aes_mode, key, key); //decrypting message
        var plain = cryptoHelpers.decode_utf8(cryptoHelpers.convertByteArrayToString(bytes)); //decoding utf-8
        if (print_debug_to_console)
            console.log("Data decrypted: " + plain);
        //try 
        {
            var pk = kf.getBoxKey(kf.boxId);

            var rsa = new RSAKey();
            rsa.setPublic(pk, global_rsa_e);
            var isValid = rsa.verifyString(cipher, data["digest"]); //checking signature with sender's public key
            if (isValid) {
                if (print_debug_to_console)
                    console.log("Valid digest");
                updatePage(plain);
            } else {
                if (print_debug_to_console)
                    console.log("Digest not valid!");
            }

        } /*catch (e) {
         if (print_debug_to_console) console.log("Error checking digest");
         }*/
    }

    function decryptCapture(kf, data) {
        var rsa = new RSAKey();
        rsa.setPrivate(kf.getMyPublicKey(), global_rsa_e, kf.getMyPrivateKey());

        for (var camKey in data) {
            try {
                var camNameStr = camKey.toString();
                var begin = Date.now();
                var extIndex = camNameStr.toLowerCase().indexOf(".jpg");
                if (extIndex < 0)
                    continue;

                if (print_debug_to_console)
                    console.log("decrypting capture " + camNameStr);
                camNameStr = camNameStr.substring(0, extIndex);
                var cam = data[camKey];
                var res = rsa.decrypt(cam["key_cipher"]);
                if (print_debug_to_console)
                    console.log("symmetric key is " + res);
                var key = cryptoHelpers.toNumbers(res); //creating key
                var cipher = cam["img_cipher"];
                var bytesToDecrypt = cryptoHelpers.toNumbers(cipher); //decoding cipher
                var bytes = slowAES.decrypt(bytesToDecrypt, global_aes_mode, key, key); //decrypting 

                var imgDate = cam["img_date"];

                var imgElementId = "video_cam_" + camNameStr;
                var imgElement = document.getElementById(imgElementId);
                if (imgElement !== "undefined") {
                    if (print_debug_to_console)
                        console.log("Updating element " + imgElementId + " size: " + bytes.length + " date: " + imgDate);
                    imgElement.src = "data:image/jpeg;base64," + btoa(String.fromCharCode.apply(null, bytes));
                    var captureDate = new Date(imgDate);
                    $("#video--date").html(captureDate.getDay() + "." + captureDate.getMonth() + "." + captureDate.getFullYear() + ",");

                    $("#video--time").html(captureDate.getHours() + ":" + captureDate.getMinutes());
                    if (print_debug_to_console)
                        console.log(camNameStr + " updated, time=" + (Date.now() - begin) + " ms");
                }

            } catch (e) {
                console.error("error decypting capture " + e);
            }
        }
    }

    function authWithRSA(kf, data) {
        var challenge = data["challenge"];
        if (print_debug_to_console)
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
                    if (print_debug_to_console)
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


});