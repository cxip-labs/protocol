'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, MNEMONIC } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);

const BROKER_ABI = JSON.parse(
  fs.readFileSync('./build/contracts/NFTBroker.json')
).abi;
const BROKER_ADDRESS = fs
  .readFileSync('./data/' + NETWORK + '.snuffy.broker.proxy.address', 'utf8')
  .trim();

const contract = new web3.eth.Contract(BROKER_ABI, BROKER_ADDRESS, {
    gas: web3.utils.toHex(500000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
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

async function main() {

    const wallet = provider.addresses[0];

    console.log ({
        getNotary: await contract.methods.getNotary().call(from).catch(error),
        tierLimits: await contract.methods.getTierTimes().call(from).catch(error),
        arePurchasesLimited: await contract.methods.arePurchasesLimited().call(from).catch(error),
        getPrices: await contract.methods.getPrices().call(from).catch(error),
        isVIP_yes: await contract.methods.isVIP('0xcf5439084322598b841c15d421c206232b553e78').call(from).catch(error),
        isVIP_no: await contract.methods.isVIP('0x0de817bEc631f2a08e78a43b3e4Fb7d4C99E49AA').call(from).catch(error),
        supportsInterface: await contract.methods.supportsInterface('0x150b7a02').call(from).catch(error),
        getPurchasedTokensAmount_3: await contract.methods.getPurchasedTokensAmount('0x4eb2bd049b8defcc32465315795e64d66aff9846').call(from).catch(error),
        getPurchasedTokensAmount_2: await contract.methods.getPurchasedTokensAmount('0xc7a4beee7d05f7a792550740010c3a90662ac2d7').call(from).catch(error),
        getPurchasedTokensAmount_1: await contract.methods.getPurchasedTokensAmount('0xe474f23a11091f2944f26a3757bd6e88b93ffc21').call(from).catch(error),
        getPurchasedTokensAmount_0: await contract.methods.getPurchasedTokensAmount('0xd070c78a8c30655b4ea86808257f57a454915176').call(from).catch(error),
        getPurchaseLimit: await contract.methods.getPurchaseLimit().call(from).catch(error),
        getReservedTokens_some: await contract.methods.getReservedTokens('0xcf5439084322598b841c15d421c206232b553e78').call(from).catch(error),
        getReservedTokens_none: await contract.methods.getReservedTokens('0x0de817bEc631f2a08e78a43b3e4Fb7d4C99E49AA').call(from).catch(error),
        getReservedTokenAmounts_one: await contract.methods.getReservedTokenAmounts('0x950f0dd952fE8da9F2935A760d4a5aE9BFACD366').call(from).catch(error),
        getReservedTokenAmounts_none: await contract.methods.getReservedTokenAmounts('0x0de817bEc631f2a08e78a43b3e4Fb7d4C99E49AA').call(from).catch(error),
        isOwner: await contract.methods.isOwner().call(from).catch(error),
        owner: await contract.methods.owner().call(from).catch(error),
        tokenByIndex1: await contract.methods.tokenByIndex(0).call(from).catch(error),
        tokenByIndex2: await contract.methods.tokenByIndex(10).call(from).catch(error),
        tokenByIndex3: await contract.methods.tokenByIndex(20).call(from).catch(error),
        tokenByIndex4: await contract.methods.tokenByIndex(125).call(from).catch(error),
        tokenByIndex5: await contract.methods.tokenByIndex(406).call(from).catch(error),
        tokensByChunk: await contract.methods.tokensByChunk(0, 400).call(from).catch(error),
//         tokensByChunk: await contract.methods.tokensByChunk(10, 10).call(from).catch(error),
        totalSupply: await contract.methods.totalSupply().call(from).catch(error)
    });

    process.exit();

}

main();
