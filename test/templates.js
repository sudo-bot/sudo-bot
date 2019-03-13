'use strict';

const expect = require('chai').expect;

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module);
}

module.exports = function() {
    suite('default templates', function() {
        const templates = requireUncached(__dirname + '/../src/templates');
        test('commitMessage', function(done) {
            const commmitMsg = templates.commitMessage([]);
            expect(commmitMsg).to.equal('Some files to update');
            done();
        });
        test('prMessage', function(done) {
            const prMessage = templates.prMessage([]);
            expect(prMessage).to.equal('🤖🚨 Update data');
            done();
        });
        test('prContent', function(done) {
            const prContent = templates.prContent([]);
            expect(prContent).to.equal('Some files to update\nSee diff');
            done();
        });
        test('prBranch', function(done) {
            const prBranch = templates.prBranch([]);
            expect(prBranch).to.match(/^refs\/heads\/update\/[0-9]{13}$/);
            done();
        });
    });
    suite('custom templates', function() {
        process.env.TEMPLATE_FILE = __dirname + '/data/template.js';
        const templates = requireUncached(__dirname + '/../src/templates');
        test('commitMessage', function(done) {
            const commmitMsg = templates.commitMessage(['a.json', 'ab/cd/ef.json', 'README.md']);
            expect(commmitMsg).to.equal('The commit message for 3 files');
            done();
        });
        test('prMessage', function(done) {
            const prMessage = templates.prMessage(['a.json', 'ab/cd/ef.json', 'README.md']);
            expect(prMessage).to.equal('🤖 The PR message for 3 files 🚨');
            done();
        });
        test('prContent', function(done) {
            const prContent = templates.prContent(['a.json', 'ab/cd/ef.json', 'README.md']);
            expect(prContent).to.equal('Files:\na.json,ab/cd/ef.json,README.md\n🤖');
            done();
        });
        test('prBranch', function(done) {
            const prBranch = templates.prBranch([]);
            expect(prBranch).to.match(/^refs\/heads\/pr_custom\/[0-9]{13}$/);
            done();
        });
    });
};
