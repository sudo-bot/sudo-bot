'use strict';

const Octokit = require('@octokit/rest');
const gpg = require(__dirname + '/gpg');

/**
 * Authenticate
 * @param {String} jwt The jwt token
 */
function auth(jwt) {
    return new Promise((resolve, reject) => {
        const octokit = new Octokit({
            auth: {
                type: 'app',
                token: jwt,
            },
        });

        octokit.apps
            .createInstallationToken({
                installation_id: process.env.INSTALLATION_ID,
            })
            .then(res => {
                octokit.authenticate({ type: 'token', token: res.data.token });
                resolve(octokit);
            })
            .catch(reject);
    });
}

/**
 * Send files in a commit
 * @param {Octokit} octokit The Octokit instance
 * @param {string} commitMsg The commit message
 * @param {array} files The files
 * @param {string} defaultBranch The default branch for base commit
 * @param {string} targetBranch The target branch for the commit
 */
function sendFiles(
    octokit,
    commitMsg,
    files,
    defaultBranch = 'master',
    targetBranch = 'refs/heads/update/' + new Date(new Date().toUTCString()).getTime()
) {
    return new Promise((resolve, reject) => {
        const owner = process.env.OWNER;
        const repo = process.env.REPO;
        octokit.repos
            .listCommits({ owner, repo, sha: defaultBranch, per_page: 1 })
            .then(commitsres => {
                const lastCommit = commitsres.data[0].sha;
                const commitDate = new Date(new Date().toUTCString());
                const identity = {
                    name: process.env.BOT_NAME,
                    email: process.env.BOT_EMAIL,
                    date: commitDate.toISOString(), //YYYY-MM-DDTHH:MM:SSZ
                };
                const unixTime = Math.floor(commitDate / 1000);

                //@see: https://developer.github.com/v3/git/trees/#create-a-tree
                octokit.gitdata
                    .createTree({
                        owner,
                        repo,
                        tree: files.map(file => {
                            return {
                                mode: '100644', // The file mode; one of 100644 for file (blob)
                                type: 'blob',
                                path: file.path,
                                content: file.content,
                            };
                        }),
                        base_tree: lastCommit,
                    })
                    .then(treeres => {
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
                            .then(signature => {
                                octokit.gitdata
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
                                    .then(resultcommit => {
                                        //console.log('Commit: ', resultcommit.data);
                                        octokit.gitdata
                                            .createRef({
                                                owner,
                                                repo,
                                                ref: targetBranch,
                                                sha: resultcommit.data.sha,
                                            })
                                            .then(resultrefcreate => {
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
 * @param {Octokit} octokit The Octikit instance
 * @param {string} title The title
 * @param {string} sourceBranch The source branch
 * @param {string} targetBranch The target branch
 * @param {string} message The message
 * @param {Boolean} mcm Maintainers can modify
 */
function createPullRequest(octokit, title, sourceBranch, targetBranch, message, mcm = true) {
    return octokit.pulls.create({
        owner: process.env.OWNER,
        repo: process.env.REPO,
        title,
        head: sourceBranch,
        base: targetBranch,
        body: message,
        maintainer_can_modify: mcm,
    });
}

/**
 *
 * @param {Octokit} octokit The Octikit instance
 * @param {Number} number The issue or PR id
 * @param {String[]} assignees The assignees
 */
function addAssignees(octokit, number, assignees) {
    return octokit.issues.addAssignees({
        owner: process.env.OWNER,
        repo: process.env.REPO,
        issue_number: number,
        assignees: assignees,
    });
}

module.exports = {
    addAssignees: addAssignees,
    createPullRequest: createPullRequest,
    sendFiles: sendFiles,
    auth: auth,
};
