'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, MNEMONIC, WALLET } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(MNEMONIC, rpc[NETWORK]);
const web3 = new Web3(provider);
const wallet = new HDWalletProvider(WALLET, rpc[NETWORK]);

console.log('Funding: ' + wallet.addresses[0]);

web3.eth.sendTransaction(
  {
    from: provider.addresses[0],
    to: wallet.addresses[0],
    value: web3.utils.toWei('1', 'ether'),
  },
  function (error, result) {
    if (error) {
      console.log('Could not fund 1 ETH to ' + wallet.addresses[0]);
    } else {
      console.log('Funded 1 ETH to ' + wallet.addresses[0]);
    }
    process.exit();
  }
);
