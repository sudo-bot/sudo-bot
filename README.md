# sudo-bot

[![Actions Status](https://github.com/sudo-bot/sudo-bot/workflows/Run%20tests/badge.svg)](https://github.com/sudo-bot/sudo-bot/actions)
[![Actions Status](https://github.com/sudo-bot/sudo-bot/workflows/Lint%20files/badge.svg)](https://github.com/sudo-bot/sudo-bot/actions)
[![codecov](https://codecov.io/gh/sudo-bot/sudo-bot/branch/main/graph/badge.svg)](https://codecov.io/gh/sudo-bot/sudo-bot)
[![npm version](https://badge.fury.io/js/sudo-bot.svg)](https://badge.fury.io/js/sudo-bot)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/sudo-bot/sudo-bot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sudo-bot/sudo-bot/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/sudo-bot/sudo-bot.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sudo-bot/sudo-bot/context:javascript)
[![Known Vulnerabilities](https://snyk.io/test/github/sudo-bot/sudo-bot/badge.svg)](https://snyk.io/test/github/sudo-bot/sudo-bot)
[![Dependabot](https://badgen.net/badge/Dependabot/enabled/green?icon=dependabot)](https://dependabot.com/)

Repo for @sudo-bot

## Create automatic PRs for changed files

Using yarn

- `yarn add sudo-bot`
- `npx sudo-bot` or `./node_modules/.bin/sudo-bot`

```help
$ ./node_modules/.bin/sudo-bot --help
Usage: sudo-bot [options]

A GitHub PR robot

Options:
      --jwt-file <jwtFile>                                     The JWT file for the GitHub app
      --gh-app-id <GitHubAppId>                                The App Id of the GitHub app
      --installation-id <GitHubInstallationId>                 The Installation Id of the GitHub app
      --repository-slug <repositorySlug>                       The slug for the repository ({orgname|username}/{repo})
      --target-branch <targetBranch>                           The target branch for the PR (default: main)
      --assign <usernamesAssigned>                             The GitHub usernames to assign (example: user1, user2)
      --template <templateFile>                                The template to generate PR descriptions
      --ignore-file <ignoreFile>                               The file to use as like a .gitignore file
      --repository-dir <repoDir>                               The repository directory (default: /mnt/Dev/@sudo/sudo-bot)
      --commit-author-email <commitAuthorEmail>                The email of the committer
      --commit-author-name <commitAuthorName>                  The name of the committer
      --gpg-private-key-file <gpgPrivateKeyFile>               The file path the to GPG key
      --gpg-private-key-passphrase <gpgPrivateKeyPassphrase>   The passphrase of the GPG key
      --verbose                                                Turn on logging
      --version                                                display version information and exit
      --help                                                   display this help and exit


```
