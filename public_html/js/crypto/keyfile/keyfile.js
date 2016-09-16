var ls = localStorage;

function KeyFile() {
    this.userId = ls["userId"];
    this.boxId = ls["boxId"];
    this.id = this.userId + "." + this.boxId;
    //if (this.id !)
    var that = this;
    this.xhr = null;

    this.initKeyFile = function(newUserId, newBoxId, private, public, pbkdf) {
        this.userId = newUserId.toString();
        this.boxId = newBoxId.toString();
        this.id = this.userId + "." + this.boxId;
        ls["userId"] = newUserId;
        ls["boxId"] = newBoxId; 
        ls[this.id + ".keys.my.private"] = private;
        ls[this.id + ".keys.my.public"] = public;
        ls[this.id + ".pbkdf"] = pbkdf;
    }

    this.getKeyFileAsStirng = function() {
        var kf = "";
        for (i = 0; i < ls.length; i++) {
            var key = ls.key(i);
            if (key != null && key.toString().substring(0, this.id.length + 6) == this.id + ".keys.")
                kf += key + ":" + ls[key] + "\n";

        }
        return kf;
    }

    this.uploadKeyFile = function(url, uploadDone) {

        var pbkdf = ls[this.id + ".pbkdf"];
        var mode = slowAES.modeOfOperation.CFB;

        if (this.id == null || pbkdf == null)
            alert("ID or PBKDF not set!");
        else {
            var kf = this.getKeyFileAsStirng();

            var bytesToEncrypt = cryptoHelpers.convertStringToByteArray(kf);
            var key = cryptoHelpers.toNumbers(pbkdf);
            var cipherBytes = slowAES.encrypt(bytesToEncrypt, mode, key, key);
            var kfCipher = cryptoHelpers.toHex(cipherBytes);
            this.xhr = new XMLHttpRequest();
            this.xhr.onreadystatechange = uploadDone;
            this.xhr.open("POST", url, true);
            var paramsObj = {
                "id": this.id,
                "session_key": localStorage["session_key"],
                "action": "kf_upload",
                "kfCipher": kfCipher
            }
            
            this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.xhr.send(JSON.stringify(paramsObj));
        }

    }

    this.downloadKeyFile = function(url, downloadDone) {
        var pbkdf = ls[this.id + ".pbkdf"];
        var mode = slowAES.modeOfOperation.CFB;
        var callback = downloadDone;
        if (this.id == null || pbkdf == null)
            alert("ID or PBKDF not set!");
        this.xhr = new XMLHttpRequest();
        this.xhr.open('GET', url, true);

        this.xhr.overrideMimeType('text/plain; charset=x-user-defined');

        this.xhr.onreadystatechange = function(e) {
            if (this.readyState == 4 && this.status == 200) {
                var bytesToDecrypt = cryptoHelpers.toNumbers(this.responseText);
                var key = cryptoHelpers.toNumbers(pbkdf);
                var bytes = slowAES.decrypt(bytesToDecrypt, mode, key, key);
                kfstr = cryptoHelpers.convertByteArrayToString(bytes);
                if (kfstr.indexOf(that.id + ".keys.my.public:") >= 0) {
                    //alert ("KF!! " + kfstr);
                    var arr = kfstr.split("\n");
                    for (i = 0; i < arr.length; i++) {
                        var kv = arr[i].split(":");
                        if (kv.length == 2 && kv[0].indexOf(that.id + ".keys") == 0)
                            ls[kv[0]] = kv[1];
                    }

                    callback();
                }
                else {
                    alert("Got invalid keyfile: \n" + kfstr);
                    callback();
                }
            }
        }
        this.xhr.send();
    }

    this.getMyPublicKey = function() {
        return ls[this.id + ".keys.my.public"]
    }

    this.getMyPrivateKey = function() {
        return ls[this.id + ".keys.my.private"]
    }

    this.addBoxKey = function(boxId, key) {
        ls[this.id + ".keys.box." + boxId] = key;
        return;
    }

    this.getBoxKey = function(boxId) {
        return ls[this.id + ".keys.box." + boxId];
    }

    this.clearKeyFile = function() {
        for (i = 0; i < ls.length; i++) {
            var key = ls.key(i);
            if (key != null && key.toString().substring(0, this.id.length + 6) == this.id + ".keys.")
                ls.removeItem(key);

        }
    }

    this.clearLocal = function() {
        for (i = 0; i < ls.length; i++) {
            var key = ls.key(i);
            ls.removeItem(key);
        }
    }
}