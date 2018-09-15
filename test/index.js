process.env.TZ = 'UTC';
const jwt = require(__dirname+'/jwt');
const gpg = require(__dirname+'/gpg');


suite('String#split', function () {
    jwt();
    gpg();
}).beforeAll('Load ENV', (done)=> {
    require('dotenv').config({ path: __dirname + '/../.env' });
    done();
});
