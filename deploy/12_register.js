'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, PRIVATE_KEY } = require('../config/env');

const REGISTRY_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipRegistry.json')
).abi;
const REGISTRY_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
  .trim();

const rpc = JSON.parse(fs.readFileSync('./config/rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const contract = new web3.eth.Contract(REGISTRY_ABI, REGISTRY_ADDRESS, {
  gasLimit: web3.utils.toHex(55555),
  gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
});

const error = function (err) {
  console.log(err);
  process.exit();
};
const from = {
  from: provider.addresses[0],
};

async function main() {
  const asset = await contract.methods
    .setAssetSource(
      fs.readFileSync('./data/' + NETWORK + '.asset.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', asset.transactionHash);
  console.log(asset.status ? 'Registered Asset' : 'Could not register Asset');
  const assetProxy = await contract.methods
    .setAsset(
      fs.readFileSync('./data/' + NETWORK + '.asset.proxy.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', assetProxy.transactionHash);
  console.log(
    assetProxy.status
      ? 'Registered Asset Proxy'
      : 'Could not register Asset Proxy'
  );
  const erc721 = await contract.methods
    .setERC721CollectionSource(
      fs.readFileSync('./data/' + NETWORK + '.erc721.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', erc721.transactionHash);
  console.log(
    erc721.status
      ? 'Registered ERC721 Collection'
      : 'Could not register ERC721 Collection'
  );
  const identity = await contract.methods
    .setIdentitySource(
      fs.readFileSync('./data/' + NETWORK + '.identity.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', identity.transactionHash);
  console.log(
    identity.status ? 'Registered Identity' : 'Could not register Identity'
  );
  const provenance = await contract.methods
    .setProvenanceSource(
      fs.readFileSync('./data/' + NETWORK + '.provenance.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', provenance.transactionHash);
  console.log(
    provenance.status
      ? 'Registered Provenance'
      : 'Could not register Provenance'
  );
  const provenanceProxy = await contract.methods
    .setProvenance(
      fs.readFileSync('./data/' + NETWORK + '.provenance.proxy.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', provenanceProxy.transactionHash);
  console.log(
    provenanceProxy.status
      ? 'Registered Provenance Proxy'
      : 'Could not register Rrovenance Proxy'
  );
  const royalties = await contract.methods
    .setPA1DSource(
      fs.readFileSync('./data/' + NETWORK + '.royalties.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', royalties.transactionHash);
  console.log(royalties.status ? 'Registered PA1D' : 'Could not register PA1D');
  const royaltiesProxy = await contract.methods
    .setPA1D(
      fs.readFileSync('./data/' + NETWORK + '.royalties.proxy.address', 'utf8')
    )
    .send(from)
    .catch(error);
  console.log('Transaction hash :', royaltiesProxy.transactionHash);
  console.log(
    royaltiesProxy.status
      ? 'Registered PA1D Proxy'
      : 'Could not register PA1D Proxy'
  );

  const signer = await contract.methods
    .setAssetSigner(provider.addresses[0])
    .send(from)
    .catch(error);
  console.log('Transaction hash :', signer.transactionHash);
  console.log(
    signer.status
      ? 'Registered Asset Signer'
      : 'Could not register Asset Signer'
  );

  process.exit();
}

main();
