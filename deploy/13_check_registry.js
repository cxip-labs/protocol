'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, PRIVATE_KEY } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./config/rpc.json', 'utf8'));
const provider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);

const REGISTRY_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipRegistry.json')
).abi;
const REGISTRY_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
  .trim();

const contract = new web3.eth.Contract(REGISTRY_ABI, REGISTRY_ADDRESS, {
  gasLimit: web3.utils.toHex(2000000),
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
  const asset = await contract.methods.getAssetSource().call(from).catch(error);
  const assetProxy = await contract.methods.getAsset().call(from).catch(error);
  const assetSigner = await contract.methods
    .getAssetSigner()
    .call(from)
    .catch(error);
  const erc721 = await contract.methods
    .getERC721CollectionSource()
    .call(from)
    .catch(error);
  const identity = await contract.methods
    .getIdentitySource()
    .call(from)
    .catch(error);
  const provenance = await contract.methods
    .getProvenanceSource()
    .call(from)
    .catch(error);
  const provenanceProxy = await contract.methods
    .getProvenance()
    .call(from)
    .catch(error);
  const royalties = await contract.methods
    .getPA1DSource()
    .call(from)
    .catch(error);
  const royaltiesProxy = await contract.methods
    .getPA1D()
    .call(from)
    .catch(error);

  const daniel = await contract.methods
    .getCustomSource(
      '0x748042799f1a8ea5aa2ae183edddb216f96c3c6ada37066aa2ce51a56438ede7'
    )
    .call(from)
    .catch(error);
  const danielProxy = await contract.methods
    .getCustomSource(
      '0x34614b2160c4ad0a9004a062b1210e491f551c3b3eb86397949dc0279cf60c0d'
    )
    .call(from)
    .catch(error);

  console.log({
    asset,
    assetProxy,
    assetSigner,
    erc721,
    factory: fs.readFileSync('./data/' + NETWORK + '.factory.address', 'utf8'),
    identity,
    provenance,
    provenanceProxy,
    registry: fs.readFileSync(
      './data/' + NETWORK + '.registry.address',
      'utf8'
    ),
    royalties,
    royaltiesProxy,
    daniel,
    danielProxy,
  });
  process.exit();
}

main();
