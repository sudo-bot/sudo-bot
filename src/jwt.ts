'use strict';

import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

/**
 * Get a jwt
 * @param {Number} appId The application Id (not the installation ID)
 * @return {String} The jwt
 */
const jsonwebtoken = function (appId: string) {
    const cert = fs.readFileSync(process.env.JWT_PRIV_KEY_PATH || '');
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iat: now, // Issued at time
        exp: now + 60 * 5, // JWT expiration time (10 minute maximum)
        iss: parseInt(appId),
    };
    return jwt.sign(payload, cert, { algorithm: 'RS256' });
};

export default {
    jsonwebtoken: jsonwebtoken,
};
