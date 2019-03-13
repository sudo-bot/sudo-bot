'use strict';

/**
 * Get modifications and create a PR
 * @param {Boolean} enableLogging Enable logging
 * @param {String} targetBranch The target branch
 * @param {String} envFile Path to the .env file
 */
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
    files.listGitModifiedFiles(modifiedFiles => {
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
        git.auth(jwt.jsonwebtoken()).then(octokit => {
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