var global_serverJSONUrl = "http://moidom.molnet.ru/hs/json";
var global_rsa_e="10001";

$(function () {
    var rsa = new RSAKey();
    var srp = new SRP();
    rsa.generate(1024, global_rsa_e); //1024 bits, public exponent = 10001
    console.log("public key" + rsa.n.toString(16));

});
