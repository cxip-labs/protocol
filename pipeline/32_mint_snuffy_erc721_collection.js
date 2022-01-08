'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET } = require('../config/env');

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

const hexify = function (input) {
	input = input.toLowerCase ().trim ();
	if (input.startsWith ('0x')) {
		return input.substring (2);
	}
	return input.replace (/[^0-9a-f]/g, '');
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
  const wallet = provider.addresses[0];

  const IDENTITY_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/CxipIdentity.json')
  ).abi;
  const IDENTITY_CONTRACT = await provenance.methods
    .getIdentity()
    .call(from)
    .catch(error);

  const identity = new web3.eth.Contract(IDENTITY_ABI, IDENTITY_CONTRACT, {
    gas: web3.utils.toHex(300000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  });

  const ERC721_ABI = JSON.parse(
    fs.readFileSync('./build/contracts/SNUFFY500.json')
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
            gas: web3.utils.toHex(300000),
            gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei')),
  		}
  	);

    console.log ('setStateTimestamps', await contract.methods.setStateTimestamps ([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16
    ]).send(from).catch(error));
        console.log ('getStateTimestamps', await contract.methods.getStateTimestamps().call(from).catch(error));

    console.log ('setStartTimestamp', await contract.methods.setStartTimestamp (1234567890).send(from).catch(error));
        console.log ('getStartTimestamp', await contract.methods.getStartTimestamp().call(from).catch(error));
//    console.log ('setTokenSeparator', await contract.methods.setTokenSeparator (10000).send(from).catch(error));
//     console.log ('getTokenSeparator', await contract.methods.getTokenSeparator().call(from).catch(error));
//    console.log ('setTokenLimit', await contract.methods.setTokenLimit (200 + 150 + 99).send(from).catch(error));
//     console.log ('getTokenLimit', await contract.methods.getTokenLimit().call(from).catch(error));
//
//     console.log ('setRotationConfig', await contract.methods.setRotationConfig(1, 1560, 10, 5).send(from).catch(error));
//     console.log ('getRotationConfig', await contract.methods.getRotationConfig(1).call(from).catch(error));
//     console.log ('setRotationConfig', await contract.methods.setRotationConfig(2, 5530, 10, 5).send(from).catch(error));
//     console.log ('getRotationConfig', await contract.methods.getRotationConfig(2).call(from).catch(error));
//     console.log ('setRotationConfig', await contract.methods.setRotationConfig(3, 5720, 10, 5).send(from).catch(error));
//     console.log ('getRotationConfig', await contract.methods.getRotationConfig(3).call(from).catch(error));
//     console.log ('setMintingClosed', await contract.methods.setMintingClosed().send(from).catch(error));
/*
X = 1-6
0X-DA_964_LOOP_STATEX
0X-DA_930_LOOP_STATEX
0X-DA_356_LOOP_STATEX
*/
// ./deployment_assets/files/FILE.arweave.json // hash and sign
//     let jobs = ['0X-DA_964_LOOP_STATEX', '0X-DA_930_LOOP_STATEX', '0X-DA_356_LOOP_STATEX'];
//     let hashes = JSON.parse (fs.readFileSync ('./deployment_assets/hashes.json'));
//
//     let ids;
//     let mintData;
//     let id = 6;
//     for (let x = 0, xl = 3; x < xl; x++) {
//         ids = [];
//         mintData = [];
//         for (let i = 0, l = 6; i < l; i++) {
//             let arweave = removeX (web3.utils.utf8ToHex (hashes [jobs [x].replace (/X/g, (i+1).toString ()) + '.arweave.json'].arweave)).padStart (64, '0');
//             let ipfs = removeX (web3.utils.utf8ToHex (hashes [jobs [x].replace (/X/g, (i+1).toString ()) + '.ipfs.json'].ipfs)).padStart (64, '0');
//             let arweavePayload = web3.utils.keccak256 (fs.readFileSync ('./deployment_assets/files/' + jobs [x].replace (/X/g, (i+1).toString ()) + '.arweave.json'));
// //             console.log ('arweave', arweave, 'ipfs', ipfs);
// //             console.log ('arweave', arweave.substr (0, 64), arweave.substr (64, 22));
// //             console.log ('ipfs', ipfs.substr (0, 64), ipfs.substr (64, 28));
//             ids.push (id);
//
// /*
//     bytes32 payloadHash;
//     Verification payloadSignature;
//     address creator;
//     bytes32 arweave;
//     bytes11 arweave2;
//     bytes32 ipfs;
//     bytes14 ipfs2;
// */
//
//             let payload = '0x' + removeX (web3.utils.keccak256 (arweavePayload));
//     		let sig = await web3.eth.personal.sign (payload, wallet);
//
//             mintData.push ([
//                 payload,
//                 [
//                     '0x' + sig.substring (2, 66),
//                     '0x' + sig.substring (66, 130),
//                     '0x' + (parseInt ('0x' + sig.substring (130, 132)) + 27).toString (16)
//                 ],
//                 wallet,
//                 '0x' + arweave.substr (0, 64),
//                 '0x' + arweave.substr (64, 22),
//                 '0x' + ipfs.substr (0, 64),
//                 '0x' + ipfs.substr (64, 28)
//             ]);
//             id++;
//         }
// //         console.log (ids, mintData);
//         console.log ('prepareMintDataBatch', x, await contract.methods.prepareMintDataBatch(ids, mintData).send(from).catch(error));
//     }
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 10001, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 10051, 49, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 20001, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 20051, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 20101, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 30001, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 30051, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 30101, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));
//     console.log ('batchMint', await contract.methods.batchMint(wallet, 30151, 50, '0xe052113bd7d7700d623414a0a4585bcae754e9d5').send(from).catch(error));

//   	console.log ({
//   		'owner': await contract.methods.isOwner ().call (from).catch (error),
//   // 		'collectionId': await erc721.methods.collectionId ().call (from).catch (error),
//   		'totalSupply': await contract.methods.totalSupply ().call (from).catch (error),
//   		'name': await contract.methods.name ().call (from).catch (error),
//   		'symbol': await contract.methods.symbol ().call (from).catch (error),
//   // 		'description': await erc721.methods.description ().call (from).catch (error),
//   		'baseURI': await contract.methods.baseURI ().call (from).catch (error),
//   		'contractURI': await contract.methods.contractURI ().call (from).catch (error)
//   	});
  process.exit();
}

main();
