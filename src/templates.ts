'use strict';

import TemplateInterface, { TemplateFunction } from './TemplateInterface';

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The commit message
 */
const commitMessage: TemplateFunction = function (modifiedFiles: string[]): string {
    return 'Some files to update';
};

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The pr message
 */
const prMessage: TemplateFunction = function (modifiedFiles: string[]): string {
    return '🤖🚨 Update data';
};

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The pr content
 */
const prContent: TemplateFunction = function (modifiedFiles: string[]): string {
    return 'Some files to update\nSee diff';
};

/**
 * @param {string[]} modifiedFiles The modified files
 * @returns {string} The pr branch
 */
const prBranch: TemplateFunction = function (modifiedFiles: string[]): string {
    return 'refs/heads/update/' + new Date().getTime();
};

const template: TemplateInterface = {
    commitMessage: commitMessage,
    prMessage: prMessage,
    prContent: prContent,
    prBranch: prBranch,
};

export default template;
