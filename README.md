**How to load the Smart Contracts**

Make sure you have [Node.js](https://nodejs.org/en/) installed.

Also recommended to use [NVM](https://github.com/nvm-sh/nvm) (Node Version Manager). If you have that installed, then run this command in the project dir: `nvm install`.

To initialize the project, run `npm install` and make sure that all the modules were installed succesfully.

The project is setup to work in three environments: localhost, cxip.dev, and Ethereum mainnet.
These are labeled the following: local, cxip, live.
For each environment that you want to use, you will need to generate a few files before everything will work as expected.
The expected files are `mnemonic` and `priv_key` prepended with the environment type. For example: `local_mnemonic`.

In all of our examples we will be using the `local` environment. Adjust accordingly to your environment.

For security reasons, private keys and mnemonic phrases were not shared/included in the git project. You can easily make your own though.

For this purpose, an [offline BIP32 convertor](./bip39-standalone.html) is included in this project. Open the _bip39-standalone.html_ file in your browser, and click **GENERATE**, this will give you a mnemonic phrase that you can use. Save the mnemonic phrase to `local_mnemonic` file. If you are using terminal, then you can `nano local_mnemonic` or `echo "mnemonic phrase here" > local_mnemonic` to save the phrase.

The address from BIP32 derivation path **m/44'/60'/0'/0** will be used for all of our smart contract deployments in the current environment.

Next we need to choose a specific address/wallet that will be used for testing. You will need a wallet private key saved to `local_priv_key`. Use the offline BIP32 converter to generate another random mnemonic seed phrase and scroll to the list of generated addresses. On the right-most column of the table will be a list of private keys. Choose one at random and save to `local_priv_key`.

Now that you have all the necessary local files created, we can deploy the project. Run `npm run-script switch-local` to enable the local environment, and compile the smart contracts.

Make changes to smart contracts inside of the contract_sources folder. Then run `npm run build` to write them to contracts folder. We use this approach to allow for programatically injecting custom addresses and data pre-compile.

All the tasks/functions are inside of the pipeline folder. They are compiled in the \_pipeline.sh file. You can easily run the entire list of tasks by calling `npm run-script pipeline`. If you want to run tasks up to a certain point, simply add a new line with the word `exit` in the \_pipeline.sh file, after the last function you want executed.

Keep in mind that if you want to run any functions/scripts separate, don't forget to run `npm run-script ganache` in a separate terminal window, so that you have a blockchain to connect to. Otherwise the functions inside of the pipeline folder will fail.
