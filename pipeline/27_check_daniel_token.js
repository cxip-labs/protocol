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

async function main() {
  const tokenId =
    '0x0000000000000000000000000000000000000000000000000000000000000002';

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
    // gasLimit: '6721975',
    // gasPrice: '20000000000',
  });

  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/DanielArshamErosions.json')
  ).abi;
  const ERC721_CONTRACT = await identity.methods
    .getCollectionById(0)
    .call(from)
    .catch(error);

  console.log('ERC721_CONTRACT', ERC721_CONTRACT);

  const contract = new web3.eth.Contract(ERC721_ABI, ERC721_CONTRACT, {
    // gasLimit: '6721975',
    // gasPrice: '20000000000',
  });

    // used to force cycle block.timestamp on ganache
    await contract.methods.setStartTimestamp (Math.round(Math.random() * (Date.now () / 1000))).send(from).catch(error);

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
  });

  const ROYALTIES_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/PA1D.json')
  ).abi;

  const royalties = new web3.eth.Contract(ROYALTIES_ABI, ERC721_CONTRACT, {
    // gasLimit: '6721975',
    // gasPrice: '20000000000',
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
