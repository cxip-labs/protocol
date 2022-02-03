'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();

const NETWORK = process.env.NETWORK || 'local';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const processEvents = function (result) {
  if (
    typeof result === 'object' &&
    'events' in result &&
    Object.keys(result.events).length > 0
  ) {
    console.log('!!! EVENTS !!!');
    Object.keys(result.events).forEach(function (key, index) {
      let event = result.events[key];
      console.log(event, JSON.stringify(event));
    });
  }
};

const error = function (err) {
  console.log(err);
  process.exit();
};
const from = {
  from: provider.addresses[0],
};

async function main() {
  const tokenId =
    '0x0000000000000000000000000000000000000000000000000000000000000001';

  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipERC721.json')
  ).abi;
  const ERC721_CONTRACT = '0xb476e28c2e23653bbb95c1b45d064b818f0366f9';

  console.log('ERC721_CONTRACT', ERC721_CONTRACT);

  const contract = new web3.eth.Contract(ERC721_ABI, ERC721_CONTRACT, {
    // 			gasLimit: '6721975',
    // 			gasPrice: '20000000000'
  });

  console.log({
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
    httpURI: await contract.methods.httpURI(tokenId).call(from).catch(error),
    ipfsURI: await contract.methods.ipfsURI(tokenId).call(from).catch(error),
    arweaveURI: await contract.methods
      .arweaveURI(tokenId)
      .call(from)
      .catch(error),
  });

  const ROYALTIES_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/PA1D.json')
  ).abi;

  const royalties = new web3.eth.Contract(ROYALTIES_ABI, ERC721_CONTRACT, {
    // 			gasLimit: '6721975',
    // 			gasPrice: '20000000000'
  });
  //e2c7f338

  let royal = await royalties.methods
    .getRoyalties(tokenId)
    .call(from)
    .catch(error);
  // 	let royal = await royalties.methods.setRoyalties (tokenId, from.from, 1000).send (from).catch (error);

  console.log('royalties', royal);

  process.exit();
}

main();
