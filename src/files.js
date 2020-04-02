'use strict';

const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

/**
 * Returns a base64 representation of the file contents
 * @param {string} file The file path
 */
function base64Encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
}

/**
 * File to string
 * @param {string} file The file path
 */
function fileToString(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString();
}

/**
 * Get modified files ready to send to git as strings
 * @param {Array} fsFiles The files paths
 * @returns {Array} The files
 */
const getModifiedFiles = function (fsFiles) {
    var files = [];
    fsFiles.map((file) => {
        files.push({
            path: file,
            content: fileToString(path.join(process.env.REPO_DIR, file)),
        });
    });
    return files;
};

/**
 * The path
 * @param {string} path The path
 */
const deleteFolderRecursive = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + '/' + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

/**
 * Filter alowed files using ignore
 * @param {Array} files The files
 */
const filterAllowedFiles = function (files) {
    var ignoreFiles = ignore();
    if (typeof process.env.DOT_IGNORE === 'string') {
        ignoreFiles.add(fs.readFileSync(process.env.DOT_IGNORE).toString());
    }
    return ignoreFiles.filter(files);
};

const listGitModifiedFiles = function (cbSuccess) {
    require('simple-git')(process.env.REPO_DIR).status((err, status) => {
        cbSuccess(status.modified);
    });
};

module.exports = {
    listGitModifiedFiles: listGitModifiedFiles,
    getModifiedFiles: getModifiedFiles,
    filterAllowedFiles: filterAllowedFiles,
    deleteFolderRecursive: deleteFolderRecursive,
    base64Encode: base64Encode,
};
