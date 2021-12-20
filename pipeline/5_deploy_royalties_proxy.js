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

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const contract = new web3.eth.Contract(FACTORY_CONTRACT, FACTORY_ADDRESS, {
  gasLimit: web3.utils.toHex(152216),
  gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
});

const error = function (err) {
  console.log(err);
  process.exit();
};
const from = {
  from: provider.addresses[0],
};

const bytecode = JSON.parse(
  fs.readFileSync('./build/contracts/PA1DProxy.json')
).bytecode;

async function main() {
  const salt =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
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

    .send(from)
    .catch(error);

  fs.writeFileSync(
    './data/' + NETWORK + '.royalties.proxy.address',
    result.events.Deployed.returnValues.addr
  );
  if (result.status) {
    console.log('Transaction hash :', result.transactionHash);
    console.log(
      'Deployed Royalties Proxy Contract : ' +
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
