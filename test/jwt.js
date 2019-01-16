'use strict';

const jwt = require(__dirname + '/../src/jwt');
const expect = require('chai').expect;

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

module.exports = function() {
    suite('jwt', function() {
        test('testGenerateJWT', function(done) {
            expect(jwt.jsonwebtoken()).to.match(JWS_REGEX);
            done();
        });
    });
};
