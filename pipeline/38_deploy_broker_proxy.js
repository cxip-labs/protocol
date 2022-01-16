'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET } = require('../config/env');

const FACTORY_CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/NFTBrokerProxy.json')
);

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const notary = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);

//Contract object and account info
let FACTORY = new web3.eth.Contract(FACTORY_CONTRACT.abi);

let bytecode = FACTORY_CONTRACT.bytecode.replace(
  /deaddeaddeaddeaddeaddeaddeaddeaddeaddead/gi,
  fs
    .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
    .trim()
    .substring(2)
);

const error = function (err) {
  console.log(err);
  process.exit();
};
const from = {
  from: provider.addresses[0],
  gas: web3.utils.toHex(20000),
  gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
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

    let payload = {
        data: bytecode,
        arguments: [
        ]
    };

    let parameter = {
        from: provider.addresses[0],
        gas: web3.utils.toHex(500000),
        gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))//,
//         nonce: 19
    };

    // Function Call
    FACTORY.deploy(payload)
        .send(parameter, function (err, transactionHash) {
            console.log('Transaction Hash :', transactionHash);
        })
        .then(function (newContractInstance) {
            fs.writeFileSync(
                './data/' + NETWORK + '.snuffy.broker.proxy.address',
                newContractInstance.options.address
            );
            console.log(
                'Deployed NFTBrokerProxy Contract : ' + newContractInstance.options.address
            );
        });
}

main();