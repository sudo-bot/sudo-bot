'use strict';

process.env.TZ = 'UTC';

require(__dirname + '/src/index')(true, 'master', __dirname + '/.env');
