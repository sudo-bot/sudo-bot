'use strict';

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The commit message
 */
const commitMessage = function (modifiedFiles: string[]) {
    return 'Some files to update';
};

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The pr message
 */
const prMessage = function (modifiedFiles: string[]) {
    return '🤖🚨 Update data';
};

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The pr content
 */
const prContent = function (modifiedFiles: string[]) {
    return 'Some files to update\nSee diff';
};

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The pr branch
 */
const prBranch = function (modifiedFiles: string[]) {
    return 'refs/heads/update/' + new Date().getTime();
};

const getDefaultExport = () => {
    if (process.env.TEMPLATE_FILE) {
        return require(process.env.TEMPLATE_FILE);
    }
    return {
        commitMessage: commitMessage,
        prMessage: prMessage,
        prContent: prContent,
        prBranch: prBranch,
    };
};

export default getDefaultExport();
