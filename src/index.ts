'use strict';

import jwt from './jwt';
import git from './git';
import files from './files';
import TemplateInterface from './TemplateInterface';
import { Octokit } from '@octokit/rest';

interface DataParams {
    repositorySlug: string;
    usernamesAssigned: string | null;
    repoDir: string;
    GitHubInstallationId: string;
    GitHubAppId: string;
    jwtFile: string;
    dotIgnoreFile: string | null;
    enableLogging: boolean;
    targetBranch: string;
    template: TemplateInterface;
    authorIdentity: {
        name: string;
        email: string;
    };
    privateKey: {
        file: string;
        passphrase: string;
    };
}

const processModifiedFiles = (p: DataParams, modifiedFiles: string[]) => {
    if (p.enableLogging) {
        console.log('Listing OK !');
    }
    const dotIgnoreEnabled: boolean = typeof p.dotIgnoreFile === 'string';

    const filteredFiles = files.filterAllowedFiles(dotIgnoreEnabled ? p.dotIgnoreFile : null, modifiedFiles);
    if (p.enableLogging) {
        console.log('Filtering OK !');
        console.log('Original', modifiedFiles);
        console.log('Dot ignore enabled:', dotIgnoreEnabled);
        console.log('Filter', filteredFiles);
    }
    if (filteredFiles.length === 0) {
        if (p.enableLogging) {
            console.log('No files to send, skipping !');
        }
        return;
    }
    const slugParts = p.repositorySlug.split('/');
    const { repoOwner, repoName } = { repoOwner: slugParts[0], repoName: slugParts[1] };
    if (p.enableLogging) {
        console.log('Repository: ' + p.repositorySlug);
    }
    if (p.enableLogging) {
        console.log('AppId: ' + p.GitHubAppId);
    }
    git.auth(p.repositorySlug, jwt.jsonwebtoken(p.GitHubAppId, p.jwtFile), p.GitHubInstallationId)
        .then((octokit: Octokit) => {
            if (p.enableLogging) {
                console.log('Login OK !');
                console.log('Sending ...');
            }
            git.sendFiles(
                repoOwner,
                repoName,
                octokit,
                p.template.commitMessage(filteredFiles),
                files.getModifiedFiles(p.repoDir, filteredFiles),
                p.targetBranch,
                p.template.prBranch(filteredFiles),
                p.authorIdentity,
                p.privateKey
            )
                .then((result) => {
                    if (p.enableLogging) {
                        console.log('Files sent !');
                    }
                    git.createPullRequest(
                        repoOwner,
                        repoName,
                        octokit,
                        p.template.prMessage(filteredFiles),
                        result.ref.ref,
                        p.targetBranch,
                        p.template.prContent(filteredFiles)
                    )
                        .then((pullRequest) => {
                            if (p.enableLogging) {
                                console.log('PR done !');
                            }
                            if (typeof p.usernamesAssigned === 'string') {
                                const assignees = p.usernamesAssigned.split(',').map((as) => as.trim());
                                git.addAssignees(repoOwner, repoName, octokit, pullRequest.data.number, assignees)
                                    .then((res) => {
                                        if (p.enableLogging) {
                                            console.log(
                                                'Assigned : ' +
                                                    (res.data.assignees || []).map((as) => (as as any).login).join(',')
                                            );
                                        }
                                    })
                                    .catch((err) => {
                                        console.error(err);
                                        process.exitCode = 1;
                                    });
                            } else {
                                if (p.enableLogging) {
                                    console.log('Nobody to assign.');
                                }
                            }
                        })
                        .catch((err) => {
                            console.error(err);
                            process.exitCode = 1;
                        });
                })
                .catch((err) => {
                    console.error(err);
                    process.exitCode = 1;
                });
        })
        .catch((err) => {
            console.error(err);
            process.exitCode = 1;
        });
};

/**
 * Process the imported template file
 * @param {boolean} enableLogging Enable logging
 * @param {string} targetBranch The target branch
 * @param {TemplateInterface} templates The template
 */
const processPostImport = function (p: DataParams): void {
    if (p.enableLogging) {
        console.log('Listing ...');
    }
    files.listGitModifiedFiles(
        p.repoDir,
        (modifiedFiles) => {
            if (p.enableLogging) {
                console.log('Modified files before filtering:', modifiedFiles.length);
            }

            return processModifiedFiles(p, modifiedFiles);
        },
        (err) => {
            console.error('Error:', err.message);
        }
    );

    if (p.enableLogging) {
        console.log('Done !');
    }
};

type onSuccess = (template: TemplateInterface) => void;

export const doImportTemplate = function (enableLogging: boolean, templateFile: string | null, success: onSuccess) {
    import('./templates').then((defaultTemplate) => {
        var template: TemplateInterface = defaultTemplate.default;
        //defaultTemplate
        if (typeof templateFile === 'string' && templateFile !== '') {
            if (enableLogging) {
                console.log('Loading custom template: ' + templateFile);
            }
            template = require(templateFile);
        } else {
            if (enableLogging) {
                console.log('Normal template loaded');
            }
        }
        if (typeof template.commitMessage !== 'function') {
            console.error('The template seems invalid');
            process.exit();
        }
        success(template);
    });
};

/**
 * Get modifications and create a PR
 */
export const doProcess = function (
    enableLogging: boolean,
    targetBranch: string,
    dotIgnoreFile: string | '',
    templateFile: string | '',
    usernamesAssigned: string | '',
    repositorySlug: string,
    GitHubInstallationId: string,
    GitHubAppId: string,
    jwtFile: string,
    repoDir: string,
    commitAuthorEmail: string,
    commitAuthorName: string,
    gpgPrivateKeyFile: string,
    gpgPrivateKeyPassphrase: string
): void {
    if (enableLogging) {
        console.log('Launching sudo bot ...');
    }
    doImportTemplate(enableLogging, templateFile, (template) => {
        const dataParams: DataParams = {
            enableLogging,
            targetBranch,
            dotIgnoreFile: dotIgnoreFile === '' ? null : dotIgnoreFile,
            template,
            usernamesAssigned: usernamesAssigned === '' ? null : usernamesAssigned,
            repositorySlug,
            GitHubInstallationId,
            GitHubAppId,
            jwtFile,
            repoDir,
            authorIdentity: {
                email: commitAuthorEmail,
                name: commitAuthorName,
            },
            privateKey: {
                file: gpgPrivateKeyFile,
                passphrase: gpgPrivateKeyPassphrase,
            },
        };
        processPostImport(dataParams);
    });
};
export * from './TemplateInterface';
