'use strict';

process.env.TZ = 'UTC';

import {doProcess} from './src/index';

export default doProcess(true, 'main', process.env.ENV_FILE || __dirname + '/.env');
