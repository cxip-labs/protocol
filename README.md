**How to load the Smart Contracts**

`npm install`

Rename `sample.env` to just `.env`

Rename `sample.mnemonic` to just `mnemonic`

Make edits in the `contract_sources` dir. Then run `npm run-script build-compile` for the system to automatically build the `contracts` dir.

Run two terminal windows, in first window run `npm run-script ganache`, in second window run `sh _pipeline.sh`

This should get you to full deployment on localhost

If you will need ABI files for your scripts, run `npm run-script abi`, which will write all the ABI jsons to abi dir.
