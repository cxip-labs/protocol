import { run, ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumberish, BytesLike, ContractFactory } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { utf8ToBytes32, ZERO_ADDRESS, sha256 } from '../test/utils';
import axios from 'axios';
import Web3 from 'web3';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
/*
  const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');
  const network = hre.network.name;
  const { deployments, getNamedAccounts } = hre;
  const accounts = await ethers.getSigners();
  const deployer: SignerWithAddress = accounts[(network == 'hardhat' ? 5 : 0)];

  const wallet = deployer.address;

  const salt: BytesLike =
    deployer.address + '0x000000000000000000000000'.substring(2);

  const danielArshamErosionsProxyBytecode: BytesLike = (
    (await ethers.getContractFactory(
      'DanielArshamErodingAndReformingCarsProxy'
    )) as ContractFactory
  ).bytecode;
  console.log(
    'danielArshamErosionsProxyBytecode is:',
    danielArshamErosionsProxyBytecode
  );

  // Get the registry contract and set the required contract addresses
  const registry = await ethers.getContract('CxipRegistry');
  console.log('Registry address is:', registry.address);

  const provenanceAddress = await registry.getProvenance();
  console.log('provenanceAddress is:', provenanceAddress);

  const provenanceContract = await ethers.getContract('CxipProvenance');

  const provenance = provenanceContract.attach(provenanceAddress);

  if (network == 'hardhat') {
    // if we on localhost, we make an identity
    const identityCreationTx = await provenance
      .connect(deployer)
      .createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        ['0x' + '00'.repeat(32), '0x' + '00'.repeat(32), '0x0'] as unknown as {
          r: BytesLike;
          s: BytesLike;
          v: BigNumberish;
        }
      );
    const identityResult = await identityCreationTx.wait();
    console.log(
      `identityResult tx: ${identityResult.id}. Gas used: ${identityResult.gasUsed}`
    );
    totalGas += identityResult.getTransactionReceipt().gasUsed;
  }

  const identityAddress = await provenance.connect(deployer).getIdentity();

  console.log('identityAddress is', identityAddress);

  const identityContract = await ethers.getContract('CxipIdentity');

  const identity = identityContract.attach(identityAddress);

  const collectionCreationTx = await identity
    .connect(deployer)
    .createCustomERC721Collection(
      salt,
      deployer.address,
      [
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0',
      ] as unknown as {
        r: BytesLike;
        s: BytesLike;
        v: BigNumberish;
      },
      [
        `${utf8ToBytes32('Daniel Arsham: Eroding and Refor')}`, // Collection name
        `${utf8ToBytes32('ming Cars')}`, // Collection name 2
        `${utf8ToBytes32('ERCs')}`, // Collection symbol
        identityAddress, // royalties (address)
        '0x0000000000000000000003e8', // 1000 bps (uint96) == 10%
      ] as unknown as {
        name: BytesLike;
        name2: BytesLike;
        symbol: BytesLike;
        royalties: string;
        bps: BigNumberish;
      },
      sha256('eip1967.CxipRegistry.DanielArshamErodingAndReformingCarsProxy'), // Daniel Arsham Erosions Proxy - Registry storage slot
      danielArshamErosionsProxyBytecode // proxy contract byte code
    );

  const collectionId: number = network == 'mainnet' ? 1 : 0;

  const collectionAddress = await identity.getCollectionById(collectionId);

  console.log('collectionAddress is', collectionAddress);

  const collectionContract = await ethers.getContract(
    'DanielArshamErodingAndReformingCars'
  );

  const collection = collectionContract.attach(collectionAddress);

  // quick test for now
  const collectionName = await collection.name();
  const collectionSymbol = await collection.symbol();

  console.log(collectionName, collectionSymbol);
  // end of quick test

  let startTime = Math.floor(Date.now() / 1000);
  const rotations: Array<number> = [
    Math.round((113 * 60) / 2),
    Math.round((116 * 60) / 2),
    Math.round((103 * 60) / 2),
    Math.round((126 * 60) / 2),
  ];
  const timestampTx = await collection
    .connect(deployer)
    .setStartTimestamp('0x' + startTime.toString(16));
  const tokenSeparatorTx = await collection
    .connect(deployer)
    .setTokenSeparator(10000);
  const totalSupply: number = 50 + 100 + 100 + 150;
  const tokenLimitTx = await collection
    .connect(deployer)
    .setTokenLimit(totalSupply);
  const intervalConfigTx = await collection
    .connect(deployer)
    .setIntervalConfig([
      rotations[0],
      rotations[1],
      rotations[2],
      rotations[3],
    ]);

  let payload: BytesLike;
  const arweave: string = 'https://arweave.net/';
  const arHashes: Array<string> = [
    'k6Dej-c5ga1TkKlJ5vjxtCyY6W6Ipc2ds7gzHAZKir0',
    '3hBx7NynGoLPctHG8oS5uYKYdJNDj7A_IwTos9K-bUA',
    'tbkb5xO694ktcSTGn7WVIwm8Y_7cucgoN6bduo9kZDA',
    'KLBvdyxNunXuNhCyrDkPyEuJUA9frtKNa-bjFAEusB4',
    'veEDJpGhtGpA4bac62nyhY3HTbWDAV_bTtAkj6vi4dc',
    '_XAoDq-i3N7bwMNeNoUwCDVLvasCh46Fnhl9wKoaF88',
    'WYDKFYbl6sbJP5LENzwAIlbtH0enQx_HDde0_kD5QAE',
    'ucbj933WwVHVTQZP2yupmfEatLqoFYnWCQr1xXKbKdg',
  ];
  let arHash: BytesLike;
  const ipfsHashes: Array<string> = [
    'QmVLY9uE6quyCumNg4CqhAPh8Q8Kn4Hw5FTE6wKPMxKK9w',
    'QmYpYw7pk3pJqeLF7GNCP6QD7WjST3JK8zzG4cmDMM4RiU',
    'QmeZEHUkaXhRBUQhCVSJ3wrqjpAiGjySoeWq8aHufFX87e',
    'QmXXtXd943CP6fx2ZMgX4iPvZpzzW9a4FbpFCs1GMeeMof',
    'QmfX685GuEWkeLtPyyXm4DSRpHXXUsgAYDCEShrHY7GHej',
    'QmQpH5cm3CDCBGUEJ9Lo1aZc6afRdpy4jUbb9R7yfZLHxX',
    'QmYQWLJgq9zVMfkqUwDpGrP31jaobVqRMvgzzch9K1J25Y',
    'QmNs7Fvu81wDuWE2oG7D3SdSpDRmS5aDzFQHDGXdXzz8AU',
  ];
  let ipfsHash: BytesLike;
  let sig: any;
  let signature: { r: BytesLike; s: BytesLike; v: BigNumberish };

  // Mustang (State 1)
  arHash = arHashes[0];
  ipfsHash = ipfsHashes[0];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const mustang1 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // Mustang (State 2)
  arHash = arHashes[1];
  ipfsHash = ipfsHashes[1];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const mustang2 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // mustang
  const mustangTx = await collection
    .connect(deployer)
    .prepareMintDataBatch([2, 3], [mustang1, mustang2]);

  // DeLorean (State 1)
  arHash = arHashes[2];
  ipfsHash = ipfsHashes[2];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const delorean1 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // DeLorean (State 2)
  arHash = arHashes[3];
  ipfsHash = ipfsHashes[3];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const delorean2 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // delorean
  const deloreanTx = await collection
    .connect(deployer)
    .prepareMintDataBatch([4, 5], [delorean1, delorean2]);

  // California (State 1)
  arHash = arHashes[4];
  ipfsHash = ipfsHashes[4];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const california1 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // California (State 2)
  arHash = arHashes[5];
  ipfsHash = ipfsHashes[5];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const california2 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // california
  const californiaTx = await collection
    .connect(deployer)
    .prepareMintDataBatch([6, 7], [california1, california2]);

  // E30 (State 1)
  arHash = arHashes[6];
  ipfsHash = ipfsHashes[6];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const e301 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // E30 (State 2)
  arHash = arHashes[7];
  ipfsHash = ipfsHashes[7];
  payload = sha256(
    (
      await axios.get('http://arweave.net/' + arHash, {
        transformResponse: (r) => r,
      })
    ).data
  );
  sig = await deployer.signMessage(payload);
  signature = {
    r: '0x' + sig.substring(2, 66),
    s: '0x' + sig.substring(66, 130),
    v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
  };
  const e302 = [
    payload,
    [signature.r, signature.s, signature.v],
    wallet,
    web3.utils.asciiToHex(arHash.substring(0, 32)),
    web3.utils.asciiToHex(arHash.substring(32, 43)),
    web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
    web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
  ] as unknown as {
    payloadHash: BytesLike;
    payloadSignature: { r: BytesLike; s: BytesLike; v: BigNumberish };
    creator: string;
    arweave: BytesLike;
    arweave2: BytesLike;
    ipfs: BytesLike;
    ipfs2: BytesLike;
  };

  // e30
  const e30Tx = await collection
    .connect(deployer)
    .prepareMintDataBatch([8, 9], [e301, e302]);

  const collectionCreationResult = await collectionCreationTx.wait();
  console.log(
    `collectionCreation tx: ${collectionCreationResult.id}. Gas used: ${collectionCreationResult.gasUsed}`
  );
  totalGas += collectionCreationResult.getTransactionReceipt().gasUsed;

  // pushed these to the end to avoid blocking
  const timestampResult = await timestampTx.wait();
  console.log(
    `timestampResult tx: ${timestampResult.id}. Gas used: ${timestampResult.gasUsed}`
  );
  totalGas += timestampResult.getTransactionReceipt().gasUsed;

  const tokenSeparatorResult = await tokenSeparatorTx.wait();
  console.log(
    `tokenSeparatorResult tx: ${tokenSeparatorResult.id}. Gas used: ${tokenSeparatorResult.gasUsed}`
  );
  totalGas += tokenSeparatorResult.getTransactionReceipt().gasUsed;

  const tokenLimitResult = await tokenLimitTx.wait();
  console.log(
    `tokenLimitResult tx: ${tokenLimitResult.id}. Gas used: ${tokenLimitResult.gasUsed}`
  );
  totalGas += tokenLimitResult.getTransactionReceipt().gasUsed;

  const intervalConfigResult = await intervalConfigTx.wait();
  console.log(
    `intervalConfigResult tx: ${intervalConfigResult.id}. Gas used: ${intervalConfigResult.gasUsed}`
  );
  totalGas += intervalConfigResult.getTransactionReceipt().gasUsed;

  const mustangResult = await mustangTx.wait();
  console.log(
    `mustangResult tx: ${mustangResult.id}. Gas used: ${mustangResult.gasUsed}`
  );
  totalGas += mustangResult.getTransactionReceipt().gasUsed;

  const deloreanResult = await deloreanTx.wait();
  console.log(
    `deloreanResult tx: ${deloreanResult.id}. Gas used: ${deloreanResult.gasUsed}`
  );
  totalGas += deloreanResult.getTransactionReceipt().gasUsed;

  const californiaResult = await californiaTx.wait();
  console.log(
    `californiaResult tx: ${californiaResult.id}. Gas used: ${californiaResult.gasUsed}`
  );
  totalGas += californiaResult.getTransactionReceipt().gasUsed;

  const e30Result = await e30Tx.wait();
  console.log(
    `e30Result tx: ${californiaResult.id}. Gas used: ${e30Result.gasUsed}`
  );
  totalGas += e30Result.getTransactionReceipt().gasUsed;

  console.log('collectionCreation', collectionCreationResult);
  console.log('timestamp', timestampResult);
  console.log('tokenSeparator', tokenSeparatorResult);
  console.log('tokenLimit', tokenLimitResult);
  console.log('intervalConfig', intervalConfigResult);

  console.log('mustang', mustangResult);
  console.log('delorean', deloreanResult);
  console.log('california', californiaResult);
  console.log('e30', e30Result);

  const niftygateway = '0xE052113bd7D7700d623414a0a4585BCaE754E9d5';

  // mustang #50
  await collection.connect(deployer).batchMint(wallet, 10001, 50, niftygateway);

  // delorean #100
  await collection.connect(deployer).batchMint(wallet, 20001, 50, niftygateway);
  await collection.connect(deployer).batchMint(wallet, 20051, 50, niftygateway);

  // california #100
  await collection.connect(deployer).batchMint(wallet, 30001, 50, niftygateway);
  await collection.connect(deployer).batchMint(wallet, 30051, 50, niftygateway);

  // e30 #150
  await collection.connect(deployer).batchMint(wallet, 40001, 50, niftygateway);
  await collection.connect(deployer).batchMint(wallet, 40051, 50, niftygateway);
  await collection.connect(deployer).batchMint(wallet, 40101, 50, niftygateway);

  await collection.connect(deployer).setMintingClosed();
*/
};

export default func;
func.tags = []; // ['ArshamMint'];
func.dependencies = ['CxipRegistry'];
