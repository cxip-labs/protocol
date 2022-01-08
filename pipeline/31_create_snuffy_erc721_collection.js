'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, WALLET, GAS } = require('../config/env');

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


const FACTORY_CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/SNUFFY500Proxy.json')
);
let bytecode = FACTORY_CONTRACT.bytecode.replace(
  /deaddeaddeaddeaddeaddeaddeaddeaddeaddead/gi,
  fs
    .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
    .trim()
    .substring(2)
);

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

  const identity = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gas: web3.utils.toHex(5000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  });

  const result = await identity.methods
    // createCustomERC721Collection (bytes32 saltHash, address collectionCreator, Verification calldata verification, CollectionData calldata collectionData, bytes32 slot, bytes bytecode)
    .createCustomERC721Collection(
      salt,
      wallet,
      [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0',
      ],
      [
        '0x' + removeX(web3.utils.utf8ToHex('The SNUFFY 500')).padStart(64, '0'),
        '0x' + removeX(web3.utils.utf8ToHex('')).padStart(64, '0'),
        '0x' + removeX(web3.utils.utf8ToHex('SNUFFY500')).padStart(64, '0'),
        IDENTITY_CONTRACT,
        '0x' + (1000).toString(16).padStart(24, '0'),
      ],
      '0x173e062e35414a9e4a78473136b46649bf11b541b977af37c24fdf9b93fd2b26',
      '0x' + removeX(bytecode)
    )
    .send(from)
    .catch(error);
    console.log (result);
    console.log (result.events);
  if (result.status) {
  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/SNUFFY500.json')
  ).abi;
  const ERC721_CONTRACT = await identity.methods
    .getCollectionById(0)
    .call(from)
    .catch(error);

  console.log('ERC721_CONTRACT', ERC721_CONTRACT);

  	const erc721 = new web3.eth.Contract (
  		ERC721_ABI,
  		ERC721_CONTRACT,
  		{
            gas: web3.utils.toHex(1000000),
            gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  		}
  	);

  	console.log ({
  		'owner': await erc721.methods.isOwner ().call (from).catch (error),
  // 		'collectionId': await erc721.methods.collectionId ().call (from).catch (error),
  		'totalSupply': await erc721.methods.totalSupply ().call (from).catch (error),
  		'name': await erc721.methods.name ().call (from).catch (error),
  		'symbol': await erc721.methods.symbol ().call (from).catch (error),
  // 		'description': await erc721.methods.description ().call (from).catch (error),
  		'baseURI': await erc721.methods.baseURI ().call (from).catch (error),
  		'contractURI': await erc721.methods.contractURI ().call (from).catch (error)
  	});
  } else {
    console.log ('failed creating custom collection');
  }
  console.log('\tGas Used : ' + result.gasUsed);
  process.exit();
}

main();
