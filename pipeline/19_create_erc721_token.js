'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, WALLET, PRIVATE_KEY } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./config/rpc.json', 'utf8'));
const assetProvider = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);
const assetWeb3 = new Web3(assetProvider);

const PROVENANCE_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipProvenance.json')
).abi;
const PROVENANCE_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.provenance.proxy.address', 'utf8')
  .trim();

const provenance = new web3.eth.Contract(
  PROVENANCE_ABI,
  PROVENANCE_ADDRESS,
  {}
);

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

async function main() {
  const payload =
    '0x398d6a45a2c3d1145dfc3a229313e4c3b65165eb0b8b04c0fe787d0e32924775';
  const tokenId =
    '0x0000000000000000000000000000000000000000000000000000000000000001';
  const wallet = provider.addresses[0];

  const sig = await web3.eth.personal.sign(payload, wallet);

  const signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };

  console.log(sig);
  console.log(signature);

  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
  const IDENTITY_CONTRACT = await provenance.methods
    .getIdentity()
    .call(from)
    .catch(error);

  const contract = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gasLimit: '6721975',
    gasPrice: '20000000000',
  });

  const ERC721_CONTRACT = await contract.methods
    .getCollectionById(0)
    .call(from)
    .catch(error);

  const arHash = 'd3dStWPKvAsticf1YqNT3FQCzT2nYlAw' + 'RVNFVlKmonc';
  const ipfsHash = 'QmX3UFC6GeqnmBbthWQhxRW6WgTmWWVd' + 'ist3TL59UbTZYx';

  const assetSig = await assetWeb3.eth.personal.sign(
    web3.utils.keccak256(
      '0x' +
        removeX(IDENTITY_CONTRACT) +
        removeX(wallet) +
        removeX(ERC721_CONTRACT) +
        removeX(
          web3.eth.abi.encodeParameter('uint256', web3.utils.toBN(tokenId))
        ) +
        removeX(payload) +
        removeX(signature.r) +
        removeX(signature.s) +
        removeX(signature.v) +
        removeX(web3.utils.asciiToHex(arHash)) +
        removeX(web3.utils.asciiToHex(ipfsHash))
    ),
    assetProvider.addresses[0]
  );

  const assetSigner = {
    r: '0x' + assetSig.substring(2, 66),
    s: '0x' + assetSig.substring(66, 130),
    v: '0x' + (parseInt('0x' + assetSig.substring(130, 132)) + 27).toString(16),
  };

  const result = await contract.methods
    // .createERC721Token (address collection, uint256 id, TokenData calldata tokenData, Verification calldata verification)
    .createERC721Token(
      ERC721_CONTRACT,
      tokenId,
      [
        payload,
        [signature.r, signature.s, signature.v],
        wallet,
        web3.utils.asciiToHex(arHash.substring(0, 32)),
        web3.utils.asciiToHex(arHash.substring(32, 43)),
        web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
        web3.utils.asciiToHex(ipfsHash.substring(32, 46)), //,
        // 				'0x000000000000000000000000000000000000'
      ],
      [assetSigner.r, assetSigner.s, assetSigner.v]
    )
    .send(from)
    .catch(error);

  // 	console.log ("\n");
  // 	console.log (result);
  // 	processEvents (result);
  console.log('ERC721 Token Created : ' + tokenId);
  console.log('\tGas Used : ' + result.gasUsed);
  // 	console.log ("\n");
  process.exit();
}

main();
