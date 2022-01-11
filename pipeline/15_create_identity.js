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

const removeX = function (input) {
  if (input.startsWith('0x')) {
    return input.substring(2);
  } else {
    return input;
  }
};

const hexify = function (input, prepend) {
	input = input.toLowerCase ().trim ();
	if (input.startsWith ('0x')) {
		input = input.substring (2);
	}
	input = input.replace (/[^0-9a-f]/g, '');
	if (prepend) {
	    input = '0x' + input;
	}
	return input;
};

async function main() {
//     let sig = await web3.eth.personal.sign (web3.utils.keccak256 ('0x'
//         //identity
//         + hexify ('0x76063DeF91a6b7261B7E6afd56d22BF0a2c8b2dD').padStart (64, '0')
//         // wallet
//         + hexify ('0xE0d9f87Af4051eA8E86b3168AF2Ad27c0Bd0384D').padStart (64, '0')
//         // secondary wallet
//         + hexify ('0x0de817bEc631f2a08e78a43b3e4Fb7d4C99E49AA').padStart (64, '0')
//     ), provider.addresses[0]);
// 	let signature = {
//         signature: sig,
//         r: '0x' + sig.substring (2, 66),
//         s: '0x' + sig.substring (66, 130),
//         v: '0x' + (parseInt ('0x' + sig.substring (130, 132)) + 27).toString (16)
//     };
//     console.log (signature);

  const salt =
    provider.addresses[0] + '0x44616e69656c41727368616d'.substring(2);
  const secondaryWallet = '0x0de817bEc631f2a08e78a43b3e4Fb7d4C99E49AA';

  const result = await contract.methods
    // Contract variables
     // identity
    // createIdentity (bytes32 saltHash, address secondaryWallet, Verification calldata verification)
    .createIdentity(salt, secondaryWallet, [
      '0xc81b9d3b8f81765331dd7afc1a7ca3b2f532017400bad2339874881b0ba9b242',
      '0x0fb71c7aaafe6714fff5d65ccbf52eec526f151ae21460466b54983f61f4921b',
      '0x1c',
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
