'use strict';

import { expect } from 'chai';
import { suite } from 'mocha';
import { exec } from 'child_process';

suite('cli', function () {
    const binSudoBot: string = __dirname + '/../bin/sudo-bot.js';
    test('--env missing', function (done) {
        exec(binSudoBot, (err, stdout, stderr) => {
            expect(err).to.not.equal(null);
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
        exec(binSudoBot + ' --env ' + __dirname + '/../.env.dist', (err, stdout, stderr) => {
            expect(err).to.equal(null);
            expect(stdout).to.equal('');
            expect(stderr).to.contain('Error: Missing APP_ID ENV.');
            done();
        });
    });
    test('--env INSTALLATION_ID missing', function (done) {
        process.env.INSTALLATION_ID = '';
        process.env.APP_ID = '123654';
        process.env.REPO_DIR = __dirname + '/../';
        process.env.DOT_IGNORE = __dirname + '/../.gitignore';
        exec(binSudoBot + ' --env ' + __dirname + '/../.env.dist', (err, stdout, stderr) => {
            expect(err).to.equal(null);
            expect(stdout).to.equal('');
            expect(stderr).to.contain('Error: Missing INSTALLATION_ID ENV.');
            done();
        });
    });
});
