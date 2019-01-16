'use strict';

process.env.TZ = 'UTC';
const jwt = require(__dirname + '/jwt');
const gpg = require(__dirname + '/gpg');
const files = require(__dirname + '/files');
const git = require(__dirname + '/git');
const templates = require(__dirname + '/templates');

suite('Sudo Bot', function() {
    jwt();
    gpg();
    files();
    git();
    templates();
}).beforeAll('Load ENV', done => {
    require('dotenv').config({ path: __dirname + '/../.env' });
    done();
});
