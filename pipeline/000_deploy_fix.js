'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, PRIVATE_KEY } = require('../config/env');

const FACTORY_CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/CxipFactory.json')
).abi;
const FACTORY_ADDRESS = '0xEcc11FC50Bf6D2B428714eE2450FfB384BC6306D';

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const contract = new web3.eth.Contract(FACTORY_CONTRACT, FACTORY_ADDRESS, {
  gasLimit: web3.utils.toHex(400000),
  gasPrice: web3.utils.toHex(web3.utils.toWei('110', 'gwei')),
});

const bytecode = JSON.parse(
  fs.readFileSync('./build/contracts/CxipFix.json')
).bytecode;

async function main() {
  const salt =
    '0x0000000000000000000000000000000000000000000000000000000000000001';
  const result = await contract.methods

    // 		.quickFix ()
    .deploy(bytecode, salt)
    // 		.estimateGas ({
    // 			from: provider.addresses [0]
    // 		});
    // 		console.log (result);

    .send({
      from: provider.addresses[0],
    })
    .catch(function (err) {
      console.log(err);
      process.exit();
    });

  if (result.status) {
    console.log('Transaction hash :', result.transactionHash);
    console.log(
      'Deployed Quick Fix Contract : ' +
        result.events.Deployed.returnValues.addr
    );
  } else {
    console.log('\n');
    console.log(result);
    console.log('\n');
  }
  process.exit();
}

main();
