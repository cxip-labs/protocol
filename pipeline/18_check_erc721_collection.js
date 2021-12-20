'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, WALLET } = require('../config/env');

const PROVENANCE_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipProvenance.json')
).abi;
const PROVENANCE_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.provenance.proxy.address', 'utf8')
  .trim();

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);

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

async function main() {
  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
  const IDENTITY_CONTRACT = await provenance.methods
    .getIdentity()
    .call(from)
    .catch(error);

  const VALID_IDENTITY = await provenance.methods
    .isIdentityValid(IDENTITY_CONTRACT)
    .call(from)
    .catch(error);

  const BLACKLISTED_IDENTITY = await provenance.methods
    .isIdentityBlacklisted(IDENTITY_CONTRACT)
    .call(from)
    .catch(error);

  console.log(
    'IDENTITY_CONTRACT',
    IDENTITY_CONTRACT,
    'valid',
    VALID_IDENTITY,
    'blacklisted',
    BLACKLISTED_IDENTITY
  );

  const identity = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gasLimit: '6721975',
    gasPrice: '20000000000',
  });

  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipERC721.json')
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
  			gasLimit: '6721975',
  			gasPrice: '20000000000'
  		}
  	);

  	console.log ({
  		'owner': await contract.methods.isOwner ().call (from).catch (error),
  // 		'collectionId': await contract.methods.collectionId ().call (from).catch (error),
  // 		'totalSupply': await contract.methods.totalSupply ().call (from).catch (error),
  		'name': await contract.methods.name ().call (from).catch (error),
  		'symbol': await contract.methods.symbol ().call (from).catch (error),
  // 		'description': await contract.methods.description ().call (from).catch (error),
  		'baseURI': await contract.methods.baseURI ().call (from).catch (error),
  		'contractURI': await contract.methods.contractURI ().call (from).catch (error)
  	});

  process.exit();
}

main();
