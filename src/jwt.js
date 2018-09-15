


const jwt = require('jsonwebtoken');
const fs = require('fs');

const jsonwebtoken = function() {
    const cert = fs.readFileSync(process.env.JWT_PRIV_KEY_PATH);
    return jwt.sign(
        {
            iss: 17453,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 2
        }, cert, { algorithm: 'RS256' });
}


module.exports = {
    jsonwebtoken,
}