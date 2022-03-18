import { expect } from 'chai';
import { ethers } from 'hardhat';
import { deployments } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  CxipRegistry,
  CxipAssetProxy,
  CxipCopyrightProxy,
  CxipERC721Proxy,
  CxipERC1155Proxy,
  CxipIdentityProxy,
  CxipProvenanceProxy,
  PA1DProxy,
  CxipProvenance,
  CxipIdentity,
  CxipERC721,
} from '../typechain';
import { utf8ToBytes32, ZERO_ADDRESS } from './utils';
import { BigNumberish, BytesLike } from 'ethers';

describe('CXIP', () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let registry: CxipRegistry;

  let assetProxy: CxipAssetProxy;
  let copyrightProxy: CxipCopyrightProxy;
  let erc721Proxy: CxipERC721Proxy;
  let erc1155Proxy: CxipERC1155Proxy;
  let identityProxy: CxipIdentityProxy;
  let provenanceProxy: CxipProvenanceProxy;
  let royaltiesProxy: PA1DProxy;

  let identity: CxipIdentity;
  let provenance: CxipProvenance;
  let erc721: CxipERC721;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];

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

      'Register',
    ]);
    registry = await ethers.getContract('CxipRegistry');
    assetProxy = await ethers.getContract('CxipAssetProxy');
    copyrightProxy = await ethers.getContract('CxipCopyrightProxy');
    erc721Proxy = await ethers.getContract('CxipERC721Proxy');
    erc1155Proxy = await ethers.getContract('CxipERC1155Proxy');
    identityProxy = await ethers.getContract('CxipIdentityProxy');
    provenanceProxy = await ethers.getContract('CxipProvenanceProxy');
    royaltiesProxy = await ethers.getContract('PA1DProxy');

    provenance = await ethers.getContract('CxipProvenance');
    identity = await ethers.getContract('CxipIdentity');
    erc721 = await ethers.getContract('CxipERC721');
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  describe('Collection', () => {
    it('should create a collection', async () => {
      const salt = user.address + '0x000000000000000000000000'.substring(2);

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

      const result = await i.connect(user).createERC721Collection(
        salt,
        user.address,
        [
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          '0x0',
        ] as any,
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
        }
      );

      result.wait();

      const collectionAddress = await i.getCollectionById(0);
      const collectionType = await i.getCollectionType(collectionAddress);
      const c = erc721.attach(collectionAddress);

      expect(collectionAddress).not.to.equal(ZERO_ADDRESS);
      expect(collectionType).not.to.equal(ZERO_ADDRESS);
      expect(await c.connect(user).isOwner()).to.equal(true);
      expect(await c.connect(user).owner()).to.equal(user.address);
      expect(await c.connect(user).name()).to.equal('Collection name');
      expect(await c.connect(user).symbol()).to.equal('Collection symbol');
      expect(await c.connect(user).baseURI()).to.equal(
        `https://cxip.dev/nft/${collectionAddress.toLowerCase()}`
      );
      expect(await c.connect(user).contractURI()).to.equal(
        `https://nft.cxip.dev/${collectionAddress.toLowerCase()}/`
      );
    });

    it.skip('should create a collection using a different wallet in the identity', async () => {});
  });
});
