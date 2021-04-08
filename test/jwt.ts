'use strict';

import jwt from '../src/jwt';
import { expect } from 'chai';
import { suite, before } from 'mocha';

const JWS_REGEX = /^[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?$/;

suite('jwt', function () {
    test('testGenerateJWT', function (done) {
        expect(jwt.jsonwebtoken('1234', __dirname + '/data/jwtRS256.pem')).to.match(JWS_REGEX);
        done();
    });
});
