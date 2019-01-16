'use strict';

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The commit message
 */
const commitMessage = function(modifiedFiles) {
    return 'Some files to update';
};

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The pr message
 */
const prMessage = function(modifiedFiles) {
    return '🤖🚨 Update data';
};

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The pr content
 */
const prContent = function(modifiedFiles) {
    return 'Some files to update\nSee diff';
};

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The pr branch
 */
const prBranch = function(modifiedFiles) {
    return 'refs/heads/update/' + new Date().getTime();
};

module.exports = {
    commitMessage: commitMessage,
    prMessage: prMessage,
    prContent: prContent,
    prBranch: prBranch,
};

if (process.env.TEMPLATE_FILE) {
    module.exports = require(process.env.TEMPLATE_FILE);
}
