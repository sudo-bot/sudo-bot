'use strict';

import * as openpgp from 'openpgp';
import * as fs from 'fs';
openpgp.config.showComment = false;
openpgp.config.showVersion = false;

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
                        openpgp
                            .createMessage({ text: messageRaw })
                            .then((message) => {
                                openpgp
                                    .sign({
                                        message: message,
                                        signingKeys: privateKey,
                                        detached: true,
                                        format: 'armored',
                                    })
                                    .then((signature) => {
                                        resolve(signature as string);
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
