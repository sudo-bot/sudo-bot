'use strict';

import jwt from '../src/jwt';
import { expect } from 'chai';
import { suite } from 'mocha';

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

suite('jwt', function () {
    process.env.JWT_PRIV_KEY_PATH = process.env.JWT_PRIV_KEY_PATH || __dirname + '/data/jwtRS256.pem';
    test('testGenerateJWT', function (done) {
        expect(jwt.jsonwebtoken('')).to.match(JWS_REGEX);
        done();
    });
});
