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
import { BigNumberish, BytesLike } from 'ethers';

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
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
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
        }
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
        });

      try {
        await nftTx.wait();
      } catch (error: any) {
        throw new Error(error);
      }

      const c = erc721.attach(collectionAddress);
      expect(await c.connect(user).payloadHash(tokenId)).to.equal(payload);
      expect(await c.connect(user).payloadSigner(tokenId)).to.equal(
        user.address
      );
      expect(await c.connect(user).arweaveURI(tokenId)).to.equal(
        `https://arweave.cxip.dev/${arHash}`
      );
      expect(await c.connect(user).tokenURI(tokenId)).to.equal(
        `https://arweave.cxip.dev/${arHash}`
      );
      expect(await c.connect(user).ipfsURI(tokenId)).to.equal(
        `https://ipfs.cxip.dev/${ipfsHash}`
      );
      expect(await c.connect(user).httpURI(tokenId)).to.equal(
        `https://cxip.dev/nft/${collectionAddress.toLowerCase()}/0x${tokenId.slice(
          -2
        )}`
      );

      const r = royalties.attach(collectionAddress);

      // Check unset royalties (only one benificiary is set in the royalties array)
      let royaltiesData = await r.connect(user).getRoyalties(tokenId);

      expect(royaltiesData[0][0]).to.equal(ZERO_ADDRESS);
      expect(ethers.utils.formatUnits(royaltiesData[0][0], 18)).to.equal('0.0');

      // Set royalties to 10000 bps (100%)
      await r.connect(user).setRoyalties(tokenId, user.address, 10000);

      // Check again after setting
      royaltiesData = await r.connect(user).getRoyalties(tokenId);
      expect(royaltiesData[0][0]).to.equal(user.address);

      // TODO: Need to figure out how to properly convert the units proper format
      // Currently getting set to a very large floating point number with this utility function
      // console.log(ethers.utils.formatUnits(royaltiesData[0][0], 18));
      // expect(ethers.utils.formatUnits(royaltiesData[0][0], 18)).to.equal('0.0');
    });
  });
});
