'use strict';

import jwt from '../src/jwt';
import { expect } from 'chai';
import { suite } from 'mocha';
import { JWS_REGEX } from '../src/git';

suite('jwt', function () {
    test('testGenerateJWT', function (done) {
        expect(jwt.jsonwebtoken('1234', __dirname + '/data/jwtRS256.pem')).to.match(JWS_REGEX);
        done();
    });
});
