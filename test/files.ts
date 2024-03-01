'use strict';

import files from '../src/files';
import * as fs from 'fs';
import { expect } from 'chai';
import { suite } from 'mocha';
import simpleGit, { SimpleGit } from 'simple-git';

suite('files', function () {
    const repoDir = __dirname + '/data/testrepo/';
    test('filterAllowedFiles', function (done) {
        const fileFiltered = files.filterAllowedFiles(__dirname + '/data/.sudoignore', [
            'ignore-file.json',
            'package-lock.json',
            'a-ignore-file.json',
        ]);
        expect(fileFiltered).to.deep.equal(['package-lock.json', 'a-ignore-file.json']);
        done();
    });
    test('listGitModifiedFiles', function (done) {
        files.deleteFolderRecursive(repoDir + '.git');
        fs.mkdirSync(repoDir + '.git');
        const git: SimpleGit = simpleGit(repoDir);
        git.init(false)
            .then(() => {
                git.addConfig('user.email', 'sudo-bot@wdes.fr');
                git.addConfig('user.name', 'Sudo Bot');
                fs.writeFileSync(repoDir + 'README.md', '#test');
                git.add('.')
                    .then(() => {
                        git.commit('__INIT__', ['README.md'], {
                            '--no-gpg-sign': null,
                        })
                            .then(() => {
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
                            })
                            .catch(done);
                    })
                    .catch(done);
            })
            .catch(done);
    });
    test('getModifiedFiles', function (done) {
        const repoDir = __dirname + '/data/testrepo/';
        fs.writeFileSync(repoDir + 'README.md', '#test');
        const modifiedFiles = files.getModifiedFiles(repoDir, ['README.md']);
        expect(modifiedFiles).to.deep.equal([
            {
                content: '#test',
                path: 'README.md',
                is_deleted: false,
            },
        ]);
        fs.unlinkSync(repoDir + 'README.md');
        done();
    });
    test('listGitModifiedFiles with delete', function (done) {
        files.deleteFolderRecursive(repoDir + '.git');
        fs.mkdirSync(repoDir + '.git');
        const git: SimpleGit = simpleGit(repoDir);
        git.init(false)
            .then(() => {
                git.addConfig('user.email', 'sudo-bot@wdes.fr');
                git.addConfig('user.name', 'Sudo Bot');
                fs.writeFileSync(repoDir + 'README.md', '#test');
                git.add('.')
                    .then(() => {
                        git.commit('__INIT__', ['README.md'], {
                            '--no-gpg-sign': null,
                        })
                            .then(() => {
                                fs.unlinkSync(repoDir + 'README.md');
                                files.listGitModifiedFiles(
                                    repoDir,
                                    (modifiedFiles) => {
                                        expect(modifiedFiles).to.deep.equal(['README.md']);
                                        const modifiedFilesContents = files.getModifiedFiles(repoDir, modifiedFiles);
                                        expect(modifiedFilesContents).to.deep.equal([
                                            {
                                                content: '',
                                                path: 'README.md',
                                                is_deleted: true,
                                            },
                                        ]);
                                        files.deleteFolderRecursive(repoDir + '.git');
                                        done();
                                    },
                                    (err) => {
                                        done(err);
                                    }
                                );
                            })
                            .catch(done);
                    })
                    .catch(done);
            })
            .catch(done);
    });
    test('getModifiedFiles does not exist', function (done) {
        const repoDir = __dirname + '/data/testrepo/';
        const modifiedFiles = files.getModifiedFiles(repoDir, ['README.not-found']);
        expect(modifiedFiles).to.deep.equal([
            {
                content: '',
                path: 'README.not-found',
                is_deleted: true,
            },
        ]);
        done();
    });
    test('base64Encode', function (done) {
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
