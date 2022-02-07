![Architecture Diagram](./static/readme-banner.jpg)

**How to load the Smart Contracts**

`npm install`

Rename `sample.env` to just `.env`
Rename `sample.mnemonic` to just `mnemonic`

For first time setup, run `npm run-script build-compile` to create the contracts folders needed for running deployments.

Run two terminal windows, in first window run `npm run-script ganache`, in second window run `sh ./scripts/deploy.sh`

This should get you to full deployment on localhost

For most up-to-date ABI codes for external use, run `npm run-script abi` to generate clean JSON files in the `abi` dir.
