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
  const snuffy = await contract.methods
    .setCustomSource(
      'eip1967.CxipRegistry.SNUFFY500',
      fs.readFileSync('./data/' + NETWORK + '.snuffy.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', snuffy.transactionHash);
  console.log(snuffy.status ? 'Registered SNUFFY500 Custom Source' : 'Could not register SNUFFY500 Custom Source');
  const snuffyProxy = await contract.methods
    .setCustomSource(
      'eip1967.CxipRegistry.SNUFFY500Proxy',
      fs.readFileSync('./data/' + NETWORK + '.snuffy.proxy.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', snuffyProxy.transactionHash);
  console.log(snuffyProxy.status ? 'Registered SNUFFY500 Custom Proxy' : 'Could not register SNUFFY500 Custom Proxy');

  process.exit();
}

main();
