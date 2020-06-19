'use strict';

import jwt from '../src/jwt';
import { expect } from 'chai';
import { suite, before } from 'mocha';

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

suite('jwt', function () {
    before(() => {
        process.env = {};
        process.env.JWT_PRIV_KEY_PATH = process.env.JWT_PRIV_KEY_PATH || __dirname + '/data/jwtRS256.pem';
    });
    test('testGenerateJWT', function (done) {
        expect(jwt.jsonwebtoken('')).to.match(JWS_REGEX);
        done();
    });
});
