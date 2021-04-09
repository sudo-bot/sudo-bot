#!/usr/bin/env node
try {
    const cli = require('snack-cli');
    const packageJson = require(__dirname + '/../package.json');

    var argv = cli
        .name(packageJson.name)
        .version(packageJson.version)
        .usage('[options]')
        .description(packageJson.description)
        .option('    --jwt-file <jwtFile>', 'The JWT file for the GitHub app')
        .option('    --gh-app-id <GitHubAppId>', 'The App Id of the GitHub app')
        .option('    --installation-id <GitHubInstallationId>', 'The Installation Id of the GitHub app')
        .option('    --repository-slug <repositorySlug>', 'The slug for the repository ({orgname|username}/{repo})')
        .option('    --target-branch <targetBranch>', 'The target branch for the PR', 'main')
        .option('    --assign <usernamesAssigned>', 'The GitHub usernames to assign (example: user1, user2)', '')
        .option('    --template <templateFile>', 'The template to generate PR descriptions', '')
        .option('    --ignore-file <ignoreFile>', 'The file to use as like a .gitignore file', '')
        .option('    --repository-dir <repositoryDir>', 'The repository directory', process.cwd())
        .option('    --commit-author-email <commitAuthorEmail>', 'The email of the committer')
        .option('    --commit-author-name <commitAuthorName>', 'The name of the committer')
        .option('    --gpg-private-key-file <gpgPrivateKeyFile>', 'The file path the to GPG key')
        .option('    --gpg-private-key-passphrase <gpgPrivateKeyPassphrase>', 'The passphrase of the GPG key')
        .option('    --verbose', 'Turn on logging', false)
        .allowArgumentCount(1)
        .parse();

    const index = require(__dirname + '/../dist/index');

    index.doProcess(
        argv.verbose,
        argv.targetBranch,
        argv.ignoreFile,
        argv.template,
        argv.assign,
        argv.repositorySlug,
        argv.installationId,
        argv.ghAppId,
        argv.jwtFile,
        argv.repositoryDir,
        argv.commitAuthorEmail,
        argv.commitAuthorName,
        argv.gpgPrivateKeyFile,
        argv.gpgPrivateKeyPassphrase
    );
} catch (error) {
    console.error('sudo-bot has an error:');
    console.error(e);
    process.exit(1);
}
