'use strict';

import { expect } from 'chai';
import { suite } from 'mocha';
import { exec } from 'child_process';

suite('cli', function () {
    test('--env missing', function (done) {
        exec(__dirname + '/../bin/sudo-bot.js', (err, stdout, stderr) => {
            expect(stderr).to.equal(
                '\n  error: option `--env <file>` missing\n\n  Try `sudo-bot --help` for more information.\n\n'
            );
            expect(stdout).to.equal('');
            done();
        });
    });
    test('--env missing', function (done) {
        exec(__dirname + '/../bin/sudo-bot.js --env ' + __dirname + '/../.env.dist', (err, stdout, stderr) => {
            expect(stderr).to.contain('Error: Missing INSTALLATION_ID ENV.');
            expect(stdout).to.equal('');
            done();
        });
    });
});
