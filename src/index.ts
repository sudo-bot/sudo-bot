'use strict';

import jwt from './jwt';
import git from './git';
import files from './files';
import templates from './templates';

/**
 * Get modifications and create a PR
 * @param {boolean} enableLogging Enable logging
 * @param {string} targetBranch The target branch
 * @param {string} envFile Path to the .env file
 */
export const doProcess = function (enableLogging: boolean, targetBranch: string, envFile: string): void {
    if (enableLogging) {
        console.log('Launching sudo bot ...');
    }

    require('dotenv').config({ path: envFile });

    if (enableLogging) {
        console.log('Listing ...');
    }
    files.listGitModifiedFiles(
        process.env.REPO_DIR || '',
        (modifiedFiles) => {
            if (enableLogging) {
                console.log('Listing OK !');
            }
            const filteredFiles = files.filterAllowedFiles(modifiedFiles);
            if (enableLogging) {
                console.log('Filtering OK !');
                console.log('Original', modifiedFiles);
                console.log('Filter', filteredFiles);
            }
            if (filteredFiles.length === 0) {
                if (enableLogging) {
                    console.log('No files to send, skipping !');
                }
                return;
            }
            git.auth(jwt.jsonwebtoken(process.env.APP_ID || ''))
                .then((octokit) => {
                    if (enableLogging) {
                        console.log('Login OK !');
                        console.log('Sending ...');
                    }
                    git.sendFiles(
                        octokit,
                        templates.commitMessage(filteredFiles),
                        files.getModifiedFiles(filteredFiles),
                        targetBranch,
                        templates.prBranch(filteredFiles)
                    )
                        .then((result) => {
                            if (enableLogging) {
                                console.log('Files sent !');
                            }
                            git.createPullRequest(
                                octokit,
                                templates.prMessage(filteredFiles),
                                result.ref.ref,
                                targetBranch,
                                templates.prContent(filteredFiles)
                            )
                                .then((pullRequest) => {
                                    if (enableLogging) {
                                        console.log('PR done !');
                                    }
                                    if (typeof process.env.ASSIGN_USERS === 'string') {
                                        const assignees = process.env.ASSIGN_USERS.split(',').map((as) => as.trim());
                                        git.addAssignees(octokit, pullRequest.data.number, assignees)
                                            .then((res) => {
                                                if (enableLogging) {
                                                    console.log(
                                                        'Assigned : ' +
                                                            res.data.assignees.map((as) => as.login).join(',')
                                                    );
                                                }
                                            })
                                            .catch((err) => {
                                                console.error(err);
                                            });
                                    } else {
                                        if (enableLogging) {
                                            console.log('Nobody to assign.');
                                        }
                                    }
                                })
                                .catch((err) => {
                                    console.error(err);
                                });
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                })
                .catch((err) => {
                    console.error(err);
                });
        },
        (err) => {
            console.error('Error: ', err.message);
        }
    );

    if (enableLogging) {
        console.log('Done !');
    }
};
