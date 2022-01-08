const fs = require ('fs');
const HDWalletProvider = require ('truffle-hdwallet-provider');
const MNEMONIC = process.env.MNEMONIC || '';
const INFURA_API_KEY = process.env.INFURA_API_KEY || '0429681acb2a4a9d869c63e831d64425';
const LOCAL_HOST_URL = 'http://localhost:8545';
const CXIP_NODE_URL = 'https://rpc.cxip.dev';
const RINKEBY_NODE_URL = 'https://rinkeby.infura.io/v3/' + INFURA_API_KEY;
const MAINNET_NODE_URL = 'https://97a530cec94a42fcb0e5fbaea538f149.eth.rpc.rivet.cloud';
// const MAINNET_NODE_URL = 'https://mainnet.infura.io/v3/' + INFURA_API_KEY;

module.exports = {
	networks: {
		development: {
			provider: function () {
				return new HDWalletProvider (
					MNEMONIC,
					LOCAL_HOST_URL,
					0,
					10,
					false,
					'm/44\'/60\'/0\'/0/'
				);
			},
			gas: 6721975,
			gasPrice: 0,
			network_id: 5777
		},
		cxip: {
			provider: function () {
				return new HDWalletProvider (
					MNEMONIC,
					CXIP_NODE_URL,
					0,
					10,
					false,
					'm/44\'/60\'/0\'/0/'
				);
			},
			gas: 6721975,
			gasPrice: 20000000000,
			network_id: 1337
		},
// 		rinkeby: {
// 			provider: function () {
// 				return new HDWalletProvider (
// 					MNEMONIC,
// 					RINKEBY_NODE_URL,
// 					0,
// 					10,
// 					false,
// 					'm/44\'/60\'/0\'/0/'
// 				);
// 			},
// 			gas: 6721975,
// 			gasPrice: 65000000000,
// 			network_id: '*' // Match any network id
// 		},
		live: {
			network_id: 1,
			provider: function () {
				return new HDWalletProvider (
					MNEMONIC,
					MAINNET_NODE_URL,
					0,
					10,
					false,
					'm/44\'/60\'/0\'/0/'
				);
			},
			gas: 6721975,
			gasPrice: 60000000000
		}
	},
	mocha: {
	},
	compilers: {
		solc: {
			version: '0.8.4+commit.c7e474f2.Emscripten.clang',
			settings: {
				optimizer: {
					enabled: true,
					runs: 20000
				},
				outputSelection: {
					'*': {
						'*': [
							'abi',
							'devdoc',
							'userdoc',
							'metadata',
							'storageLayout',
							'evm.assembly',
							'evm.bytecode',
							'evm.methodIdentifiers',
							'evm.gasEstimates'
						]
					}
				}
			}
		}
	}
};
