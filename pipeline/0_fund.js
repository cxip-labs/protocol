'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const { NETWORK, MNEMONIC, PRIVATE_KEY } = require('../config/env');

const CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/CxipFactory.json')
);

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(MNEMONIC, rpc[NETWORK]);
const web3 = new Web3(provider);
const signer = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);

web3.eth.sendTransaction(
  {
    from: provider.addresses[0],
    to: signer.addresses[0],
    value: web3.utils.toWei('11', 'ether'),
  },
  function (error, result) {
    if (error) {
      console.log(
        `Could not fund 11 ETH to ${provider.addresses[0]}\n${error}`
      );
    } else {
      console.log('Funded 11 ETH to ' + provider.addresses[0]);
    }
    process.exit();
  }
);

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}
