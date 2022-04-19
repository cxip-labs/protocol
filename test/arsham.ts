import { expect, assert } from 'chai';
import { ethers } from 'hardhat';
import Web3 from 'web3';
import { deployments } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  CxipProvenanceProxy,
  PA1DProxy,
  CxipProvenance,
  CxipIdentity,
  CxipERC721,
  CxipAsset,
  PA1D,
  DanielArshamErosionsProxy,
  DanielArshamErosions,
} from '../typechain-types';
import { utf8ToBytes32, ZERO_ADDRESS } from './utils';
import { BigNumberish, BytesLike, ContractFactory } from 'ethers';

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

describe('CXIP - Daniel Arsham Erosions', async () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let provenanceProxy: CxipProvenanceProxy;
  let royaltiesProxy: PA1DProxy;

  let asset: CxipAsset;
  let erc721: CxipERC721;
  let identity: CxipIdentity;
  let provenance: CxipProvenance;
  let royalties: PA1D;

  let danielArshamErosionsProxy: any;
  let danielArshamErosions: DanielArshamErosions;

  let danielArshamErosionsProxyBytecode: string;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];

    const { deploy } = deployments;

    await deployments.fixture([
      'CxipRegistry',
      'CxipAssetProxy',
      'CxipCopyrightProxy',
      'CxipERC721Proxy',
      'CxipERC1155Proxy',
      'CxipIdentityProxy',
      'CxipProvenanceProxy',
      'PA1DProxy',
      'CxipProvenance',
      'CxipIdentity',
      'CxipERC721',
      'CxipERC1155',
      'CxipCopyright',
      'CxipAsset',
      'PA1D',
      'DanielArshamErosions',
      'DanielArshamErosionsProxy',

      'Register',
    ]);

    provenanceProxy = (await ethers.getContract(
      'CxipProvenanceProxy'
    )) as CxipProvenanceProxy;
    royaltiesProxy = (await ethers.getContract('PA1DProxy')) as PA1DProxy;

    provenance = (await ethers.getContract('CxipProvenance')) as CxipProvenance;
    identity = (await ethers.getContract('CxipIdentity')) as CxipIdentity;
    erc721 = (await ethers.getContract('CxipERC721')) as CxipERC721;
    asset = (await ethers.getContract('CxipAsset')) as CxipAsset;
    royalties = (await ethers.getContract('PA1D')) as PA1D;


    danielArshamErosionsProxyBytecode = ((await ethers.getContractFactory('DanielArshamErosionsProxy')) as ContractFactory).bytecode;
    danielArshamErosionsProxy = await ethers.getContract(
      'DanielArshamErosionsProxy'
    );
    danielArshamErosions = await ethers.getContract('DanielArshamErosions');
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  describe('Daniel Arsham Erosions', async () => {
    it('should create a ERC721 NFT in a collection', async () => {
      // First create a new identity
      const salt = user.address + '0x000000000000000000000000'.substring(2);

      assert('a' === danielArshamErosionsProxyBytecode, 'danielArshamErosionsProxyBytecode -->> ' + danielArshamErosionsProxyBytecode);

      // Attach the provenance implementation ABI to provenance proxy
      const p = await provenance.attach(provenanceProxy.address);
      const tx = await p.connect(user).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user.address.substring(2)}`,
          `0x000000000000000000000000${user.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await p.connect(user).getIdentity();

      // Attach the identity implementation ABI to the newly created identity proxy
      const i = await identity.attach(identityAddress);

      // Then create the collection
      const result = await i.connect(user).createCustomERC721Collection(
        salt,
        user.address,
        [
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish },
        [
          `${utf8ToBytes32('Collection name')}`, // Collection name
          '0x0000000000000000000000000000000000000000000000000000000000000000', // Collection name 2
          `${utf8ToBytes32('Collection symbol')}`, // Collection symbol
          user.address, // royalties (address)
          '0x0000000000000000000003e8', // 1000 bps (uint96)
        ] as unknown as {
          name: BytesLike;
          name2: BytesLike;
          symbol: BytesLike;
          royalties: string;
          bps: BigNumberish;
        },
        '0x34614b2160c4ad0a9004a062b1210e491f551c3b3eb86397949dc0279cf60c0d',
        danielArshamErosionsProxyBytecode
      );

      result.wait();

      const collectionAddress = await i.getCollectionById(0);
      const collectionType = await i.getCollectionType(collectionAddress);
      expect(collectionAddress).not.to.equal(ZERO_ADDRESS);
      expect(collectionType).not.to.equal(ZERO_ADDRESS);

    });
  });
});
