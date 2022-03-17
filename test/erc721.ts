import { expect } from 'chai';
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
} from '../typechain';
import { utf8ToBytes32, ZERO_ADDRESS } from './utils';

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

describe('CXIP', () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;

  let provenanceProxy: CxipProvenanceProxy;
  let royaltiesProxy: PA1DProxy;

  let asset: CxipAsset;
  let erc721: CxipERC721;
  let identity: CxipIdentity;
  let provenance: CxipProvenance;
  let royalties: PA1D;

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

    provenanceProxy = (await ethers.getContract(
      'CxipProvenanceProxy'
    )) as CxipProvenanceProxy;
    royaltiesProxy = (await ethers.getContract('PA1DProxy')) as PA1DProxy;

    provenance = (await ethers.getContract('CxipProvenance')) as CxipProvenance;
    identity = (await ethers.getContract('CxipIdentity')) as CxipIdentity;
    erc721 = (await ethers.getContract('CxipERC721')) as CxipERC721;
    asset = (await ethers.getContract('CxipAsset')) as CxipAsset;
    royalties = (await ethers.getContract('PA1D')) as PA1D;
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  describe('ERC721', () => {
    it('should create a ERC721 NFT in a collection', async () => {
      // First create a new identity
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
        ] as any
      );

      const receipt = await tx.wait();
      const identityAddress = await p.connect(user).getIdentity();

      // Attach the identity implementation ABI to the newly created identity proxy
      const i = await identity.attach(identityAddress);

      // Then create the collection
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
        ] as any
      );

      result.wait();

      const collectionAddress = await i.getCollectionById(0);
      const collectionType = await i.getCollectionType(collectionAddress);
      expect(collectionAddress).not.to.equal(ZERO_ADDRESS);
      expect(collectionType).not.to.equal(ZERO_ADDRESS);

      // Finally create a new ERC721 NFT inot the collection
      const payload =
        '0x398d6a45a2c3d1145dfc3a229313e4c3b65165eb0b8b04c0fe787d0e32924775';
      const tokenId =
        '0x0000000000000000000000000000000000000000000000000000000000000001';
      const wallet = user.address;

      // This signature composition is required to send in the payload to create ERC721
      const sig = await user.signMessage(payload);
      const signature = {
        r: '0x' + sig.substring(2, 66),
        s: '0x' + sig.substring(66, 130),
        v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
      };

      // The arweave and ipfs hashes are split into two variables to pack into slots
      const arHash = 'd3dStWPKvAsticf1YqNT3FQCzT2nYlAw' + 'RVNFVlKmonc';
      const ipfsHash = 'QmX3UFC6GeqnmBbthWQhxRW6WgTmWWVd' + 'ist3TL59UbTZYx';
      const nftTx = await i
        .connect(user)
        .createERC721Token(collectionAddress, tokenId, [
          payload,
          [signature.r, signature.s, signature.v] as any,
          wallet,
          web3.utils.asciiToHex(arHash.substring(0, 32)),
          web3.utils.asciiToHex(arHash.substring(32, 43)),
          web3.utils.asciiToHex(ipfsHash.substring(0, 32)),
          web3.utils.asciiToHex(ipfsHash.substring(32, 46)),
        ] as any);

      try {
        await nftTx.wait();
      } catch (error: any) {
        throw new Error(error);
      }
    });
  });
});
