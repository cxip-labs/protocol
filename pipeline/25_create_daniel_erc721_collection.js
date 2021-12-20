'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, WALLET, PRIVATE_KEY } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
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

async function main() {
  const salt =
    '0x0000000000000000000000000000000000000000000000000000000000000000';
  const wallet = provider.addresses[0];

  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
  const IDENTITY_CONTRACT = await provenance.methods
    .getIdentity()
    .call(from)
    .catch(error);

  const contract = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    // gasLimit: '6721975',
    // gasPrice: '20000000000',
  });

  const result = await contract.methods
    // createCustomERC721Collection (bytes32 saltHash, address collectionCreator, Verification calldata verification, CollectionData calldata collectionData, bytes32 slot)
    .createCustomERC721Collection(
      salt,
      wallet,
      [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0',
      ],
      [
        '0x' + removeX(web3.utils.utf8ToHex('Eroding and Reforming Safari 930')).padStart(64, '0'),
        '0x' + removeX(web3.utils.utf8ToHex('')).padEnd(64, '0'),
        '0x' + removeX(web3.utils.utf8ToHex('Safari-930-🏎️')).padStart(64, '0'),
        wallet,
        '0x' + (1000).toString(16).padStart(24, '0'),
      ],
      '0x34614b2160c4ad0a9004a062b1210e491f551c3b3eb86397949dc0279cf60c0d'
    )
    .send(from)
    .catch(error);

  console.log('ERC721 Collection Created at: ' + result.events[0].address);
  console.log('\tGas Used : ' + result.gasUsed);
  process.exit();
}

main();
