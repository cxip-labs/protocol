import { run, ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { BigNumberish, BytesLike, ContractFactory } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { utf8ToBytes32, ZERO_ADDRESS, sha256 } from '../test/utils';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const network = hre.network.name;
  const { deployments, getNamedAccounts } = hre;
  const accounts = await ethers.getSigners();
  const deployer: SignerWithAddress = accounts[5];

  const salt: BytesLike = deployer.address + '0x000000000000000000000000'.substring(2);

  const danielArshamErosionsProxyBytecode: BytesLike = (
    (await ethers.getContractFactory(
      'DanielArshamErodingAndReformingCarsProxy'
    )) as ContractFactory
  ).bytecode;
  console.log('danielArshamErosionsProxyBytecode is:', danielArshamErosionsProxyBytecode);

  // Get the registry contract and set the required contract addresses
  const registry = await ethers.getContract('CxipRegistry');
  console.log('Registry address is:', registry.address);

  const provenanceAddress = await registry.getProvenance();
  console.log('provenanceAddress is:', provenanceAddress);

  const provenanceContract = await ethers.getContract('CxipProvenance');

  const provenance = provenanceContract.attach(provenanceAddress);

  if (network == 'hardhat') {
    // if we on localhost, we make an identity
    const identityCreationResult = await provenance.connect(deployer).createIdentity(
      salt,
      '0x' + '00'.repeat(20), // zero address
      [
        '0x' + '00'.repeat(32),
        '0x' + '00'.repeat(32),
        '0x0',
      ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
    );
    await identityCreationResult.wait();
  }

  const identityAddress = await provenance.connect(deployer).getIdentity();

  const identityContract = await ethers.getContract('CxipIdentity');

  const identity = identityContract.attach(identityAddress);

  const collectionCreationResult = await identity.connect(deployer).createCustomERC721Collection(
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

  await collectionCreationResult.wait();
  console.log('collectionCreationResult is:', collectionCreationResult);

};

export default func;
func.tags = ['ArshamMint'];
func.dependencies = ['CxipRegistry'];
