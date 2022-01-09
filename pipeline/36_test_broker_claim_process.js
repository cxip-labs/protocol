'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, PRIVATE_KEY } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const provider2 = new HDWalletProvider(PRIVATE_KEY, rpc[NETWORK]);
const web3 = new Web3(provider);
const web32 = new Web3(provider2);

const BROKER_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/NFTBroker.json')
).abi;
const BROKER_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.snuffy.broker.address', 'utf8')
  .trim();

const contract = new web3.eth.Contract(BROKER_ABI, BROKER_ADDRESS, {
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

const TokenDataTupler = function (tokenData) {
    return [
        hexify (tokenData.payloadHash, true),
        [
            hexify (tokenData.verification.r, true),
            hexify (tokenData.verification.s, true),
            hexify (tokenData.verification.v, true),
        ],
        hexify (tokenData.creator, true),
        hexify (tokenData.arweave, true),
        hexify (tokenData.arweave2, true),
        hexify (tokenData.ipfs, true),
        hexify (tokenData.ipfs2, true)
    ];
};

const TokenDataCreator = function (jsonPayload, arweave, ipfs) {
    let tokenData = {
        payloadHash: '0x0000000000000000000000000000000000000000000000000000000000000001',
        verification: {
            r: '0x0000000000000000000000000000000000000000000000000000000000000002',
            s: '0x0000000000000000000000000000000000000000000000000000000000000003',
            v: '0x04'
        },
        creator: '0x0000000000000000000000000000000000000005',
//         creator: '0xa198FA5db682a2A828A90b42D3Cd938DAcc01ADE',
        arweave: '0x0000000000000000000000000000000000000000000000000000000000000006',
        arweave2: '0x0000000000000000000007',
        ipfs: '0x0000000000000000000000000000000000000000000000000000000000000008',
        ipfs2: '0x0000000000000000000000000009'
    };
    return tokenData;
};

const EncodeForSignature = function (creatorWallet, tokenId, states) {
    return web3.eth.abi.encodeParameters (
        [
            "address", // creatorWallet
            "uint256", // tokenId
            "tuple(bytes32,tuple(bytes32,bytes32,uint8),address,bytes32,bytes11,bytes32,bytes14)[]" // TokenData[]
            /*
            {
                "TokenData": {
                    "payloadHash": "bytes32",
                    "Verification": {
                        "r": "bytes32",
                        "s": "bytes32",
                        "v": "uint8"
                    },
                    "creator": "address",
                    "arweave": "bytes32",
                    "arweave2": "bytes11",
                    "ipfs": "bytes32",
                    "ipfs2": "bytes14"
                }
            }
               */
        ],
        [
            hexify (creatorWallet, true),
            hexify (tokenId.toString (16).padStart (64, '0'), true),
            states
        ]
    );
};

async function main() {
  const wallet = provider.addresses[0];

    let states = [];
    for (let i = 0, l = 6; i < l; i++) {
        states.push (
            TokenDataTupler (
                TokenDataCreator (
                    'JSONPayload',
                    'ARWEAVEURLHERE',
                    'IPFSURLHERE'
                )
            )
        );
    }
    console.log (states);
    let tokenId = 2;
    let forSigning = web3.utils.keccak256 (EncodeForSignature (wallet, tokenId, states));
    console.log (forSigning);
    let sig = await web3.eth.personal.sign (forSigning, wallet);
    let signature = {
        signature: sig,
        r: '0x' + sig.substring (2, 66),
        s: '0x' + sig.substring (66, 130),
        v: '0x' + (parseInt ('0x' + sig.substring (130, 132)) + 27).toString (16)
    };
    console.log (signature);

//     function claimAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {

    console.log (await contract.methods.claimAndMint (
        tokenId,
        states,
        [
            signature.r,
            signature.s,
            signature.v
        ]
    ).send ({
        from: provider.addresses[0],
        value: web3.utils.toHex(web3.utils.toWei('0.2', 'ether')),
        gas: web3.utils.toHex(4000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
    }).catch (error));

  process.exit();
}

main();
