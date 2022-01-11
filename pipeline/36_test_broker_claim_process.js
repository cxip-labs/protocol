'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, MNEMONIC } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);
const buyerProvider = new HDWalletProvider(MNEMONIC, rpc[NETWORK], 0, 10);
const buyerWeb3 = new Web3(buyerProvider);

const BROKER_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/NFTBroker.json')
).abi;
const BROKER_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.snuffy.broker.address', 'utf8')
  .trim();

const contract = new buyerWeb3.eth.Contract(BROKER_ABI, BROKER_ADDRESS, {
//     gasLimit: web3.utils.toHex(5000000),
//     gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
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

// we don't shuffle the data here to be able to access a token by id
const tokens = JSON.parse (fs.readFileSync ('./tokens.json', 'utf8'));

async function main() {
  const wallet = provider.addresses[0];

    // we set token id here for testing
    let targetTokenId = 3;
    // we ofset id by one to make it work with array which are zero index based
    let token = tokens [targetTokenId - 1];
    console.log (token);

    // this is here temporarily to allow a non-Snuffy wallet as the creator
//     for (let i = 0; i < 6; i++) {
//         token.raw.states [i] [2] = wallet;
//     }

//     function claimAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {

    console.log (await contract.methods.claimAndMint (
        hexify (token.tokenId.toString (16).padStart (64, '0'), true),
        token.raw.states,
        token.raw.signature
    ).send ({
        from: buyerProvider.addresses[0],
        value: web3.utils.toHex(web3.utils.toWei('0.2', 'ether')),
        gas: web3.utils.toHex(2000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
    }).catch (error));

  process.exit();
}

main();
