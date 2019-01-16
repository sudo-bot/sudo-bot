'use strict';

const openpgp = require('openpgp');
const fs = require('fs');
openpgp.config.show_comment = false;
openpgp.config.show_version = false;

/**
 * Encode the message
 * @param {string} messageRaw The raw message
 */
const encodeMsg = function(messageRaw) {
    return openpgp.message.fromBinary(Buffer.from(messageRaw, 'utf8'));
};

/**
 * Sign a message
 * @param {string} messageRaw The raw message
 */
const signCommit = function(messageRaw) {
    const privateKeyRaw = fs.readFileSync(process.env.GPG_PRIV_PATH).toString('utf8');
    //console.log("rawmsg: ", { messageRaw });
    return new Promise((resolve, reject) => {
        const message = encodeMsg(messageRaw);
        openpgp.key.readArmored(privateKeyRaw).then(privKeys => {
            const privateKeys = privKeys.keys;
            privateKeys.map(key => {
                key.decrypt(process.env.GPG_PRIV_PASSWORD);
                /*console.log("pub", key.isPublic());
                console.log("priv", key.isPrivate());
                console.log("uids", key.getUserIds());
                console.log("fprint",key.primaryKey.getFingerprint());
                console.log("keyid", key.primaryKey.getKeyId().toHex().toUpperCase());
                key.subKeys.map(subKey=>{
                    console.log(subKey);
                    //subKey.decrypt(process.env.GPG_PRIV_PASSWORD);
                });*/
            });
            /*console.log(privateKeys[0].subKeys);
            privateKeys[0].getKeyIds().map(key => {
                console.log("x-keyid",key.toHex().toUpperCase());
            });
            privateKeys.map(key => {
                console.log("pub", key.isPublic());
                console.log("priv", key.isPrivate());
                console.log("uids", key.getUserIds());
                console.log("fprint",key.primaryKey.getFingerprint());
                console.log("keyid", key.primaryKey.getKeyId().toHex().toUpperCase());
            });
            console.log("keyid-primary", privateKeys[0].primaryKey.getKeyId().toHex().toUpperCase());
            console.log("keyid",privateKeys[0].keyPacket.keyid.toHex().toUpperCase())
            */
            const options = {
                message: message,
                privateKeys: privateKeys,
                detached: true,
            };

            openpgp
                .sign(options)
                .then(signed => {
                    resolve(signed.signature.replace(/\r\n/g, '\n'));
                })
                .catch(reject);
        });
    });
};

/**
 * Verify that a GPG signature is valid and verified
 * @param {string} signatureRaw The raw signature
 * @param {string} messageRaw The raw message
 */
const verifySignature = function(signatureRaw, messageRaw) {
    const publicKeyRaw = fs.readFileSync(process.env.GPG_PUB_PATH).toString('utf8');
    //console.log("rawmsg: ", { messageRaw, signatureRaw });
    return new Promise((resolve, reject) => {
        const message = encodeMsg(messageRaw);
        openpgp.signature.readArmored(signatureRaw).then(resSignature => {
            const signature = resSignature;
            openpgp.key.readArmored(publicKeyRaw).then(pubKeys => {
                const publicKeys = pubKeys.keys;

                const options = {
                    message: message,
                    signature: signature,
                    publicKeys: publicKeys,
                };

                openpgp
                    .verify(options)
                    .then(function(verified) {
                        //console.log("Key ID: ", verified.signatures[0].keyid.toHex().toUpperCase())
                        //console.log("Signature Valid: ", verified.signatures[0].valid)
                        resolve({
                            valid: verified.signatures[0].valid,
                            keyId: verified.signatures[0].keyid.toHex().toUpperCase(),
                        });
                    })
                    .catch(reject);
            });
        });
    });
};

module.exports = {
    verifySignature: verifySignature,
    signCommit: signCommit,
};
