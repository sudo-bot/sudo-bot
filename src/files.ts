'use strict';

import * as fs from 'fs';
import * as path from 'path';
import ignore from 'ignore';
import simpleGit, { SimpleGit } from 'simple-git';

export interface LocalFile {
    path: string;
    content: string;
}

/**
 * Returns a base64 representation of the file contents
 * @param {string} file The file path
 */
function base64Encode(file: string) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString('base64');
}

/**
 * File to string
 * @param {string} file The file path
 */
function fileToString(file: string) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return Buffer.from(bitmap).toString();
}

/**
 * Get modified files ready to send to git as strings
 */
const getModifiedFiles = function (repoDir: string, fsFiles: string[]): LocalFile[] {
    var files: LocalFile[] = [];
    fsFiles.map((file) => {
        files.push({
            path: file,
            content: fileToString(path.join(repoDir, file)),
        });
    });
    return files;
};

/**
 * The path
 */
const deleteFolderRecursive = function (path: string) {
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
 * Filter allowed files using ignore
 */
const filterAllowedFiles = function (ignoreFile: string | null, files: string[]) {
    var ignoreFiles = ignore();
    if (ignoreFile) {
        ignoreFiles.add(fs.readFileSync(ignoreFile).toString());
    }
    return ignoreFiles.filter(files);
};

const listGitModifiedFiles = function (
    repoDir: string,
    cbSuccess: (status: any) => void,
    cbError: (err: Error) => void
) {
    try {
        const sg: SimpleGit = simpleGit(repoDir);
        sg.status()
            .then((status) => {
                cbSuccess(status.modified);
            })
            .catch((err) => {
                cbError(err);
            });
    } catch (err) {
        cbError(err);
    }
};

export default {
    listGitModifiedFiles: listGitModifiedFiles,
    getModifiedFiles: getModifiedFiles,
    filterAllowedFiles: filterAllowedFiles,
    deleteFolderRecursive: deleteFolderRecursive,
    base64Encode: base64Encode,
};
