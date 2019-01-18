'use strict';

const doProcess = function(enableLogging, targetBranch, envFile) {
    if (enableLogging) {
        console.log('Launching sudo bot ...');
    }

    require('dotenv').config({ path: envFile });

    const jwt = require(__dirname + '/jwt');
    const git = require(__dirname + '/git');
    const files = require(__dirname + '/files');
    const templates = require(__dirname + '/templates');

    if (enableLogging) {
        console.log('Listing ...');
    }
    files.listGitModifiedFiles(files => {
        if (enableLogging) {
            console.log('Listing OK !');
        }
        const filteredFiles = files.filterAllowedFiles(files);
        git.auth(jwt.jsonwebtoken()).then(octokit => {
            if (enableLogging) {
                console.log('Login OK !');
            }
            git.sendFiles(
                octokit,
                templates.commitMessage(filteredFiles),
                filteredFiles,
                targetBranch,
                templates.prBranch(filteredFiles)
            ).then(result => {
                if (enableLogging) {
                    console.log('Files sent !');
                }
                git.createPullRequest(
                    octokit,
                    templates.prMessage(filteredFiles),
                    result.ref.ref,
                    targetBranch,
                    templates.prContent(filteredFiles)
                );
                if (enableLogging) {
                    console.log('PR done !');
                }
            });
        });
    });

    if (enableLogging) {
        console.log('Done !');
    }
};

module.exports = doProcess;
