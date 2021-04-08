'use strict';

import * as openpgp from 'openpgp';
import * as fs from 'fs';
openpgp.config.show_comment = false;
openpgp.config.show_version = false;

/**
 * Encode the message
 * @param {string} messageRaw The raw message
 */
const encodeMsg = function (messageRaw: string) {
    return openpgp.message.fromBinary(Buffer.from(messageRaw, 'utf8'));
};

/**
 * Sign a message
 * @param {string} messageRaw The raw message
 */
const signCommit = function (
    messageRaw: string,
    privateKey: {
        file: string;
        passphrase: string;
    }
): Promise<string> {
    const privateKeyRaw = fs.readFileSync(privateKey.file).toString('utf8');
    //console.log("rawmsg: ", { messageRaw });
    return new Promise<string>((resolve, reject) => {
        const message = encodeMsg(messageRaw);
        openpgp.key.readArmored(privateKeyRaw).then((privKeys) => {
            const privateKeys = privKeys.keys;
            privateKeys.map((key) => {
                key.decrypt(privateKey.passphrase);
            });
            const options = {
                message: message,
                privateKeys: privateKeys,
                detached: true,
            };

            openpgp
                .sign(options)
                .then((signed) => {
                    resolve(signed.signature.replace(/\r\n/g, '\n'));
                })
                .catch(reject);
        });
    });
};

export default {
    signCommit: signCommit,
};
