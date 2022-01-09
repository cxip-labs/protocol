'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, PRIVATE_KEY } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const provider2 = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const BROKER_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/NFTBroker.json')
).abi;
const BROKER_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.snuffy.broker.address', 'utf8')
  .trim();

const contract = new web3.eth.Contract(BROKER_ABI, BROKER_ADDRESS, {
  // gasLimit: '1721975',
  // gasPrice: '70000000000',
});

const error = function (err) {
  console.log(err);
  process.exit();
};
const from = {
  from: provider.addresses[0],
};

const removeX = function (input) {
  if (input.startsWith('0x')) {
    return input.substring(2);
  } else {
    return input;
  }
};

const hexify = function (input) {
	input = input.toLowerCase ().trim ();
	if (input.startsWith ('0x')) {
		return input.substring (2);
	}
	return input.replace (/[^0-9a-f]/g, '');
};

async function main() {
  const wallet = provider.addresses[0];

    console.log ('setTierTimes', await contract.methods.setTierTimes (
        parseInt (Math.floor ((Date.now () / 1000) + 60)), // tier 1 unlocks in 60 seconds
        parseInt (Math.floor ((Date.now () / 1000) + (5 * 60))), // tier 2 unlocks in 5 minutes
        parseInt (Math.floor ((Date.now () / 1000) + (15 * 60))), // tier 3 unlocks in 15 minutes
    ).send(from).catch(error));
    console.log ('getTierTimes', await contract.methods.getTierTimes().call(from).catch(error));

    console.log ('setReservedTokens', await contract.methods.setReservedTokens (
        [
            wallet,
            '0x0000000000000000000000000000000000c0ffee',
            '0x000000000000000000000000000000000000dead',
            '0x000000000000000000000000000000000000beef'
        ],
        [
            [1, 2, 3],
            [4],
            [5],
            [6, 7]
        ]
    ).send(from).catch(error));

    console.log ('setOpenTokens', await contract.methods.setOpenTokens (
        [
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
        ]
    ).send(from).catch(error));

  process.exit();

}

main();
