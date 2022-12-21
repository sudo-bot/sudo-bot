'use strict';

import * as openpgp from 'openpgp';
import * as fs from 'fs';
openpgp.config.showComment = false;
openpgp.config.showVersion = false;

/**
 * Encode the message
 * @param {string} messageRaw The raw message
 */
const encodeMsg = function (messageRaw: string) {
    return openpgp.createCleartextMessage({ text: messageRaw });
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
    const privateKeyArmored = fs.readFileSync(privateKey.file).toString('utf8');
    const privateKeyPassphrase = privateKey.passphrase;

    return new Promise<string>((resolve, reject) => {
        openpgp
            .readPrivateKey({ armoredKey: privateKeyArmored })
            .then((privKey) => {
                openpgp
                    .decryptKey({
                        privateKey: privKey,
                        passphrase: privateKeyPassphrase,
                    })
                    .then((privateKey) => {
                        encodeMsg(messageRaw)
                            .then((message) => {
                                openpgp
                                    .sign({
                                        message: message, // CleartextMessage or Message object
                                        signingKeys: privateKey,
                                        detached: true,
                                    })
                                    .then((signature) => {
                                        resolve(signature.replace(/\r\n/g, '\n'));
                                    })
                                    .catch(reject);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
};

export default {
    signCommit: signCommit,
};
