'use strict';

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The commit message
 */
const commitMessage = function (modifiedFiles) {
    return 'The commit message for ' + modifiedFiles.length + ' files';
};

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The pr message
 */
const prMessage = function (modifiedFiles) {
    return '🤖 The PR message for ' + modifiedFiles.length + ' files 🚨';
};

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The pr content
 */
const prContent = function (modifiedFiles) {
    return 'Files:\n' + modifiedFiles.join(',') + '\n🤖';
};

/**
 * @param {Array} modifiedFiles The modified files
 * @returns {string} The pr branch
 */
const prBranch = function (modifiedFiles) {
    return 'refs/heads/pr_custom/' + new Date().getTime();
};

module.exports = {
    commitMessage: commitMessage,
    prMessage: prMessage,
    prContent: prContent,
    prBranch: prBranch,
};
