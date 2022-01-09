'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, PRIVATE_KEY } = require('../config/env');

const FACTORY_CONTRACT = JSON.parse(
  fs.readFileSync('./build/contracts/NFTBroker.json')
);

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const notary = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);

//Contract object and account info
let FACTORY = new web3.eth.Contract(FACTORY_CONTRACT.abi);

let bytecode = FACTORY_CONTRACT.bytecode.replace(
  /deaddeaddeaddeaddeaddeaddeaddeaddeaddead/gi,
  fs
    .readFileSync('./data/' + NETWORK + '.registry.address', 'utf8')
    .trim()
    .substring(2)
);

const PROVENANCE_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/CxipProvenance.json')
).abi;
const PROVENANCE_ADDRESS = fs.readFileSync('./data/' + NETWORK + '.provenance.proxy.address', 'utf8').trim();

const provenance = new web3.eth.Contract(PROVENANCE_ABI, PROVENANCE_ADDRESS, {
  // gasLimit: '1721975',
  // gasPrice: '70000000000',
});

const error = function (err) {
  console.log(err);
  process.exit();
};
const from = {
  from: provider.addresses[0]
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

async function main() {

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

//     let openTokens = [];
//     for (let i = 1, l = 200; i <= l; i++) {
//         openTokens.push (i);
//     }

    // Function Parameter
    let payload = {
        data: bytecode,
        arguments: [
            web3.utils.toHex(web3.utils.toWei('0.2', 'ether')),
//             openTokens,
            ERC721_CONTRACT,
            notary.addresses[0]
        ]
    };

    let parameter = {
        from: provider.addresses[0],
        gas: web3.utils.toHex(6000000),
        gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
    };

    let finish = async function (newContractInstance) {
        const erc721 = new web3.eth.Contract(ERC721_ABI, ERC721_CONTRACT, {
            gas: web3.utils.toHex(300000),
            gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
        });
        console.log ('setBroker', await erc721.methods.setBroker(newContractInstance.options.address).send(from).catch(error));
        console.log ('getBroker', await erc721.methods.getBroker().call(from).catch(error));
        process.exit();
    };

    // Function Call
    FACTORY.deploy(payload)
        .send(parameter, function (err, transactionHash) {
            console.log('Transaction Hash :', transactionHash);
        })
        .then(function (newContractInstance) {
            fs.writeFileSync(
                './data/' + NETWORK + '.snuffy.broker.address',
                newContractInstance.options.address
            );
            console.log(
                'Deployed NFTBroker Contract : ' + newContractInstance.options.address
            );
            finish (newContractInstance);
        });
}

main();