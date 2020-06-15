'use strict';

process.env.TZ = 'UTC';

require(__dirname + '/src/index')(true, 'main', __dirname + '/.env');
