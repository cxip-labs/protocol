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

const shuffleArray = function (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor (Math.random () * (i + 1));
        [array [i], array [j]] = [array [j], array [i]];
    }
    return array;
}
const tokens = JSON.parse (fs.readFileSync ('./tokens.json', 'utf8'));

async function main() {
  const wallet = provider.addresses[0];

  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
//   const IDENTITY_CONTRACT = '0xa11bF8Acbf121eC32E11ec5d9B80701A0DE2530c';
    const IDENTITY_CONTRACT = await provenance.methods
        .getIdentity()
        .call(from)
        .catch(error);

  const identity = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gas: web3.utils.toHex(300000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
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
            gas: web3.utils.toHex(1700000),
            gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
  		}
  	);

//   	console.log (await contract.methods.transferOwnership (
//   	    '0xcf5439084322598b841c15d421c206232b553e78'
//     ).send ({
//         from: provider.addresses[0],
//         value: 0,
//         gas: web3.utils.toHex(1700000),
//         gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
//     }).catch (error));

    let token = tokens [369 - 1];
    console.log (token);

    console.log (await contract.methods.mint (
        1,
        token.tokenId,
        token.raw.states,
        wallet,
        token.raw.signature,
        '0xcf5439084322598b841c15d421c206232b553e78'
    ).send ({
        from: provider.addresses[0],
        value: 0,
        gas: web3.utils.toHex(1700000),
        gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
    }).catch (error));

  process.exit();
}

main();
