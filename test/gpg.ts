'use strict';

import gpg from '../src/gpg';
import { expect } from 'chai';
import { suite, before } from 'mocha';

suite('gpg', function () {
    test('testSign', function (done) {
        const testMessage = 'testok';
        gpg.signCommit(testMessage, {
            file: __dirname + '/data/sudo-bot-test.priv',
            passphrase: 'fYWwRmbkcd3tXSqcCrjWBCFBhzEW6ASP98zcSH',
        })
            .then((signature) => {
                expect(signature).to.not.include('-----BEGIN PGP SIGNED MESSAGE-----');
                expect(signature).to.not.include('Hash: SHA512');
                expect(signature).to.not.include('testok', "because it's a detached signature");
                expect(signature).to.include('-----BEGIN PGP SIGNATURE-----\n\n');
                expect(signature).to.include('\n-----END PGP SIGNATURE-----\n');
                done();
            })
            .catch((err) => done(err));
    }).timeout('10s');
});
