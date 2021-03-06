'use strict';

import jwt from './jwt';
import git from './git';
import files from './files';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import TemplateInterface from './TemplateInterface';
import templates from './templates';

const processModifiedFiles = (
    enableLogging: boolean,
    modifiedFiles: string[],
    targetBranch: string,
    templates: TemplateInterface
) => {
    if (enableLogging) {
        console.log('Listing OK !');
    }
    const dotIgnoreEnabled: boolean = typeof process.env.DOT_IGNORE === 'string';

    const filteredFiles = files.filterAllowedFiles(
        dotIgnoreEnabled ? process.env.DOT_IGNORE || '' : null,
        modifiedFiles
    );
    if (enableLogging) {
        console.log('Filtering OK !');
        console.log('Original', modifiedFiles);
        console.log('Dot ignore enabled:', dotIgnoreEnabled);
        console.log('Filter', filteredFiles);
    }
    if (filteredFiles.length === 0) {
        if (enableLogging) {
            console.log('No files to send, skipping !');
        }
        return;
    }
    const appId: string = process.env.APP_ID || '';
    if (appId === '') {
        console.error(new Error('Missing APP_ID ENV.'));
        return;
    }
    git.auth(jwt.jsonwebtoken(appId))
        .then((octokit) => {
            if (enableLogging) {
                console.log('Login OK !');
                console.log('Sending ...');
                console.log('Template:', process.env.TEMPLATE_FILE || null);
            }
            git.sendFiles(
                octokit,
                templates.commitMessage(filteredFiles),
                files.getModifiedFiles(process.env.REPO_DIR || '', filteredFiles),
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
                                                    (res.data.assignees || []).map((as) => (as as any).login).join(',')
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
};

/**
 * Process the imported template file
 * @param {boolean} enableLogging Enable logging
 * @param {string} targetBranch The target branch
 * @param {TemplateInterface} templates The template
 */
const processPostImport = function (enableLogging: boolean, targetBranch: string, templates: TemplateInterface): void {
    if (enableLogging) {
        console.log('Listing ...');
    }
    files.listGitModifiedFiles(
        process.env.REPO_DIR || '',
        (modifiedFiles) => {
            if (enableLogging) {
                console.log('Modified files before filtering:', modifiedFiles.length);
            }
            return processModifiedFiles(enableLogging, modifiedFiles, targetBranch, templates);
        },
        (err) => {
            console.error('Error:', err.message);
        }
    );

    if (enableLogging) {
        console.log('Done !');
    }
};

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

    if (enableLogging) {
        if (fs.existsSync(envFile)) {
            console.log('DotEnv file exists !');
        } else {
            console.error('DotEnv does NOT exist at ' + envFile + ' !');
        }
    }

    dotenv.config({ path: envFile, debug: enableLogging ? true : undefined });

    import('./templates').then((templates) => {
        processPostImport(enableLogging, targetBranch, templates.default);
    });
};
export * from './TemplateInterface';
