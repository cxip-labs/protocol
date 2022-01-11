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

const PROVENANCE_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipProvenance.json')
).abi;
const PROVENANCE_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.provenance.proxy.address', 'utf8')
  .trim();

const provenance = new buyerWeb3.eth.Contract(PROVENANCE_ABI, PROVENANCE_ADDRESS, {
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

// we don't shuffle the data here to be able to access a token by id
const tokens = JSON.parse (fs.readFileSync ('./tokens.json', 'utf8'));

async function main() {
  const wallet = provider.addresses[0];

  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
  const IDENTITY_CONTRACT = await provenance.methods
    .getIdentity()
    .call(from)
    .catch(error);

  const identity = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gas: web3.utils.toHex(300000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  });

  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/SNUFFY500.json')
  ).abi;
  const ERC721_CONTRACT = await identity.methods
    .getCollectionById(0)
    .call(from)
    .catch(error);

  console.log('ERC721_CONTRACT', ERC721_CONTRACT);

  	const contract = new buyerWeb3.eth.Contract (
  		ERC721_ABI,
  		ERC721_CONTRACT,
  		{
            gas: web3.utils.toHex(5000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  		}
  	);

    let tokenId = 3;

  console.log({
    statesConfig: await contract.methods.getStatesConfig().call(from).catch(error),
    getStateTimestamps: await contract.methods.getStateTimestamps().call(from).catch(error),
    getTokenData: await contract.methods.getTokenData(tokenId).call(from).catch(error),
    tokenURI: await contract.methods.tokenURI(tokenId).call(from).catch(error),
    // 		'tokensOfOwner': await contract.methods.tokensOfOwner (from.from).call (from).catch (error),
    creator: await contract.methods.creator(tokenId).call(from).catch(error),
    payloadHash: await contract.methods
      .payloadHash(tokenId)
      .call(from)
      .catch(error),
    payloadSignature: await contract.methods
      .payloadSignature(tokenId)
      .call(from)
      .catch(error),
    payloadSigner: await contract.methods
      .payloadSigner(tokenId)
      .call(from)
      .catch(error),
    arweaveURI: await contract.methods
      .arweaveURI(tokenId)
      .call(from)
      .catch(error),
    httpURI: await contract.methods.httpURI(tokenId).call(from).catch(error),
    ipfsURI: await contract.methods.ipfsURI(tokenId).call(from).catch(error),
    tokenURI: await contract.methods
      .tokenURI(tokenId)
      .call(from)
      .catch(error),
    tokenDataIndex: await contract.methods.getTokenDataIndex(tokenId).call(from).catch(error),
    tokenState: await contract.methods.getTokenState(tokenId).call(from).catch(error)
  });

  process.exit();
}

main();
