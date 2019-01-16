'use strict';

process.env.TZ = 'UTC';
require('dotenv').config({ path: __dirname + '/.env' });
const jwt = require(__dirname + '/src/jwt');
const git = require(__dirname + '/src/git');
const files = require(__dirname + '/src/files');
const templates = require(__dirname + '/src/templates');
const targetBranch = 'master';

files.listGitModifiedFiles(files => {
    const filteredFiles = files.filterAllowedFiles(files);
    git.auth(jwt.jsonwebtoken()).then(octokit => {
        git.sendFiles(
            octokit,
            templates.commitMessage(filteredFiles),
            filteredFiles,
            targetBranch,
            templates.prBranch(filteredFiles)
        ).then(result => {
            git.createPullRequest(
                octokit,
                templates.prMessage(filteredFiles),
                result.ref.ref,
                targetBranch,
                templates.prContent(filteredFiles)
            );
        });
    });
});
