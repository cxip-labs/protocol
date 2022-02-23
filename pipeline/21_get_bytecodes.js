'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS } = require('../config/env');

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

const replacer = /deaddeaddeaddeaddeaddeaddeaddeaddeaddead/gi;

async function main() {
  console.log('\n\n\n');

  console.log(
    'addressAsset=' +
      (await contract.methods.getAssetSource().call(from).catch(error))
  );
  console.log(
    'addressAssetProxy=' +
      (await contract.methods.getAsset().call(from).catch(error))
  );
  console.log(
    'addressAssetSigner=' +
      (await contract.methods.getAssetSigner().call(from).catch(error))
  );
  console.log(
    'addressErc721=' +
      (await contract.methods
        .getERC721CollectionSource()
        .call(from)
        .catch(error))
  );
  console.log(
    'addressFactory=' +
      fs.readFileSync('./data/' + NETWORK + '.factory.address', 'utf8')
  );
  console.log(
    'addressIdentity=' +
      (await contract.methods.getIdentitySource().call(from).catch(error))
  );
  console.log(
    'addressProvenance=' +
      (await contract.methods.getProvenanceSource().call(from).catch(error))
  );
  console.log(
    'addressProvenanceProxy=' +
      (await contract.methods.getProvenance().call(from).catch(error))
  );
  console.log(
    'addressRegistry=' +
      fs.readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
  );
  console.log(
    'addressRoyalties=' +
      (await contract.methods.getPA1DSource().call(from).catch(error))
  );
  console.log(
    'addressRoyaltiesProxy=' +
      (await contract.methods.getPA1D().call(from).catch(error))
  );

  console.log();

  const assetProxy = JSON.parse(
    fs.readFileSync('./build/contracts/CxipAssetProxy.json')
  ).bytecode;
  console.log(
    'byteCodeAssetProxy=' +
      assetProxy.replace(
        replacer,
        fs
          .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
          .trim()
          .substring(2)
      )
  );

  console.log('byteCodeCopyrightProxy=');

  const collectionProxy = JSON.parse(
    fs.readFileSync('./build/contracts/CxipERC721Proxy.json')
  ).bytecode;
  console.log(
    'byteCodeErc721Proxy=' +
      collectionProxy
        .replace(
          replacer,
          fs
            .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
            .trim()
            .substring(2)
        )
        .replace(
          /20202052617269626C6520526F79616c74696573/gi,
          fs
            .readFileSync('./data/' + NETWORK + '.rarible.address', 'utf8')
            .trim()
            .substring(2)
        )
  );

  console.log('byteCodeErc1155Proxy=');

  const identityProxy = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentityProxy.json')
  ).bytecode;
  console.log(
    'byteCodeIdentityProxy=' +
      identityProxy.replace(
        replacer,
        fs
          .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
          .trim()
          .substring(2)
      )
  );

  const provenanceProxy = JSON.parse(
    fs.readFileSync('./build/contracts/CxipProvenanceProxy.json')
  ).bytecode;
  console.log(
    'byteCodeProvenanceProxy=' +
      provenanceProxy.replace(
        replacer,
        fs
          .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
          .trim()
          .substring(2)
      )
  );

  const bytecode = JSON.parse(
    fs.readFileSync('./build/contracts/PA1DProxy.json')
  ).bytecode;
  console.log(
    'byteCodeRoyaltiesProxy=' +
      bytecode.replace(
        replacer,
        fs
          .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
          .trim()
          .substring(2)
      )
  );

  console.log('\n\n\n');

  process.exit();
}

main();
