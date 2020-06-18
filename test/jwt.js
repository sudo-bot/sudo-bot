'use strict';

const jwt = require(__dirname + '/../dist/jwt').default;
const expect = require('chai').expect;

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

module.exports = function () {
    suite('jwt', function () {
        process.env.JWT_PRIV_KEY_PATH = process.env.JWT_PRIV_KEY_PATH || __dirname + '/data/jwtRS256.pem';
        test('testGenerateJWT', function (done) {
            expect(jwt.jsonwebtoken()).to.match(JWS_REGEX);
            done();
        });
    });
};
