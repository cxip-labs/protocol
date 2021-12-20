'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, PRIVATE_KEY } = require('../config/env');

const REGISTRY_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipRegistry.json')
).abi;
const REGISTRY_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
  .trim();

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const contract = new web3.eth.Contract(REGISTRY_ABI, REGISTRY_ADDRESS, {
  gasLimit: web3.utils.toHex(55555),
  gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
});

const error = function (err) {
  console.log(err);
  process.exit();
};
const from = {
  from: provider.addresses[0],
};

async function main() {
  const daniel = await contract.methods
    .setCustomSource(
      'eip1967.CxipRegistry.DanielArshamErosions',
      fs.readFileSync('./data/' + NETWORK + '.daniel.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', daniel.transactionHash);
  console.log(daniel.status ? 'Registered Daniel Arsham Custom Source' : 'Could not register Daniel Arsham Custom Source');
  const danielProxy = await contract.methods
    .setCustomSource(
      'eip1967.CxipRegistry.DanielArshamErosionsProxy',
      fs.readFileSync('./data/' + NETWORK + '.daniel.proxy.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', danielProxy.transactionHash);
  console.log(danielProxy.status ? 'Registered Daniel Arsham Custom Proxy' : 'Could not register Daniel Arsham Custom Proxy');

  process.exit();
}

main();
