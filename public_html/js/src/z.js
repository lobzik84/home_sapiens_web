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

        $.ajax ({
                    type: "POST",
                    url: global_serverJSONUrl,
                    dataType: 'json',
                    async: true,
                    data: JSON.stringify(regObj),
                    success: function (data) {
                        if (data["result"] == "success") {
                            alert("Successfully registered! UserId = " + data["new_user_id"]);
                            $('.registration').hide();
                            $('.home').show();
                        } else
                             alert("Error while registering: " + data["message"]);
                    },
                    fail: function () {
                        alert("Error while registering");
                    }
                })


    });
});