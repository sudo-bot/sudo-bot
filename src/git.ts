'use strict';

import { Octokit } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';
import { components } from '@octokit/openapi-types';
import gpg from './gpg';
import { LocalFile } from './files';

/**
 * Authenticate
 */
function auth(jwt: string): Promise<Octokit> {
    return new Promise((resolve, reject) => {
        const installationId: string = process.env.INSTALLATION_ID || '';
        if (installationId === '') {
            reject(new Error('Missing INSTALLATION_ID ENV.'));
            return;
        }
        const octokitJwtInstance = new Octokit({
            auth: jwt,
        });
        octokitJwtInstance.apps
            .createInstallationAccessToken({
                installation_id: parseInt(installationId),
            })
            .then((res) => {
                let octokitTokenInstance: Octokit = new Octokit({
                    auth: res.data.token,
                });
                resolve(octokitTokenInstance);
            })
            .catch(reject);
    });
}

/**
 * Send files in a commit
 * @param {Octokit} octokit The Octokit instance
 * @param {string} commitMsg The commit message
 * @param {LocalFile[]} files The files
 * @param {string} defaultBranch The default branch for base commit
 * @param {string} targetBranch The target branch for the commit
 */
function sendFiles(
    octokit: Octokit,
    commitMsg: string,
    files: LocalFile[],
    defaultBranch: string = 'main',
    targetBranch: string = 'refs/heads/update/' + new Date(new Date().toUTCString()).getTime()
): Promise<{
    ref: any;
    commit: any;
}> {
    return new Promise((resolve, reject) => {
        const owner = process.env.OWNER || '';
        const repo = process.env.REPO || '';
        octokit.repos
            .listCommits({ owner, repo, sha: defaultBranch, per_page: 1 })
            .then((commitsres) => {
                const lastCommit: string = commitsres.data[0].sha as string;
                const commitDate = new Date(new Date().toUTCString());
                const identity = {
                    name: process.env.BOT_NAME,
                    email: process.env.BOT_EMAIL,
                    date: commitDate.toISOString(), //YYYY-MM-DDTHH:MM:SSZ
                };
                const unixTime = Math.floor(commitDate.valueOf() / 1000);

                //@see: https://developer.github.com/v3/git/trees/#create-a-tree
                octokit.git
                    .createTree({
                        owner,
                        repo,
                        tree: files.map((file) => {
                            return {
                                mode: '100644', // The file mode; one of 100644 for file (blob)
                                type: 'blob',
                                path: file.path,
                                content: file.content,
                            };
                        }),
                        base_tree: lastCommit,
                    })
                    .then((treeres) => {
                        let gpgMsg =
                            'tree ' +
                            treeres.data.sha +
                            '\n' +
                            'parent ' +
                            lastCommit +
                            '\n' +
                            'author ' +
                            identity.name +
                            ' <' +
                            identity.email +
                            '> ' +
                            unixTime +
                            ' +0000' +
                            '\n' +
                            'committer ' +
                            identity.name +
                            ' <' +
                            identity.email +
                            '> ' +
                            unixTime +
                            ' +0000' +
                            '\n\n' +
                            commitMsg;
                        gpg.signCommit(gpgMsg)
                            .then((signature) => {
                                octokit.git
                                    .createCommit({
                                        owner,
                                        repo,
                                        message: commitMsg,
                                        tree: treeres.data.sha,
                                        parents: [lastCommit],
                                        committer: identity,
                                        author: identity,
                                        signature: signature,
                                    })
                                    .then((resultcommit) => {
                                        //console.log('Commit: ', resultcommit.data);
                                        octokit.git
                                            .createRef({
                                                owner,
                                                repo,
                                                ref: targetBranch,
                                                sha: resultcommit.data.sha,
                                            })
                                            .then((resultrefcreate) => {
                                                /*console.log(
                                                    'Ref-url: ',
                                                    resultrefcreate.data.url
                                                );*/
                                                resolve({
                                                    ref: resultrefcreate.data,
                                                    commit: resultcommit.data,
                                                });
                                            });
                                    })
                                    .catch(reject);
                            })
                            .catch(reject);
                    })
                    .catch(reject);
            })
            .catch(reject);
    });
}

/**
 * Create a pull-request
 * @param {Octokit} octokit The Octokit instance
 * @param {string} title The title
 * @param {string} sourceBranch The source branch
 * @param {string} targetBranch The target branch
 * @param {string} message The message
 * @param {boolean} mcm Maintainers can modify
 */
function createPullRequest(
    octokit: Octokit,
    title: string,
    sourceBranch: string,
    targetBranch: string,
    message: string,
    mcm: boolean = true
): Promise<OctokitResponse<any>> {
    return octokit.pulls.create({
        owner: process.env.OWNER || '',
        repo: process.env.REPO || '',
        title,
        head: sourceBranch,
        base: targetBranch,
        body: message,
        maintainer_can_modify: mcm,
    });
}

/**
 *
 * @param {Octokit} octokit The Octokit instance
 * @param {number} number The issue or PR id
 * @param {string[]} assignees The assignees
 */
function addAssignees(
    octokit: Octokit,
    number: number,
    assignees: string[]
): Promise<OctokitResponse<components['schemas']['issue-simple']>> {
    return octokit.issues.addAssignees({
        owner: process.env.OWNER || '',
        repo: process.env.REPO || '',
        issue_number: number,
        assignees: assignees,
    });
}

export default {
    addAssignees: addAssignees,
    createPullRequest: createPullRequest,
    sendFiles: sendFiles,
    auth: auth,
};
