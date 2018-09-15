process.env.TZ = 'UTC';
require('dotenv').config({ path: __dirname + '/.env' });
const jwt = require(__dirname + '/src/jwt');
const git = require(__dirname + '/src/git');
const fs = require('fs');
const path = require('path');

/**
 * Returns a base64 representation of the file contents
 * @param {string} file The file path
 */
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
}

/**
 * File to string
 * @param {string} file The file path
 */
function file_to_string(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString();
}


const gitDir = process.env.REPO_DIR;
require('simple-git')(gitDir).status((err, status) => {
    var files = [];
    console.log(err, status.modified)
    status.modified.map(file=>{
        files.push({
            path: file,
            content: file_to_string(path.join(gitDir, file))
        });
    });
    git.auth(jwt.jsonwebtoken()).then(octokit => {
        git.sendFiles(
            octokit,
            "Some files to update",
            files,
            "master",
            "refs/heads/update/" + new Date().getTime()
        ).then(result=>{
            console.log(result);
            git.createPullRequest(
                octokit,
                "🤖🚨 Update data",
                result.ref.ref,
                "master",
                "Some files to update\nSee diff"
            );
        });
    });
});