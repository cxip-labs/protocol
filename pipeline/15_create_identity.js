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

const contract = new web3.eth.Contract(PROVENANCE_ABI, PROVENANCE_ADDRESS, {
  gasLimit: web3.utils.toHex(2500000),
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
  const salt =
    provider.addresses[0] + '0x44616e69656c41727368616d'.substring(2);
  const secondaryWallet = '0x0000000000000000000000000000000000000000';

  const result = await contract.methods
    // Contract variables
    // createIdentity (bytes32 saltHash, address secondaryWallet, Verification calldata verification)
    .createIdentity(salt, secondaryWallet, [
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x0',
    ])
    .send(from)
    .catch(error);

  console.log(
    'Identity Created at: ' +
      result.events.IdentityCreated.returnValues.identityAddress
  );
  console.log('\tGas Used : ' + result.gasUsed);
  process.exit();
}

main();
