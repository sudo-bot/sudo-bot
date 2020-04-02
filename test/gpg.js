'use strict';

const gpg = require(__dirname + '/../src/gpg');
const expect = require('chai').expect;

module.exports = function () {
    suite('gpg', function () {
        test('testAutoSign', function (done) {
            const testMessage = '';
            gpg.signCommit(testMessage)
                .then((signature) => {
                    gpg.verifySignature(signature, testMessage)
                        .then((res) => {
                            if (res.valid) {
                                done();
                            } else {
                                throw new Error('Invalid signature !');
                            }
                        })
                        .catch((err) => {
                            throw err;
                        });
                })
                .catch((err) => {
                    throw err;
                });
        }).timeout('10s');
        test('testSign', function (done) {
            const testMessage = '';
            gpg.signCommit(testMessage)
                .then((signature) => {
                    expect(signature).to.include('-----BEGIN PGP SIGNATURE-----\n\n');
                    expect(signature).to.include('\n-----END PGP SIGNATURE-----\n');
                    done();
                })
                .catch((err) => {
                    throw err;
                });
        }).timeout('10s');
    });
};
