import { expect } from 'chai';
import { ethers } from 'hardhat';
import Web3 from 'web3';
import { deployments, getNamedAccounts } from 'hardhat';
import { BigNumberish, BytesLike, ContractFactory } from 'ethers';

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
  DanielArshamErosionsProxy,
  CxipProvenance,
  CxipIdentity,
  CxipERC721,
  CxipAsset,
  PA1D,
  DanielArshamErosions,
  CxipFactory,
} from '../typechain-types';
import { utf8ToBytes32, ZERO_ADDRESS } from './utils';

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

describe('CXIP', () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;

  let registry: CxipRegistry;

  let assetProxy: CxipAssetProxy;
  let copyrightProxy: CxipCopyrightProxy;
  let erc721Proxy: CxipERC721Proxy;
  let erc1155Proxy: CxipERC1155Proxy;
  let identityProxy: CxipIdentityProxy;
  let provenanceProxy: CxipProvenanceProxy;
  let royaltiesProxy: PA1DProxy;
  let danielArshamErosionsProxy: DanielArshamErosionsProxy;

  let asset: CxipAsset;
  let erc721: CxipERC721;
  let identity: CxipIdentity;
  let provenance: CxipProvenance;
  let royalties: PA1D;
  let danielArshamErosions: DanielArshamErosions;
  let danielArshamErosionsProxyBytecode: string;

  let factory: CxipFactory;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    user2 = accounts[2];
    user3 = accounts[3];
    user4 = accounts[4];

    await deployments.fixture([
      'CxipRegistry',
      'CxipAssetProxy',
      'CxipCopyrightProxy',
      'CxipERC721Proxy',
      'CxipERC1155Proxy',
      'CxipIdentityProxy',
      'CxipProvenanceProxy',
      'PA1DProxy',
      'DanielArshamErosionsProxy',

      'CxipProvenance',
      'CxipIdentity',
      'CxipERC721',
      'CxipERC1155',
      'CxipCopyright',
      'CxipAsset',
      'PA1D',
      'DanielArshamErosions',

      'Register',
    ]);
    registry = await ethers.getContract('CxipRegistry');

    copyrightProxy = await ethers.getContract('CxipCopyrightProxy');
    erc1155Proxy = await ethers.getContract('CxipERC1155Proxy');

    provenanceProxy = (await ethers.getContract(
      'CxipProvenanceProxy'
    )) as CxipProvenanceProxy;
    provenance = (await ethers.getContract('CxipProvenance')) as CxipProvenance;

    identityProxy = await ethers.getContract('CxipIdentityProxy');
    identity = await ethers.getContract('CxipIdentity');

    erc721Proxy = await ethers.getContract('CxipERC721Proxy');
    erc721 = await ethers.getContract('CxipERC721');

    assetProxy = await ethers.getContract('CxipAssetProxy');
    asset = await ethers.getContract('CxipAsset');

    royaltiesProxy = await ethers.getContract('PA1DProxy');
    royalties = await ethers.getContract('PA1D');

    danielArshamErosionsProxy = await ethers.getContract(
      'DanielArshamErosionsProxy'
    );
    danielArshamErosions = await ethers.getContract('DanielArshamErosions');

    danielArshamErosionsProxyBytecode = (
      (await ethers.getContractFactory(
        'DanielArshamErosionsProxy'
      )) as ContractFactory
    ).bytecode;
    danielArshamErosionsProxy = await ethers.getContract(
      'DanielArshamErosionsProxy'
    );
    //    assert('a' === danielArshamErosionsProxyBytecode, 'danielArshamErosionsProxyBytecode -->> ' + JSON.stringify(danielArshamErosionsProxy, null, 4));
    danielArshamErosions = await ethers.getContract('DanielArshamErosions');
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  describe('Registry', async () => {
    it('should set and get asset source', async () => {
      const assetTx = await registry.setAssetSource(asset.address);
      await assetTx.wait();
      const assetSourceAddress = await registry.getAssetSource();

      expect(assetSourceAddress).to.equal(asset.address);
    });

    it('should set and get asset proxy', async () => {
      const assetProxyTx = await registry.setAsset(assetProxy.address);

      await assetProxyTx.wait();
      const assetProxyAddress = await registry.getAsset();
      expect(assetProxyAddress).to.equal(assetProxy.address);
    });

    it('should set and get ERC721', async () => {
      const erc721Tx = await registry.setERC721CollectionSource(erc721.address);
      await erc721Tx.wait();
      const erc721Address = await registry.getERC721CollectionSource();
      expect(erc721Address).to.equal(erc721.address);
    });

    it('should set and get identity', async () => {
      const identityTx = await registry.setIdentitySource(identity.address);
      await identityTx.wait();
      const identitySourceAddress = await registry.getIdentitySource();
      expect(identitySourceAddress).to.equal(identity.address);
    });

    it('should set and get provenance', async () => {
      const provenanceTx = await registry.setProvenanceSource(
        provenance.address
      );
      await provenanceTx.wait();
      const provenanceAddress = await registry.getProvenanceSource();
      expect(provenanceAddress).to.equal(provenance.address);
    });

    it('should set and get provenance proxy', async () => {
      const provenanceProxyTx = await registry.setProvenance(
        provenanceProxy.address
      );
      await provenanceProxyTx.wait();
      const provenanceProxyAddress = await registry.getProvenance();
      expect(provenanceProxyAddress).to.equal(provenanceProxy.address);
    });

    it('should set and get royalties', async () => {
      const royaltiesTx = await registry.setPA1DSource(royalties.address);
      await royaltiesTx.wait();
      const royaltiesAddress = await registry.getPA1DSource();
      expect(royaltiesAddress).to.equal(royalties.address);
    });

    it('should set and get royalties proxy', async () => {
      const royaltiesProxyTx = await registry.setPA1D(royaltiesProxy.address);
      await royaltiesProxyTx.wait();
      const royaltiesProxyAddress = await registry.getPA1D();
      expect(royaltiesProxyAddress).to.equal(royaltiesProxy.address);
    });

    it('should set and get Daniel Arsham Erosions', async () => {
      const danielArshamErosionsTx = await registry.setCustomSource(
        '0x748042799f1a8ea5aa2ae183edddb216f96c3c6ada37066aa2ce51a56438ede7',
        danielArshamErosions.address
      );
      await danielArshamErosionsTx.wait();
      const danielArshamErosionsAddress = await registry.getCustomSource(
        '0x748042799f1a8ea5aa2ae183edddb216f96c3c6ada37066aa2ce51a56438ede7'
      );
      expect(danielArshamErosionsAddress).to.equal(
        danielArshamErosions.address
      );
    });

    it('should set and get Daniel Arsham Erosions proxy', async () => {
      const danielArshamErosionsProxyTx = await registry.setCustomSource(
        '0x34614b2160c4ad0a9004a062b1210e491f551c3b3eb86397949dc0279cf60c0d',
        danielArshamErosionsProxy.address
      );
      await danielArshamErosionsProxyTx.wait();
      const danielArshamErosionsProxyAddress = await registry.getCustomSource(
        '0x34614b2160c4ad0a9004a062b1210e491f551c3b3eb86397949dc0279cf60c0d'
      );
      expect(danielArshamErosionsProxyAddress).to.equal(
        danielArshamErosionsProxy.address
      );
    });
  });

  describe('Identity', async () => {
    it('should create an identity', async () => {
      const salt = deployer.address + '0x000000000000000000000000'.substring(2);
      const tx = await provenance.createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const events = receipt.events?.filter((x) => {
        return x.event == 'IdentityCreated';
      });

      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);
      expect(identityAddress).to.equal(events?.[0].args?.[0]);
      expect(identityAddress).to.equal(events?.[0].args?.identityAddress);
    });

    it('should not allow duplicate identities', async () => {
      const salt = deployer.address + '0x000000000000000000000000'.substring(2);

      await expect(
        provenance.createIdentity(
          salt,
          '0x' + '00'.repeat(20), // zero address
          [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0',
          ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
        )
      ).to.be.revertedWith('CXIP: wallet already used');
    });

    it.skip('should create an identity with a secondary wallet', async () => {
      // TODO: Come back to this and use signatures for second address
      // Not supported currently
    });

    it('should be a valid identity', async () => {
      const salt = user.address + '0x000000000000000000000000'.substring(2);
      const tx = await provenance.connect(user).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user.address.substring(2)}`,
          `0x000000000000000000000000${user.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);

      const isValid = await provenance.isIdentityValid(identityAddress);
      expect(isValid).to.equal(true);
    });

    it('should not be a blacklisted identity', async () => {
      const salt = user2.address + '0x000000000000000000000000'.substring(2);
      const tx = await provenance.connect(user2).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user2.address.substring(2)}`,
          `0x000000000000000000000000${user2.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);

      const isValid = await provenance.isIdentityBlacklisted(identityAddress);
      expect(isValid).to.equal(false);
    });
  });

  describe('Collection', async () => {
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

      // // Attach the identity implementation ABI to the newly created identity proxy
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

    it.skip('should create a collection using a different wallet in the identity', async () => {
      // TODO: Not supported currently
    });
  });

  describe('ERC721', async () => {
    it('should create a ERC721 NFT in a collection', async () => {
      // First create a new identity
      const salt = user3.address + '0x000000000000000000000000'.substring(2);

      // Attach the provenance implementation ABI to provenance proxy
      const p = await provenance.attach(provenanceProxy.address);
      const tx = await p.connect(user3).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user3.address.substring(2)}`,
          `0x000000000000000000000000${user3.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await p.connect(user3).getIdentity();

      // Attach the identity implementation ABI to the newly created identity proxy
      const i = await identity.attach(identityAddress);

      // Then create the collection
      const result = await i.connect(user3).createERC721Collection(
        salt,
        user3.address,
        [
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish },
        [
          `${utf8ToBytes32('Collection name')}`, // Collection name
          '0x0000000000000000000000000000000000000000000000000000000000000000', // Collection name 2
          `${utf8ToBytes32('Collection symbol')}`, // Collection symbol
          user3.address, // royalties (address)
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
      const wallet = user3.address;

      // This signature composition is required to send in the payload to create ERC721
      const sig = await user3.signMessage(payload);
      const signature = {
        r: '0x' + sig.substring(2, 66),
        s: '0x' + sig.substring(66, 130),
        v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
      };

      // The arweave and ipfs hashes are split into two variables to pack into slots
      const arHash = 'd3dStWPKvAsticf1YqNT3FQCzT2nYlAw' + 'RVNFVlKmonc';
      const ipfsHash = 'QmX3UFC6GeqnmBbthWQhxRW6WgTmWWVd' + 'ist3TL59UbTZYx';
      const nftTx = await i
        .connect(user3)
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

      await nftTx.wait();

      const c = erc721.attach(collectionAddress);
      expect(await c.connect(user3).payloadHash(tokenId)).to.equal(payload);
      expect(await c.connect(user3).payloadSigner(tokenId)).to.equal(
        user3.address
      );
      expect(await c.connect(user3).arweaveURI(tokenId)).to.equal(
        `https://arweave.cxip.dev/${arHash}`
      );
      expect(await c.connect(user3).tokenURI(tokenId)).to.equal(
        `https://arweave.cxip.dev/${arHash}`
      );
      expect(await c.connect(user3).ipfsURI(tokenId)).to.equal(
        `https://ipfs.cxip.dev/${ipfsHash}`
      );
      expect(await c.connect(user3).httpURI(tokenId)).to.equal(
        `https://cxip.dev/nft/${collectionAddress.toLowerCase()}/0x${tokenId.slice(
          -2
        )}`
      );

      const r = royalties.attach(collectionAddress);

      // Check unset royalties (only one benificiary is set in the royalties array)
      let royaltiesData = await r.connect(user3).getRoyalties(tokenId);

      expect(royaltiesData[0][0]).to.equal(ZERO_ADDRESS);
      expect(ethers.utils.formatUnits(royaltiesData[0][0], 18)).to.equal('0.0');

      // Set royalties to 10000 bps (100%)
      const royaltyBPS = 10000;
      await r.connect(user3).setRoyalties(tokenId, user3.address, royaltyBPS);

      // Check again after setting
      royaltiesData = await r.connect(user3).getRoyalties(tokenId);
      expect(royaltiesData[0][0]).to.equal(user3.address);
      expect(royaltiesData[1][0].toNumber()).to.equal(royaltyBPS);

      // Configure the royalty payout amounts and beneficiaries
      // 3000 bps (30%) to the deployer and 7000 (70%) to the user3
      await r
        .connect(user3)
        .configurePayouts([deployer.address, user3.address], [3000, 7000]);

      // Check that the payout info matches what was set in configuration
      let payoutInfo = await r.connect(user3).getPayoutInfo();
      const payoutAccounts = payoutInfo[0];
      const payoutAmounts = payoutInfo[1];
      expect(payoutAmounts[0].toNumber()).to.equal(3000);
      expect(payoutAmounts[1].toNumber()).to.equal(7000);
      expect(payoutAccounts[0]).to.equal(deployer.address);
      expect(payoutAccounts[1]).to.equal(user3.address);
    });
  });

  describe('Daniel Arsham Erosions', async () => {
    it('should create a ERC721 NFT in the Arsham collection', async () => {
      // First create a new identity
      const salt = user4.address + '0x000000000000000000000000'.substring(2);

      danielArshamErosionsProxyBytecode =
        '0x' +
        danielArshamErosionsProxyBytecode.substring(2, 176) +
        registry.address.substring(2) +
        danielArshamErosionsProxyBytecode.substring(218);

      // Attach the provenance implementation ABI to provenance proxy
      const p = await provenance.attach(provenanceProxy.address);
      const tx = await p.connect(user4).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user4.address.substring(2)}`,
          `0x000000000000000000000000${user4.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await p.connect(user4).getIdentity();

      // Attach the identity implementation ABI to the newly created identity proxy
      const i = await identity.attach(identityAddress);

      // Then create the collection
      const result = await i.connect(user4).createCustomERC721Collection(
        salt,
        user4.address,
        [
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish },
        [
          `${utf8ToBytes32('Collection name')}`, // Collection name
          '0x0000000000000000000000000000000000000000000000000000000000000000', // Collection name 2
          `${utf8ToBytes32('Collection symbol')}`, // Collection symbol
          user4.address, // royalties (address)
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
