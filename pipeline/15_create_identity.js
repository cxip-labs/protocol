'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, ISVITTO } = require('../config/env');

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
//         + hexify ('0x19e06E56a9C1Ea33622cD27691ED36D5f562f293').padStart (64, '0')
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

    if (typeof (ISVITTO) !== 'undefined' && (ISVITTO || ISVITTO == 'true')) {
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
    } else {
      const salt =
        provider.addresses[0] + '0x44616e69656c41727368616d'.substring(2);
      const secondaryWallet = '0x0de817bEc631f2a08e78a43b3e4Fb7d4C99E49AA';

      const result = await contract.methods
        // Contract variables
         // identity
        // createIdentity (bytes32 saltHash, address secondaryWallet, Verification calldata verification)
        .createIdentity(salt, secondaryWallet, [
          '0xfac77231c05b6dbfbf4b5e175608041ee838663207374ae3ef3fbe4df8388971',
          '0x3c37210511ba1451831234e9a29fa8a99a1e9590a286e0c8a811eb5c1e9df748',
          '0x1b',
        ])
        .send(from)
        .catch(error);
      console.log(
        'Identity Created at: ' +
          result.events.IdentityCreated.returnValues.identityAddress
      );
      console.log('\tGas Used : ' + result.gasUsed);
    }

  process.exit();
}

main();
