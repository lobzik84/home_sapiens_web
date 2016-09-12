var ls = localStorage;

function KeyFile() {
    this.id = ls["userId"];
    //if (this.id !)
    var that = this;
    this.xhr = null;

    this.initKeyFile = function(newId, private, public, pbkdf) {
        this.id = newId.toString();
        ls["userId"] = newId;
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
            var params = "id=" + this.id + "&kfCipher=" + kfCipher;
            this.xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            this.xhr.send(params);
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

    this.addUserKey = function(userId, key) {
        ls[this.id + ".keys.user." + userId] = key;
        return;
    }

    this.getUserKey = function(userId) {
        return ls[this.id + ".keys.user." + userId];
    }

    this.addGroupKey = function(groupId, key) {
        ls[this.id + ".keys.group." + groupId + ".now"] = key;
    }

    this.addAllGroupKeys = function(kfstr) {
        var prefix = this.id + ".keys.group.";
        var arr = kfstr.split("\n");
        for (i = 0; i < arr.length; i++) {
            var kv = arr[i].split(":");
            if (kv.length == 2)
                ls[prefix + kv[0]] = kv[1];
        }
    }

    this.updateGroupKeys = function(groupId, key, dateFrom) {
        ls[this.id + ".keys.group." + groupId + "." + dateFrom] = ls[this.id + ".keys.group." + groupId + ".now"];
        ls[this.id + ".keys.group." + groupId + ".now"] = key;
    }

    this.getGroupKey = function(groupId, date) {
        var prefix = this.id + ".keys.group." + groupId + ".";
        var actual = "now";
        if (date != null) {
            //select key nearest older than date
            for (i = 0; i < ls.length; i++) {
                var key = ls.key(i);
                if (key != null && key.toString().substring(0, prefix.length) == prefix) {
                    var keyValidTill = key.substring(prefix.length);
                    if (keyValidTill != "now" && keyValidTill > date)
                        if (actual == "now" || keyValidTill < actual)
                            actual = keyValidTill;
                }
            }
        }
        return ls[prefix + actual];
    }

    this.getAllGroupKeysAsString = function(groupId) {
        var prefix = this.id + ".keys.group." + groupId + ".";

        var kf = "";
        for (i = 0; i < ls.length; i++) {
            var key = ls.key(i);
            if (key != null && key.toString().substring(0, prefix.length) == prefix)
                kf += key.toString().substring(prefix.length - groupId.toString().length - 1) + ":" + ls[key] + "\n";

        }
        return kf;
    }
    
    this.clearAllGroupKeys = function(groupId) {
        var prefix = this.id + ".keys.group." + groupId.toString() + ".";
        var keysToRemove = [];
        for (i = 0; i < ls.length; i++) {
            var key = ls.key(i);
            if (key != null && key.toString().substring(0, prefix.length) == prefix) {
                keysToRemove.push(key);
            }
        }
        for (i = 0; i < keysToRemove.length; i++) {
            ls.removeItem(keysToRemove[i]);
        }
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