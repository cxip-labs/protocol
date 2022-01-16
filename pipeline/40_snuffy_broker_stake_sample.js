'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, NOTARY } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);

const notaryProvider = new HDWalletProvider(NOTARY, rpc[NETWORK]);
const notaryWeb3 = new Web3(notaryProvider);

const BROKER_ABI = JSON.parse(fs.readFileSync('./build/contracts/NFTBroker.json')).abi;
const BROKER_ADDRESS = fs.readFileSync('./data/' + NETWORK + '.snuffy.broker.proxy.address', 'utf8').trim();

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
	input = removeX (input);
	input = input.replace (/[^0-9a-f]/g, '');
	if (prepend) {
	    input = '0x' + input;
	}
	return input;
};

const getRandomInt = function (min, max) {
    min = Math.ceil (min);
    max = Math.floor (max);
    return Math.floor (Math.random () * (max - min + 1)) + min;
}

async function main() {

    const wallet = provider.addresses[0];
    const notaryWallet = notaryProvider.addresses[0];

    /**
     *  For staking to work properly, we need to first check them for valid ownership of snuffy NFTs
     *  This is done via OAuth with Nifty Gateway, and other NFTs can be checked with simple web3 calls to smart contract
     *
     *  Once the checks have been made, we know the wallet of the user and the amount of snuffy NFTs they hold.
     */

    // sample staker wallet
    let stakerWallet = '0xb2ba39f255649359517cce05d852065be351807b';
    // sample amount of snuffy NFTs staker holds
    let stakerNfts = 3;

    // once we have these details, we need to sign a message with notary to guarantee that the data is valid
    // IMPORTANT: this needs to be signed on back-end and not on front end since private keys are involved

    // we construct the payload to sign
    // this is pretty much the equivalent to solidity keccak256(abi.encodePacked(stakerWallet,stakerNfts));
    let payload = web3.utils.keccak256 (
        removeX (stakerWallet)
        + hexify (
            stakerNfts
                .toString (16)
                .padStart (64, '0')
        )
    );

    // have the notary wallet sign the encoded payload
    let sig = await notaryWeb3.eth.personal.sign (payload, notaryWallet);
    let signature = {
        signature: sig,
        r: '0x' + sig.substring (2, 66),
        s: '0x' + sig.substring (66, 130),
        v: '0x' + (parseInt ('0x' + sig.substring (130, 132)) + 27).toString (16)
    };

    // just grabbing a token for sample use
    const tokens = JSON.parse (fs.readFileSync ('./tokens.json', 'utf8'));
    let token = tokens [getRandomInt (0, tokens.length)];
    console.log (token);

    // now we do standard token claim flow, but with the additional staking details

    // calling this function here
    // function proofOfStakeAndMint (Verification calldata proof, uint256 tokens, uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification)
    console.log (
        await contract.methods.proofOfStakeAndMint (
            // prood
            [
                signature.r, // proof r
                signature.s, // proof s
                signature.v, // proof v
            ],
            stakerNfts, // tokens
            token.tokenId, // tokenId
            token.raw.states, // tokenData
            token.raw.signature // verification
        ).send (from).catch (error)
    );

    process.exit();

}

main();
