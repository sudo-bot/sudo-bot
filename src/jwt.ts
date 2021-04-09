'use strict';

import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

/**
 * Get a jwt
 * @param {Number} appId The application Id (not the installation Id)
 * @return {String} The jwt
 */
const jsonwebtoken = function (appId: string, jwtFile: string) {
    const GitHubAppId: number = parseInt(appId, 10);
    if (typeof GitHubAppId !== 'number') {
        throw new Error('Wrong value for --gh-app-id');
    }
    // An arbitrary value to test the value
    if (GitHubAppId < 4000) {
        throw new Error('Wrong value for --gh-app-id');
    }
    const cert = fs.readFileSync(jwtFile);
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now, // Issued at time
        exp: now + 60 * 5, // JWT expiration time (10 minute maximum)
        iss: GitHubAppId,
    };
    return jwt.sign(payload, cert, { algorithm: 'RS256' });
};

export default {
    jsonwebtoken: jsonwebtoken,
};
