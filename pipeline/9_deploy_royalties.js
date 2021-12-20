'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, PRIVATE_KEY } = require('../config/env');

const FACTORY_CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/PA1D.json')
);

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

// Contract object and account info
let FACTORY = new web3.eth.Contract(FACTORY_CONTRACT.abi);

let bytecode = FACTORY_CONTRACT.bytecode
  .replace(
    /20202052617269626C6520526F79616c74696573/gi,
    fs
      .readFileSync('./data/' + NETWORK + '.rarible.address', 'utf8')
      .trim()
      .substring(2)
  )
  .replace(
    /deaddeaddeaddeaddeaddeaddeaddeaddeaddead/gi,
    fs
      .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
      .trim()
      .substring(2)
  );

// Function Parameter
let payload = {
  data: bytecode,
};

let parameter = {
  from: provider.addresses[0],
  gas: web3.utils.toHex(3000000),
  gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
};

// Function Call
FACTORY.deploy(payload)
  .send(parameter, function (err, transactionHash) {
    console.log('Transaction Hash :', transactionHash);
  })
  .then(function (newContractInstance) {
    fs.writeFileSync(
      './data/' + NETWORK + '.royalties.address',
      newContractInstance.options.address
    );
    console.log(
      'Deployed PAID Contract : ' + newContractInstance.options.address
    );
    process.exit();
  });
