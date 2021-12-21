'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, WALLET } = require('../config/env');

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
  fs.readFileSync('./build/contracts/DanielArshamErosionsProxy.json')
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
    '0x0000000000000000000000000000000000000000000000000000000000000001';
  const wallet = provider.addresses[0];

  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
  const IDENTITY_CONTRACT = await provenance.methods
    .getIdentity()
    .call(from)
    .catch(error);

  const identity = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gasLimit: '6721975',
    gasPrice: '20000000000',
  });

  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/DanielArshamErosions.json')
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

   console.log ('setStartTimestamp', await contract.methods.setStartTimestamp (Math.round (Date.now () / 1000)).send(from).catch(error));
    console.log ('getStartTimestamp', await contract.methods.getStartTimestamp().call(from).catch(error));
   console.log ('setTokenSeparator', await contract.methods.setTokenSeparator (10000).send(from).catch(error));
    console.log ('getTokenSeparator', await contract.methods.getTokenSeparator().call(from).catch(error));
   console.log ('setTokenLimit', await contract.methods.setTokenLimit (200 + 150 + 99).send(from).catch(error));
    console.log ('getTokenLimit', await contract.methods.getTokenLimit().call(from).catch(error));
    for (let i = 0, l = 6; i < l; i++) {
        console.log ('prepareMintData', i, await contract.methods.prepareMintData(i, [
            '0x000000000000000000000000000000000000000000000000000000000000000' + i,
            [
                '0x000000000000000000000000000000000000000000000000000000000000000' + i,
                '0x000000000000000000000000000000000000000000000000000000000000000' + i,
                '0x0' + i,
            ],
            wallet,
            '0x000000000000000000000000000000000000000000000000000000000000000' + i,
            '0x000000000000000000000' + i,
            '0x000000000000000000000000000000000000000000000000000000000000000' + i,
            '0x000000000000000000000000000' + i,
        ]).send(from).catch(error));
    }
    console.log ('setRotationConfig', await contract.methods.setRotationConfig(0, 30, 10, 5).send(from).catch(error));
    console.log ('getRotationConfig', await contract.methods.getRotationConfig(0).call(from).catch(error));
    console.log ('batchMint', await contract.methods.batchMint(wallet, 1, 3, '0x0000000000000000000000000000000000000000').send(from).catch(error));

  	console.log ({
  		'owner': await contract.methods.isOwner ().call (from).catch (error),
  // 		'collectionId': await erc721.methods.collectionId ().call (from).catch (error),
  		'totalSupply': await contract.methods.totalSupply ().call (from).catch (error),
  		'name': await contract.methods.name ().call (from).catch (error),
  		'symbol': await contract.methods.symbol ().call (from).catch (error),
  // 		'description': await erc721.methods.description ().call (from).catch (error),
  		'baseURI': await contract.methods.baseURI ().call (from).catch (error),
  		'contractURI': await contract.methods.contractURI ().call (from).catch (error)
  	});
  process.exit();
}

main();
