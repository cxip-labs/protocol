'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, PRIVATE_KEY } = require('../config/env');

const FACTORY_CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/CxipFactory.json')
).abi;
const FACTORY_ADDRESS = fs.readFileSync(
  './data/' + NETWORK + '.factory.address',
  'utf8'
);

const rpc = JSON.parse(fs.readFileSync('./config/rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const contract = new web3.eth.Contract(FACTORY_CONTRACT, FACTORY_ADDRESS, {
  gasLimit: web3.utils.toHex(152216),
  gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
});

const bytecode = JSON.parse(
  fs.readFileSync('./build/contracts/CxipProvenanceProxy.json')
).bytecode;

async function main() {
  const salt =
    '0x0000000000000000000000000000000000000000000000000000000000000001';
  const result = await contract.methods

    .deploy(
      bytecode.replace(
        /deaddeaddeaddeaddeaddeaddeaddeaddeaddead/gi,
        fs
          .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
          .trim()
          .substring(2)
      ),
      salt
    )

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
      'Deployed Provenance Proxy Contract : ' +
        result.events.Deployed.returnValues.contractAddress
    );
    fs.writeFileSync(
      './data/' + NETWORK + '.provenance.proxy.address',
      result.events.Deployed.returnValues.contractAddress
    );
  } else {
    console.log('\n');
    console.log(result);
    console.log('\n');
  }
  process.exit();
}

main();
