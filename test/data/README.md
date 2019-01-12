# Test data

## Generate
- `ssh-keygen -P "" -t rsa -b 4096 -m PEM -f jwtRS256.pem` for the jwt key
- `export GNUPGHOME="$(mktemp -d)"`
- `cd test/data`
- `gpg2 --batch --generate-key gpg-key-script`
- `gpg2 --list-secret-keys`
- `KID="A9CB9A71BCC40B5C568C4E2DC78D7ACDA45F70FC"`
- `gpg2 --export-secret-keys --armor $KID > sudo-bot-test.priv`
- `gpg2 --export --armor $KID > sudo-bot-test.pub`
- `unset GNUPGHOME`
