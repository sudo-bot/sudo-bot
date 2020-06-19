'use strict';

import files from '../src/files';
import * as fs from 'fs';
import { expect } from 'chai';
import { suite } from 'mocha';

suite('files', function () {
    test('filterAllowedFiles', function (done) {
        process.env.DOT_IGNORE = __dirname + '/data/.sudoignore';
        const fileFiltered = files.filterAllowedFiles(['ignore-file.json', 'package-lock.json', 'a-ignore-file.json']);
        expect(fileFiltered).to.deep.equal(['package-lock.json', 'a-ignore-file.json']);
        done();
    });
    test('listGitModifiedFiles', function (done) {
        const repoDir = __dirname + '/data/testrepo/';
        process.env.REPO_DIR = repoDir;
        files.deleteFolderRecursive(repoDir + '.git');
        fs.mkdirSync(repoDir + '.git');
        const git = require('simple-git')(repoDir);
        git.init(false, () => {
            fs.writeFileSync(repoDir + 'README.md', '#test');
            git.add('.', () => {
                git.commit(
                    '__INIT__',
                    ['README.md'],
                    {
                        '--no-gpg-sign': null,
                    },
                    () => {
                        fs.writeFileSync(repoDir + 'README.md', '# changed');
                        files.listGitModifiedFiles(
                            repoDir,
                            (modifiedFiles) => {
                                expect(modifiedFiles).to.deep.equal(['README.md']);
                                fs.unlinkSync(repoDir + 'README.md');
                                files.deleteFolderRecursive(repoDir + '.git');
                                done();
                            },
                            () => {}
                        );
                    }
                );
            });
        });
    });
    test('getModifiedFiles', function (done) {
        const repoDir = __dirname + '/data/testrepo/';
        process.env.REPO_DIR = repoDir;
        fs.writeFileSync(repoDir + 'README.md', '#test');
        const modifiedFiles = files.getModifiedFiles(['README.md']);
        expect(modifiedFiles).to.deep.equal([
            {
                content: '#test',
                path: 'README.md',
            },
        ]);
        fs.unlinkSync(repoDir + 'README.md');
        done();
    });
    test('base64Encode', function (done) {
        const repoDir = __dirname + '/data/testrepo/';
        process.env.REPO_DIR = repoDir;
        fs.writeFileSync(repoDir + 'README.md', '#test');
        const bs64content = files.base64Encode(repoDir + 'README.md');
        expect(bs64content).to.equal('I3Rlc3Q=');
        fs.unlinkSync(repoDir + 'README.md');
        done();
    });
    test('deleteFolderRecursive', function (done) {
        files.deleteFolderRecursive('.efefefefzfzfef');
        done();
    });
});
