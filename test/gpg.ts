'use strict';

import gpg from '../src/gpg';
import { expect } from 'chai';
import { suite, before } from 'mocha';

suite('gpg', function () {
    before(() => {
        process.env = {};
        process.env.GPG_PRIV_PATH = process.env.GPG_PRIV_PATH || __dirname + '/data/sudo-bot-test.priv';
        process.env.GPG_PUB_PATH = process.env.GPG_PUB_PATH || __dirname + '/data/sudo-bot-test.pub';
        process.env.GPG_PRIV_PASSWORD = process.env.GPG_PRIV_PASSWORD || 'fYWwRmbkcd3tXSqcCrjWBCFBhzEW6ASP98zcSH';
    });
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
