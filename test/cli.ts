'use strict';

import { expect } from 'chai';
import { suite, before } from 'mocha';
import { execFile } from 'child_process';

suite('cli', function () {
    const binSudoBot: string = __dirname + '/../bin/sudo-bot.js';
    before(() => {
        process.env = {};
    });
    test('--jwt-file missing', function (done) {
        execFile(binSudoBot, (err, stdout, stderr) => {
            expect(err).to.not.equal(null);
            expect(stderr).to.equal(
                '\n  error: option `--jwt-file <jwtFile>` missing\n\n  Try `sudo-bot --help` for more information.\n\n'
            );
            expect(stdout).to.equal('');
            done();
        });
    });
    test('--gh-app-id missing', function (done) {
        execFile(binSudoBot, ['--jwt-file=' + __filename], {}, (err, stdout, stderr) => {
            expect(err).to.not.equal(null);
            expect(stderr).to.equal(
                '\n  error: option `--gh-app-id <GitHubAppId>` missing\n\n  Try `sudo-bot --help` for more information.\n\n'
            );
            expect(stdout).to.equal('');
            done();
        });
    });
    test('--installation-id missing', function (done) {
        execFile(binSudoBot, ['--jwt-file=' + __filename, '--gh-app-id=1234'], {}, (err, stdout, stderr) => {
            expect(err).to.not.equal(null);
            expect(stderr).to.equal(
                '\n  error: option `--installation-id <GitHubInstallationId>` missing\n\n  Try `sudo-bot --help` for more information.\n\n'
            );
            expect(stdout).to.equal('');
            done();
        });
    });
});
