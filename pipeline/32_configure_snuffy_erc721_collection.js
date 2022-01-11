'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);

const PROVENANCE_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipProvenance.json')
).abi;
const PROVENANCE_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.provenance.proxy.address', 'utf8')
  .trim();

const provenance = new web3.eth.Contract(PROVENANCE_ABI, PROVENANCE_ADDRESS, {
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

const FACTORY_CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/SNUFFY500Proxy.json')
);
let bytecode = FACTORY_CONTRACT.bytecode.replace(
  /deaddeaddeaddeaddeaddeaddeaddeaddeaddead/gi,
  fs
    .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
    .trim()
    .substring(2)
);

async function main() {
  const wallet = provider.addresses[0];

  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
  const IDENTITY_CONTRACT = await provenance.methods
    .getIdentity()
    .call(from)
    .catch(error);

  const identity = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gas: web3.utils.toHex(300000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  });

  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/SNUFFY500.json')
  ).abi;
  const ERC721_CONTRACT = await identity.methods
    .getCollectionById(0)
    .call(from)
    .catch(error);

  console.log('ERC721_CONTRACT', ERC721_CONTRACT);

  	const contract = new web3.eth.Contract (
  		ERC721_ABI,
  		ERC721_CONTRACT,
  		{
            gas: web3.utils.toHex(300000),
            gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  		}
  	);

    console.log ('setStateTimestamps', await contract.methods.setStateTimestamps ([
        // level 0
        60 * 60 * 24 * 7 * 2, // two weeks
        // level 1
        60 * 60 * 24 * 30 * 3, // three months
        // level 2
        60 * 60 * 24 * 30 * 6, // six months
        // level 3
        60 * 60 * 24 * 30 * 6, // six months
        // level 4
        60 * 60 * 24 * 30 * 6, // six months
        // level 5
        0,
        // level 6
        0,
        // level 7
        0
    ]).send(from).catch(error));
        console.log ('getStateTimestamps', await contract.methods.getStateTimestamps().call(from).catch(error));

    console.log ('setStatesConfig', await contract.methods.setStatesConfig(
        8, // max
        6,  // limit
        0,  // future0
        0,  // future1
        0,  // future2
        0   // future3
    ).send(from).catch(error));
        console.log ('getStatesConfig', await contract.methods.getStatesConfig().call(from).catch(error));

    console.log ('setMutationRequirements', await contract.methods.setMutationRequirements ([
        // level 0
        0,
        // level 1
        0,
        // level 2
        4,
        // level 3
        4,
        // level 4
        4,
        // level 5
        0,
        // level 6
        0,
        // level 7
        0
    ]).send(from).catch(error));
        console.log ('getMutationRequirements', await contract.methods.getMutationRequirements().call(from).catch(error));

  process.exit();
}

main();
