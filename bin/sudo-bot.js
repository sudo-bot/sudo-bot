#! /usr/bin/env node
const cli = require('snack-cli');
const packageJson = require(__dirname + '/../package.json');

var argv = cli
    .name(packageJson.name)
    .version(packageJson.version)
    .usage('[options]')
    .description(packageJson.description)
    .option('    --env <file>', 'ENV file')
    .option('    --target-branch <branch>', 'target PR branch', 'main')
    .option('    --verbose', 'turn on logging', false)
    .allowArgumentCount(1)
    .parse();

require(__dirname + '/../dist/index').default(argv.verbose, argv.targetBranch, argv.env);
