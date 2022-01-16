'use strict';

const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const { NETWORK, GAS, WALLET, MNEMONIC } = require('../config/env');

const rpc = JSON.parse(fs.readFileSync('./rpc.json', 'utf8'));
const provider = new HDWalletProvider(WALLET, rpc[NETWORK]);
const web3 = new Web3(provider);
const buyerProvider = new HDWalletProvider(MNEMONIC, rpc[NETWORK], 0, 10);
const buyerWeb3 = new Web3(buyerProvider);

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
    gas: web3.utils.toHex(2000000),
    gasPrice: web3.utils.toHex(web3.utils.toWei(GAS, 'gwei'))
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
// console.log (buyerProvider.addresses);
async function main() {
  const wallet = provider.addresses[0];

//     console.log ('totalSupply', await contract.methods.totalSupply().call(from).catch(error));
//     console.log ('setTierTimes', await contract.methods.setTierTimes (
//         parseInt (Math.floor ((Date.now () / 1000) + 10)), // tier 1 unlocks in 10 seconds
//         parseInt (Math.floor ((Date.now () / 1000) + (60 * 60 * 24 * 7))), // tier 2 unlocks in 1 week
//         parseInt (Math.floor ((Date.now () / 1000) + (60 * 60 * 24 * 14))), // tier 3 unlocks in 2 weeks
//     ).send(from).catch(error));
//     console.log ('totalSupply', await contract.methods.totalSupply().call(from).catch(error));
//     console.log ('getTierTimes', await contract.methods.getTierTimes().call(from).catch(error));

//     console.log ('setPrices', await contract.methods.setPrices (
//         web3.utils.toHex(web3.utils.toWei('0.4', 'ether')),
//         web3.utils.toHex(web3.utils.toWei('0.2', 'ether')),
//         web3.utils.toHex(web3.utils.toWei('0.2', 'ether'))
//     ).send(from).catch(error));
//     console.log ('totalSupply', await contract.methods.totalSupply().call(from).catch(error));
//     console.log ('getPrices', await contract.methods.getPrices().call(from).catch(error));

    let vipList = [
        '0x3bf961a49d37999f2e748e1972bac2e112fe3dd9',
        '0xac79afddf2df81fe94c64fb9417cb39cb7410a42',
        '0x49e828c0eb83aaf61dc007b0985f6e5a4bb0b14f',
        '0x49c7f677eba5a7009fabea8b84e7870cfae46374',
        '0x4dd1f122de72e4c630ce1591206d9d0702976cd4',
        '0x4eb2bd049b8defcc32465315795e64d66aff9846',
        '0x36b14702fbcc23cbd58acc5966a76e6cee02f22a',
        '0x46a1744da7ddcbe4f674bc9b8436c24b030e08bb',
        '0xa0208872f78163e36ccf11e5d9885d02333d7a20',
        '0x63f49a9f7d797134f32e16675a1c1e467f1adb9b',
        '0x1f3fca11ac48b8f5db10e23e9f88289a896faa13',
        '0xb549e3bdff1544ed435da19d0d2af2ea931468dd',
        '0x8846d8be37cb54f9821f65b08144580193e48046',
        '0x29a77c89806d7a5f18120a4bc7cfac1b2f0d6d45',
        '0x7891596b9c9e6fe809a81ae56e39a5e710259bb5',
        '0x8f98ccdbf03c46bf769fe993f6b284b2fcc45f6e',
        '0xcfe42f69008370dcf5b66d02d283d45dfbfedc1b',
        '0x291ebd0d30b20e1fcee7fcdbb5f318baccfb86f6',
        '0xf2307034f721cbc304c3e41dd6f804e74be25944',
        '0x7fee17c925522baf4033203c21ff166e194ce084',
        '0xe237355193c4cc1d0b99c1ce05d6389933c1c1c2',
        '0xc7a4beee7d05f7a792550740010c3a90662ac2d7',
        '0xe5c1999f4f9e953ac30f8059172a0257b68228cc',
        '0x9bc0b062c4ceb53d1261092944ee213845f28b42',
        '0xe4065e11ada65448f849ddb797be65a8c85cc4d1',
        '0xe474f23a11091f2944f26a3757bd6e88b93ffc21',
        '0x12d8f38314373fcc3212d53832e9fc6b4dbad9c6',
        '0x598da40598fe98e83b4f9996729ae8b51c52bb34',
        '0xc5e2b4bd2a4fcc7b9c0775d9fc40da3942d614bf',
        '0xfac89ae4e3c3090b541eccfd7ddf6864b841dcaa',
        '0xe566440c317ad847c6dba12092530e49d3924cca',
        '0xcd46064cfc599c15576901a3693a265eeddf4569',
        '0xf0d6999725115e3ead3d927eb3329d63afaec09b',
        '0x8da7a51841954d0bbf507ebfdc529e069c29084f',
        // F&F
        '0xb9cd29d1642878b542a96eadcbe291c48745e227',
        '0xcecd75250e10d0824229760283c38fea556f084c',
        '0xa3818bc0ab0fc8273f308ba2793e49e10aa1f756',
        '0x1859e14a036fff69246d79def54acf2053c57810',
        '0xa876cd9e1e30abcce2bfe66037c726a2517972d4',
        '0x1e8e749b2b578e181ca01962e9448006772b24a2',
        '0xaa2f1afc79855bc11686a1a50013c1cedfeb52a9',
        '0xd3f0862e4acef9a0c2d7fc4eac9ab02c80d7b16c',
        '0xcf5439084322598b841c15d421c206232b553e78',
        '0xc082bdb52b9f341d8ab5d8ae9da708d13c230cca',
        '0xf5052c9c6bd81a27588e25f0bf12c8cb1d242b1b'
    ];
//     console.log ('setVIPs', await contract.methods.setVIPs (vipList).send(from).catch(error));

    let purchasedAmountData = [
        ['0x4dd1f122de72e4c630ce1591206d9d0702976cd4', 1],
        ['0x4eb2bd049b8defcc32465315795e64d66aff9846', 3],
        ['0xb549e3bdff1544ed435da19d0d2af2ea931468dd', 1],
        ['0xe237355193c4cc1d0b99c1ce05d6389933c1c1c2', 1],
        ['0xc7a4beee7d05f7a792550740010c3a90662ac2d7', 2],
        ['0xe5c1999f4f9e953ac30f8059172a0257b68228cc', 2],
        ['0xe474f23a11091f2944f26a3757bd6e88b93ffc21', 1],
        ['0x12d8f38314373fcc3212d53832e9fc6b4dbad9c6', 1],
        ['0xc5e2b4bd2a4fcc7b9c0775d9fc40da3942d614bf', 1],
        ['0xfac89ae4e3c3090b541eccfd7ddf6864b841dcaa', 1],
        ['0xf0d6999725115e3ead3d927eb3329d63afaec09b', 3],
        ['0xa8c045e857c1c4550119b612f22c3b27ece10340', 1], // wrong nft guy
        // F&F
        ['0xb9cd29d1642878b542a96eadcbe291c48745e227', 1], //
        ['0xcecd75250e10d0824229760283c38fea556f084c', 1], //
        ['0xa3818bc0ab0fc8273f308ba2793e49e10aa1f756', 1], //
        ['0x1859e14a036fff69246d79def54acf2053c57810', 2], //
        ['0xa876cd9e1e30abcce2bfe66037c726a2517972d4', 1], //
        ['0x1e8e749b2b578e181ca01962e9448006772b24a2', 2], //
        ['0xaa2f1afc79855bc11686a1a50013c1cedfeb52a9', 1], //
        ['0xd3f0862e4acef9a0c2d7fc4eac9ab02c80d7b16c', 1], //
        ['0xcf5439084322598b841c15d421c206232b553e78', 1], //
        ['0xc082bdb52b9f341d8ab5d8ae9da708d13c230cca', 1] //
    ];
    let purchaseAmountWallets = [];
    let purchaseAmounts = []
    for (let i = 0, l = purchasedAmountData.length; i < l; i++) {
        let d = purchasedAmountData [i];
        purchaseAmountWallets.push (d [0]);
        purchaseAmounts.push (d [1]);
    }
//     console.log ('setPurchasedTokensAmount', await contract.methods.setPurchasedTokensAmount (purchaseAmountWallets, purchaseAmounts).send(from).catch(error));

//     console.log ('totalSupply', await contract.methods.totalSupply().call(from).catch(error));
    let singleWhitelists = [
        {"wallet":"0xa3135c8a0b438a2069d222ae4e22d7c34ca71766","tokenIds":51},
        {"wallet":"0xab3a1887e872d027c1b502495d971bcbe50f4234","tokenIds":60},
        {"wallet":"0xac057b3812000a71b6bb82d98f532e4fc66fafe4","tokenIds":65},
        {"wallet":"0x19ab431c5a52838852d5cff3acb91ee1c270efc3","tokenIds":66},
        {"wallet":"0xf556b3d8304f6c484336641e64893be5e4c75f86","tokenIds":68},
        {"wallet":"0xfdec0aabcd16f5e3953aa479d6d1dff298483c1e","tokenIds":79},
        {"wallet":"0x6ee9c4ec2c8607a30e5c0c73c375b4ac17e3ac61","tokenIds":110},
        {"wallet":"0xd070c78a8c30655b4ea86808257f57a454915176","tokenIds":116},
        {"wallet":"0xc5fc04954d3efaee27b605ec3b1c6f57f9cc2b33","tokenIds":128},
        {"wallet":"0xeb168b3f507a7788cb43b418854c387fdad3f529","tokenIds":162},
        {"wallet":"0xc1971bf7cdde81ebb91ee6ddd5268feb26ea4927","tokenIds":174},
        {"wallet":"0x8133fd528459a411719ad1041f29010d4c52cf77","tokenIds":187},
        {"wallet":"0x0b58f0f6442c8e740f2321dd755265f1ec706eff","tokenIds":214},
        {"wallet":"0xb40cb713b70c04bd8eb59e490a4f13d16bae95dc","tokenIds":221},
        {"wallet":"0x3877b0f62f5726599ede002d4b3f3e4205c170ba","tokenIds":255},
        {"wallet":"0x6363de32650afe0db2ebcb597ee4e328672afdf6","tokenIds":269},
        {"wallet":"0x205003383e31e20eb4ec59015a99963cfa1944b3","tokenIds":274},
        {"wallet":"0x275d7ceeed92a66b3eec8350cecd207c3fbba3fa","tokenIds":281},
        {"wallet":"0x0386fed4826fa56e78fed5f71889744936bcc83a","tokenIds":288},
        {"wallet":"0x96258be0c00aaa58ddc34213f017d9d5bd0c2829","tokenIds":311},
        {"wallet":"0xa0876b8e1a842475f6de042ad7dafa78f71e880d","tokenIds":312},
        {"wallet":"0x247b03f41c77c3c527448b51a6d0fd05006daea5","tokenIds":331},
        {"wallet":"0xdd88782cb353576f3b5993bebd92bdf58391a523","tokenIds":339},
        {"wallet":"0xc9c647f82832bdd4819d126711a5a53c8100dfad","tokenIds":347},
        {"wallet":"0x4ee9f870aee024d057d2f9c9fc5ea81d806fb5b7","tokenIds":348},
        {"wallet":"0xfdec0aabcd16f5e3953aa479d6d1dff298483c1e","tokenIds":406},
        {"wallet":"0x570b35249a610535565df7ef072dfef179def055","tokenIds":446},
        {"wallet":"0x1F272B42494B0200bcb2248749F9D7D3c2a963Bc","tokenIds":453},
        {"wallet":"0x037db2bb2c70a4f17789d7f7704f0f3b9a4b4282","tokenIds":505},
// this is the one that accidentally got the wrong nft
        {"wallet":"0xa8c045e857c1c4550119b612f22c3b27ece10340","tokenIds":516},
        {"wallet":"0x76B687cF4E5a4e73Fa3950D6cC642bCC64e40B88","tokenIds":521},
        {"wallet":"0x881da5d07d4f59144294c3fe3bd3055b7eae6dd1","tokenIds":539},
        {"wallet":"0x3efd9bf3f98683902d1c98db9ea373573ddb87af","tokenIds":530},
        {"wallet":"0xbd914e45c95865f9d90b445cafc9952fcfc539d4","tokenIds":548},
        {"wallet":"0x663bd3413c06c3d8c0ad2a0055479cb046fefe0e","tokenIds":532},
        {"wallet":"0x16cd5dbfe3001755e064387dac274947302573ec","tokenIds":523},
        {"wallet":"0x8e7cea21ca6cda69a7ce499aa9bb383bc269b144","tokenIds":527}
    ];
    let singleWallets = [];
    let singleTokens = [];
    for (let i = 0, l = singleWhitelists.length; i < l; i++) {
        let d = singleWhitelists [i];
        singleWallets.push (d.wallet);
        singleTokens.push (d.tokenIds);
    }
//     console.log ('setReservedTokens', await contract.methods.setReservedTokens (
//         singleWallets,
//         singleTokens
//     ).send(from).catch(error));

//     console.log ('totalSupply', await contract.methods.totalSupply().call(from).catch(error));
    let multiWhitelists = [
//         {"wallet":"0xf5052c9c6bd81a27588e25f0bf12c8cb1d242b1b","tokenIds":[32,180,285]}
        {"wallet":"0xcf5439084322598b841c15d421c206232b553e78","tokenIds":[16,22,25,31,34,50,55,89,105,114,141,172,175,176,179,199,213,216,218,219,235,237,242,299,303,330,364,365,421,432,435,472,506,511,525,555,260]}
    ];
    let multiWallets = [];
    let multiTokens = [];
    for (let i = 0, l = multiWhitelists.length; i < l; i++) {
        let d = multiWhitelists [i];
        multiWallets.push (d.wallet);
        multiTokens.push (d.tokenIds);
    }
    console.log ('setReservedTokensArrays', await contract.methods.setReservedTokensArrays (
        multiWallets,
        multiTokens
    ).send(from).catch(error));

    let friendsAndFamily = [
        '0xa198FA5db682a2A828A90b42D3Cd938DAcc01ADE',
        '0x9F28a74249698A1517713398F93cc47374690772',
        '0xCC403720a44d27916089029bedD4aC3A3F6CFd62',
        '0xde01076afcc9b86592afb77b5856f7d653c19f94',
        '0xB56b21f575c6A181E852413Fc5a4b838e7A50D0e',
        '0x2786D0e23d1960644291eB7c26A01581A50d94c2',
        '0xbb34d08c67373e54f066e6e7e6c77846ff7d2714',
        '0xb0728e38704fcc7ab3fc87d7aaff434e6b4b6ea8',
        '0xB7E5e785657388E286F633bf793a0B6B307992C6',
        '0xE9012a724562B96785B09250152a601F4970503d',
        '0x61a94BD03562BeF44093bd38b26F148B61Aa7f01',
        '0x25f71a5e1b2bb01624c390eb2d99b29b71f8d359',
        '0xa883b60c5ead0efd604b41a7c0509c3c6b81739e',
        '0xcf33f3402574785b1ca4b2d03234a7d99280bf4e',
        '0x19847a32B0eB348b006C79c1FB2d3aE1276c6028',
        '0x2213431dF63F04A7250ad16BE1BA6DE0695e3Da8',
        '0x41AB87ae7552B11D993b774F62F38De07Cf6ad40',
        '0x626a751a90e872F23a67645676deda57b09807cE',
        '0xfea037b0b5edCc90c626e2E1D5D792b949888892',
        '0xc842Ce7214A14Fa98186a010bcb43c7e99e4caF3',
        '0x782d0a6bb5e4709da3c53f9f27f3fd31529fa3f1',
        '0x1F257188e3b426D97e50a8482aC871c15C7180c2',
        '0x950f0dd952fE8da9F2935A760d4a5aE9BFACD366',
        '0x81Dc59975429f58C93D7ee9a536a92c9cA469aAA',
        '0x275Cf8F5318AF3f17e4e57344D362D2204d0e12D',
        '0xAF2a7b802C38E584472e34351E7447810D8510AC',
        '0x47d663e837c84f3fd6ab1e02a347ba2e0423cbc5',
        '0x321ed5739440bdbd731d54a19aa20b18398d374f',
        '0xFD926e0E26B673dC10D670742861c474a80D6773',
        '0xdfbDB9b9174862eCB1010C39ca72409C1D63B18F',
        '0xb8663D418298aE47CAcaa75145649032FeCe923f',
        '0x88092b00147af02a69fe764bbcd7be4c78a97710',
        '0x6d1c46842DeD926339Bf665bE4474cB951E275F8',
        '0x3e5f46ad03a924d0c1ddc9aa311fdd265be312df',
        '0x7FcBdf98c5099CFDEA1F4b23967856a05E48C465',
        '0x8e3632743163f6a4d38a6953e071958f95d88fb3',
        '0x81aeb18677c608c05e9c4848320cad9a2a7fa196',
        '0x8B1bF8f4D32FBa8ACf5aCef758d47D035994D31d',
        '0xd208F9da74A8C9573A45360A08887BbCc6908534',
        '0xaf24438ac4ad1ff9cbb7aa47e980fb558348b8df',
        '0x1E30988D83d4273dfd3a2d90E482f6Efa7980155',
        '0x521C836f912c0b4710F954e4983080f94d8da572',
        '0xC9d13Bdcf27B24569d02D28411a9F20852fA8A0a',
        '0xdFBB06683a882E827907422dbFE836E5430fE2aC',
        '0xcfb96bc298aadf182d9f1300c37bd4c5fef25b45',
        '0x6f78a6C41E3a5CB650899729cD99F1bF136C609C',
        '0x76E019f86C4898B3823bb398713fD72fDa470E4D',
        '0xd4a5bf76d0300359efa7cfb428ec739e538a7fe3',
        '0xB704033F0C6ac7cD9295F1E274FC4A1a6C00F1Bf',
        '0xb13edc109c0b2a512F476B0Ae2051F42eB8A6754',
        '0xfbA5aAB6113719d468894CB2e6B502f4F4B741C1',
        '0xF7bcCC29ae64F761A887eFc486Bcbd2d54209620',
        '0x2b9DE8833EE543433Bf0BeEde6c6101f2c93885e',
        '0x60065A92F316b6b04f89b3555b90703DCc9e30F9',
        '0x81F971d94328f5833E4aB8eC7591Ee148C651996',
        '0xB0c4E94188c0acBC722bb41ec4772272010F088f',
        '0x0Ea763Ad59E88FD55455283d480523b280D7AfE1',
        '0x3eA006418d140081d6876A869148B9A238599D90',
        '0x7dBa2777F42Ec368145E2426b7880690DBE53902'
    ];
    let reservedAmounts = [];
    for (let i = 0, l = friendsAndFamily.length; i < l; i++) {
        reservedAmounts.push (1);
    }
//     console.log ('setReservedTokenAmounts', await contract.methods.setReservedTokenAmounts (
//         friendsAndFamily,
//         reservedAmounts
//     ).send(from).catch(error));


    let unavailableTokens = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 46, 50, 51, 54, 55, 60, 63, 65, 66, 68, 75, 79, 89, 96, 104, 105, 110, 112, 114, 116, 121, 124, 128, 141, 162, 166, 172, 174, 175, 176, 179, 180, 185, 187, 188, 191, 195, 199, 202, 213, 214, 215, 216, 218, 219, 221, 234, 235, 237, 242, 250, 255, 256, 260, 269, 274, 275, 279, 280, 281, 283, 285, 287, 288, 299, 303, 310, 311, 312, 319, 330, 331, 339, 344, 347, 348, 355, 363, 364, 365, 368, 369, 387, 394, 406, 415, 421, 432, 435, 446, 453, 457, 472, 492, 501, 505, 506, 511, 516, 521, 523, 525, 527, 530, 532, 539, 545, 548, 553, 555];
    let availableTokens = [];
    for (let i = 1, l = 555; i <= l; i++) {
        if (!unavailableTokens.includes (i)) {
            availableTokens.push (i);
        }
    }
    console.log (JSON.stringify (availableTokens));
    console.log (JSON.stringify (availableTokens.length));
//     console.log (availableTokens.slice (0, 100));
//     console.log (availableTokens.slice (100, 200));
//     console.log (availableTokens.slice (200, 300));
//     console.log (availableTokens.slice (400, 408));
//     console.log ('totalSupply', await contract.methods.totalSupply().call(from).catch(error));
//     console.log ('setOpenTokens', await contract.methods.setOpenTokens (availableTokens.slice (400, 408)).send(from).catch(error));
//     console.log ('totalSupply', await contract.methods.totalSupply().call(from).catch(error));
//     console.log ('removeOpenTokens', await contract.methods.removeOpenTokens ([260]).send(from).catch(error));

//     setTimeout (function () {
        process.exit();
//     }, 11 * 1000);

}

main();
