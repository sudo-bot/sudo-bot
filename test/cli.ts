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
    test('--env APP_ID missing', function (done) {
        process.env.INSTALLATION_ID = '';
        process.env.APP_ID = '';
        process.env.REPO_DIR = __dirname + '/../';
        process.env.DOT_IGNORE = __dirname + '/../.gitignore';
        exec(__dirname + '/../bin/sudo-bot.js --env ' + __dirname + '/../.env.dist', (err, stdout, stderr) => {
            expect(stderr).to.contain('Error: Missing APP_ID ENV.');
            expect(stdout).to.equal('');
            done();
        });
    });
    test('--env INSTALLATION_ID missing', function (done) {
        process.env.INSTALLATION_ID = '';
        process.env.APP_ID = '123654';
        process.env.REPO_DIR = __dirname + '/../';
        process.env.DOT_IGNORE = __dirname + '/../.gitignore';
        exec(__dirname + '/../bin/sudo-bot.js --env ' + __dirname + '/../.env.dist', (err, stdout, stderr) => {
            expect(stderr).to.contain('Error: Missing INSTALLATION_ID ENV.');
            expect(stdout).to.equal('');
            done();
        });
    });
});
