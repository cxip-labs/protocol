import { expect, assert } from 'chai';
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
  DanielArshamErodingAndReformingCarsProxy,
  CxipProvenance,
  CxipIdentity,
  CxipERC721,
  CxipAsset,
  PA1D,
  DanielArshamErodingAndReformingCars,
  MockERC721Receiver,
  CxipFactory,
} from '../typechain-types';
import { utf8ToBytes32, ZERO_ADDRESS, sha256 } from './utils';

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

describe('CXIP', () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;
  let user5: SignerWithAddress;
  let testWallet: SignerWithAddress;
  let testWallet2: SignerWithAddress;
  let testWallet3: SignerWithAddress;

  let niftygateway: string;

  let registry: CxipRegistry;

  let assetProxy: CxipAssetProxy;
  let copyrightProxy: CxipCopyrightProxy;
  let erc721Proxy: CxipERC721Proxy;
  let erc1155Proxy: CxipERC1155Proxy;
  let identityProxy: CxipIdentityProxy;
  let provenanceProxy: CxipProvenanceProxy;
  let royaltiesProxy: PA1DProxy;
  let danielArshamErosionsProxy: DanielArshamErodingAndReformingCarsProxy;

  let asset: CxipAsset;
  let erc721: CxipERC721;
  let identity: CxipIdentity;
  let provenance: CxipProvenance;
  let royalties: PA1D;
  let danielArshamErosions: DanielArshamErodingAndReformingCars;
  let danielArshamErosionsProxyBytecode: string;

  let mockErc721Receiver: MockERC721Receiver;

  let factory: CxipFactory;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    user2 = accounts[2];
    user3 = accounts[3];
    user4 = accounts[4];
    user5 = accounts[5];
    testWallet = accounts[6];
    testWallet2 = accounts[7];
    testWallet3 = accounts[8];
    niftygateway = testWallet.address;

    await deployments.fixture([
      'CxipRegistry',
      'CxipAssetProxy',
      'CxipCopyrightProxy',
      'CxipERC721Proxy',
      'CxipERC1155Proxy',
      'CxipIdentityProxy',
      'CxipProvenanceProxy',
      'PA1DProxy',
      'DanielArshamErodingAndReformingCarsProxy',

      'CxipProvenance',
      'CxipIdentity',
      'CxipERC721',
      'CxipERC1155',
      'CxipCopyright',
      'CxipAsset',
      'PA1D',
      'DanielArshamErodingAndReformingCars',

      'MockERC721Receiver',

      'Register',
    ]);
    registry = (await ethers.getContract('CxipRegistry')) as CxipRegistry;

    copyrightProxy = (await ethers.getContract(
      'CxipCopyrightProxy'
    )) as CxipCopyrightProxy;
    erc1155Proxy = (await ethers.getContract(
      'CxipERC1155Proxy'
    )) as CxipERC1155Proxy;

    provenanceProxy = (await ethers.getContract(
      'CxipProvenanceProxy'
    )) as CxipProvenanceProxy;
    provenance = (await ethers.getContract('CxipProvenance')) as CxipProvenance;

    identityProxy = (await ethers.getContract(
      'CxipIdentityProxy'
    )) as CxipIdentityProxy;
    identity = (await ethers.getContract('CxipIdentity')) as CxipIdentity;

    erc721Proxy = (await ethers.getContract(
      'CxipERC721Proxy'
    )) as CxipERC721Proxy;
    erc721 = (await ethers.getContract('CxipERC721')) as CxipERC721;

    assetProxy = (await ethers.getContract('CxipAssetProxy')) as CxipAssetProxy;
    asset = (await ethers.getContract('CxipAsset')) as CxipAsset;

    royaltiesProxy = (await ethers.getContract('PA1DProxy')) as PA1DProxy;
    royalties = (await ethers.getContract('PA1D')) as PA1D as PA1D;

    danielArshamErosionsProxy = (await ethers.getContract(
      'DanielArshamErodingAndReformingCarsProxy'
    )) as DanielArshamErodingAndReformingCarsProxy;
    danielArshamErosions = await ethers.getContract('DanielArshamErodingAndReformingCars');

    danielArshamErosionsProxyBytecode = (
      (await ethers.getContractFactory(
        'DanielArshamErodingAndReformingCarsProxy'
      )) as ContractFactory
    ).bytecode;

    mockErc721Receiver = (await ethers.getContract('MockERC721Receiver')) as MockERC721Receiver;
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
      const salt = user3.address + '0x000000000000000000000000'.substring(2);

      // Attach the provenance implementation ABI to provenance proxy
      const p = await provenance.attach(provenanceProxy.address);
      const tx = await p.connect(user3).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user.address.substring(2)}`,
          `0x000000000000000000000000${user3.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await p.connect(user3).getIdentity();

      // // Attach the identity implementation ABI to the newly created identity proxy
      const i = await identity.attach(identityAddress);

      const result = await i.connect(user3).createERC721Collection(
        salt,
        user3.address,
        [
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          '0x0',
        ] as any,
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
      const c = erc721.attach(collectionAddress);

      expect(collectionAddress).not.to.equal(ZERO_ADDRESS);
      expect(collectionType).not.to.equal(ZERO_ADDRESS);
      expect(await c.connect(user3).isOwner()).to.equal(true);
      expect(await c.connect(user3).owner()).to.equal(user3.address);
      expect(await c.connect(user3).name()).to.equal('Collection name');
      expect(await c.connect(user3).symbol()).to.equal('Collection symbol');
      expect(await c.connect(user3).baseURI()).to.equal(
        `https://cxip.dev/nft/${collectionAddress.toLowerCase()}`
      );
      expect(await c.connect(user3).contractURI()).to.equal(
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
      const salt = user4.address + '0x000000000000000000000000'.substring(2);
      const tokenId =
        '0x0000000000000000000000000000000000000000000000000000000000000001';

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
      const result = await i.connect(user4).createERC721Collection(
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
        }
      );

      result.wait();

      const collectionAddress = await i.getCollectionById(0);
      const collectionType = await i.getCollectionType(collectionAddress);
      expect(collectionAddress).not.to.equal(ZERO_ADDRESS);
      expect(collectionType).not.to.equal(ZERO_ADDRESS);

      // Finally create a new ERC721 NFT in the collection
      const payload =
        '0x398d6a45a2c3d1145dfc3a229313e4c3b65165eb0b8b04c0fe787d0e32924775';
      const wallet = user4.address;

      // This signature composition is required to send in the payload to create ERC721
      const sig = await user4.signMessage(payload);
      const signature = {
        r: '0x' + sig.substring(2, 66),
        s: '0x' + sig.substring(66, 130),
        v: '0x' + (parseInt('0x' + sig.substring(130, 132)) + 27).toString(16),
      };

      // The arweave and ipfs hashes are split into two variables to pack into slots
      const arHash = 'd3dStWPKvAsticf1YqNT3FQCzT2nYlAw' + 'RVNFVlKmonc';
      const ipfsHash = 'QmX3UFC6GeqnmBbthWQhxRW6WgTmWWVd' + 'ist3TL59UbTZYx';
      const nftTx = await i
        .connect(user4)
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
      expect(await c.connect(user4).payloadHash(tokenId)).to.equal(payload);
      expect(await c.connect(user4).payloadSigner(tokenId)).to.equal(
        user4.address
      );
      expect(await c.connect(user4).arweaveURI(tokenId)).to.equal(
        `https://arweave.cxip.dev/${arHash}`
      );
      expect(await c.connect(user4).tokenURI(tokenId)).to.equal(
        `https://arweave.cxip.dev/${arHash}`
      );
      expect(await c.connect(user4).ipfsURI(tokenId)).to.equal(
        `https://ipfs.cxip.dev/${ipfsHash}`
      );
      expect(await c.connect(user4).httpURI(tokenId)).to.equal(
        `https://cxip.dev/nft/${collectionAddress.toLowerCase()}/0x${tokenId.slice(
          -2
        )}`
      );

      const r = royalties.attach(collectionAddress);

      // Check unset royalties (only one benificiary is set in the royalties array)
      let royaltiesData = await r.connect(user4).getRoyalties(tokenId);

      expect(royaltiesData[0][0]).to.equal(ZERO_ADDRESS);
      expect(ethers.utils.formatUnits(royaltiesData[0][0], 18)).to.equal('0.0');

      // Set royalties to 10000 bps (100%)
      const royaltyBPS = 10000;
      await r.connect(user4).setRoyalties(tokenId, user4.address, royaltyBPS);

      // Check again after setting
      royaltiesData = await r.connect(user4).getRoyalties(tokenId);
      expect(royaltiesData[0][0]).to.equal(user4.address);
      expect(royaltiesData[1][0].toNumber()).to.equal(royaltyBPS);

      // Configure the royalty payout amounts and beneficiaries
      // 3000 bps (30%) to the deployer and 7000 (70%) to the user4
      await r
        .connect(user4)
        .configurePayouts([deployer.address, user4.address], [3000, 7000]);

      // Check that the payout info matches what was set in configuration
      let payoutInfo = await r.connect(user4).getPayoutInfo();
      const payoutAccounts = payoutInfo[0];
      const payoutAmounts = payoutInfo[1];
      expect(payoutAmounts[0].toNumber()).to.equal(3000);
      expect(payoutAmounts[1].toNumber()).to.equal(7000);
      expect(payoutAccounts[0]).to.equal(deployer.address);
      expect(payoutAccounts[1]).to.equal(user4.address);
    });
  });

  describe.only('Daniel Arsham: Eroding and Reforming Cars', async () => {
    const tokenId = 10001;
    const nonExistentTokenId = 0;

    // This is the custodial wallet that Nifty Gateway uses to hold all of their NFTs that they have listed on their platform.
    // const niftygateway = '0xE052113bd7D7700d623414a0a4585BCaE754E9d5';
    // we are using a test wallet in this case, to be able to do tests without access to private key
//    const niftygateway = testWallet.address;

    it('should create a ERC721 NFT in the Arsham collection', async () => {
      // First create a new identity
      const salt = user5.address + '0x000000000000000000000000'.substring(2);

      // Attach the provenance implementation ABI to provenance proxy
      const p = provenance.attach(provenanceProxy.address);
      const tx = await p.connect(user5).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user5.address.substring(2)}`,
          `0x000000000000000000000000${user5.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await p.connect(user5).getIdentity();

      // Attach the identity implementation ABI to the newly created identity proxy
      const i = identity.attach(identityAddress);

      // Then create the collection
      const result = await i.connect(user5).createCustomERC721Collection(
        salt,
        user5.address,
        [
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
          `0x0000000000000000000000000000000000000000000000000000000000000000`,
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
          user5.address, // royalties (address)
          '0x0000000000000000000003e8', // 1000 bps (uint96)
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

      result.wait();

      const collectionAddress = await i.getCollectionById(0);
      const collectionType = await i.getCollectionType(collectionAddress);
      expect(collectionAddress).not.to.equal(ZERO_ADDRESS);
      expect(collectionType).not.to.equal(ZERO_ADDRESS);

      const c = danielArshamErosions.attach(collectionAddress);
      const collectionName = await c.name();
      const collectionSymbol = await c.symbol();

      assert.isNotOk(
        collectionName != 'Daniel Arsham: Eroding and Reforming Cars',
        'Collection name missmatch, we want "Daniel Arsham: Eroding and Reforming Cars", but got "' +
          collectionName +
          '" instead.'
      );
      assert.isNotOk(
        collectionSymbol != 'ERCs',
        'Collection symbol missmatch, we want "ERCs", but got "' +
          collectionSymbol +
          '" instead.'
      );

      let startTime = Math.floor (Date.now() / 1000);
      const rotations: Array<number> = [
        Math.round((113 * 60) / 2),
        Math.round((116 * 60) / 2),
        Math.round((103 * 60) / 2),
        Math.round((126 * 60) / 2)
      ];
      await c.connect(user5).setStartTimestamp('0x' + startTime.toString(16));
      await c.connect(user5).setTokenSeparator(10000);
      const totalSupply: number = 50 + 100 + 100 + 150;
      await c.connect(user5).setTokenLimit(totalSupply);
      await c
        .connect(user5)
        .setIntervalConfig([rotations[0], rotations[1], rotations[2], rotations[3]]);

      const wallet = user5.address;
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
        'ucbj933WwVHVTQZP2yupmfEatLqoFYnWCQr1xXKbKdg'
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
        'QmNs7Fvu81wDuWE2oG7D3SdSpDRmS5aDzFQHDGXdXzz8AU'
      ];
      let ipfsHash: BytesLike;
      let sig: any;
      let signature: { r: BytesLike; s: BytesLike; v: BigNumberish };

      // Mustang (State 1)
      arHash = arHashes[0];
      ipfsHash = ipfsHashes[0];
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      const mustangTx = await c
        .connect(user5)
        .prepareMintDataBatch([2, 3], [mustang1, mustang2]);

      await mustangTx.wait();

      // DeLorean (State 1)
      arHash = arHashes[2];
      ipfsHash = ipfsHashes[2];
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      const deloreanTx = await c
        .connect(user5)
        .prepareMintDataBatch([4, 5], [delorean1, delorean2]);

      await deloreanTx.wait();

      // California (State 1)
      arHash = arHashes[4];
      ipfsHash = ipfsHashes[4];
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      const californiaTx = await c
        .connect(user5)
        .prepareMintDataBatch([6, 7], [california1, california2]);

      await californiaTx.wait();

      // E30 (State 1)
      arHash = arHashes[6];
      ipfsHash = ipfsHashes[6];
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      payload = '0x' + '00'.repeat(32);
      sig = await user5.signMessage(payload);
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
      const e30Tx = await c
        .connect(user5)
        .prepareMintDataBatch([8, 9], [e301, e302]);

      await e30Tx.wait();

      // mustang #50
      await c.connect(user5).batchMint(wallet, 10001, 50, niftygateway);

      // delorean #100
      await c.connect(user5).batchMint(wallet, 20001, 50, niftygateway);
      await c.connect(user5).batchMint(wallet, 20051, 50, niftygateway);

      // california #100
      await c.connect(user5).batchMint(wallet, 30001, 50, niftygateway);
      await c.connect(user5).batchMint(wallet, 30051, 50, niftygateway);

      // e30 #150
      await c.connect(user5).batchMint(wallet, 40001, 50, niftygateway);
      await c.connect(user5).batchMint(wallet, 40051, 50, niftygateway);
      await c.connect(user5).batchMint(wallet, 40101, 50, niftygateway);

      await c.connect(user5).setMintingClosed();

      describe('tokenURI', function () {
        context('when getting State 1 tokenURIs', function () {
          it('returns correct Arweave URI for 10001-10050', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime).toString(16));
            const firstToken = 10001;
            const lastToken = 10050;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[0]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[0]);
          });

          it('returns correct Arweave URI for 20001-20100', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime).toString(16));
            const firstToken = 20001;
            const lastToken = 20100;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[2]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[2]);
          });

          it('returns correct Arweave URI for 30001-30100', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime).toString(16));
            const firstToken = 30001;
            const lastToken = 30100;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[4]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[4]);
          });

          it('returns correct Arweave URI for 40001-40150', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime).toString(16));
            const firstToken = 40001;
            const lastToken = 40150;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[6]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[6]);
          });
        });

        context('when getting State 2 tokenURIs', function () {
          it('returns correct Arweave URI for 10001-10050', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime - rotations[0]).toString(16));
            const firstToken = 10001;
            const lastToken = 10050;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[1]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[1]);
          });

          it('returns correct Arweave URI for 20001-20100', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime - rotations[1]).toString(16));
            const firstToken = 20001;
            const lastToken = 20100;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[3]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[3]);
          });

          it('returns correct Arweave URI for 30001-30100', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime - rotations[2]).toString(16));
            const firstToken = 30001;
            const lastToken = 30100;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[5]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[5]);
          });

          it('returns correct Arweave URI for 40001-40150', async function () {
            await c.connect(user5).setStartTimestamp('0x' + (startTime - rotations[3]).toString(16));
            const firstToken = 40001;
            const lastToken = 40150;
            expect(await c.tokenURI(firstToken)).to.be.equal(arweave + arHashes[7]);
            expect(await c.tokenURI(lastToken)).to.be.equal(arweave + arHashes[7]);
          });
        });
      });

      /// ERC721 Token standard tests
      describe('balanceOf', function () {
        context('when the given address owns some tokens', function () {
          it('returns the amount of tokens owned by the given address', async function () {
            expect(await c.balanceOf(niftygateway)).to.be.equal('400');
          });
        });

        context('when the given address does not own any tokens', function () {
          it('returns 0', async function () {
            expect(await c.balanceOf(user.address)).to.be.equal('0');
          });
        });

        context('when querying the zero address', function () {
          it('throws', async function () {
            await expect(c.balanceOf(ZERO_ADDRESS)).to.be.revertedWith(
              'CXIP: zero address'
            );
          });
        });
      });

      describe('ownerOf', function () {
        context(
          'when the given token ID was tracked by this token',
          function () {
            it('returns the owner of the given token ID', async function () {
              expect(await c.ownerOf(tokenId)).to.be.equal(niftygateway);
            });
          }
        );

        context(
          'when the given token ID was not tracked by this token',
          function () {
            const tokenId = nonExistentTokenId;

            it('reverts', async function () {
              await expect(c.ownerOf(tokenId)).to.be.revertedWith(
                'ERC721: token does not exist'
              );
            });
          }
        );
      });

      describe('balanceOf', function () {
        context('get total owned tokens for wallet', function () {
          it('returns ' + totalSupply.toString() + ' for wallet', async function () {
            expect(await c.balanceOf(testWallet.address)).to.be.equal(totalSupply);
          });

          it('returns 0 for test wallet', async function () {
            expect(await c.balanceOf(testWallet2.address)).to.be.equal(0);
          });
        });
      });

      describe('tokenByIndex', function () {
        context('get token by index, within totalSupply limit', function () {
          it('returns tokenId for index 0', async function () {
            expect(await c.tokenByIndex(0)).to.be.equal(10001);
          });

          it('fails tokenId for index ' + totalSupply.toString(), async function () {
            await expect(c.tokenByIndex(totalSupply)).to.be.revertedWith('CXIP: index out of bounds');
          });
        });
      });

      describe('tokenOfOwnerByIndex', function () {
        context('get token of owner by index', function () {
          it('returns 10001 for index 0', async function () {
            expect(await c.tokenOfOwnerByIndex(testWallet.address, 0)).to.be.equal(10001);
          });

          it('fails tokenId for index ' + totalSupply.toString(), async function () {
            await expect(c.tokenOfOwnerByIndex(testWallet.address, totalSupply)).to.be.revertedWith('CXIP: index out of bounds');
          });
        });
      });

      describe('approve', function () {
        context(
          'approving address for tokenId',
          function () {
            const tokenId = 10001;
            it('returns correct wallet as approved', async function () {
              await c.connect(testWallet).approve(testWallet2.address, tokenId);
              expect(await c.getApproved(tokenId)).to.be.equal(testWallet2.address);
            });

            it('reverts for not approved wallet', async function () {
              await expect(c.connect(testWallet3)['transferFrom(address,address,uint256)'](testWallet.address, testWallet3.address, tokenId)).to.be.revertedWith(
                'CXIP: not approved sender'
              );
            });

            it('reverts for not approved tokenId transfer', async function () {
              const wrongTokendId = 10002;
              await expect(c.connect(testWallet2)['transferFrom(address,address,uint256)'](testWallet.address, testWallet3.address, wrongTokendId)).to.be.revertedWith(
                'CXIP: not approved sender'
              );
            });

            it('allows approved to transfer token', async function () {
              await c.connect(testWallet2)['transferFrom(address,address,uint256)'](testWallet.address, testWallet3.address, tokenId);
              expect(await c.ownerOf(tokenId)).to.be.equal(testWallet3.address);
            });
          }
        );
      });

      describe('approveForAll', function () {
        context(
          'approving operator for all owned tokens',
          function () {
            const tokenId = 10001;
            it('returns operator as approvedForAll', async function () {
              await c.connect(testWallet3).setApprovalForAll(testWallet2.address, true);
              expect(await c.isApprovedForAll(testWallet3.address, testWallet2.address)).to.be.equal(true);
            });

            it('reverts for not approvedForAll wallet', async function () {
              await expect(c.connect(testWallet)['transferFrom(address,address,uint256)'](testWallet3.address, testWallet.address, tokenId)).to.be.revertedWith(
                'CXIP: not approved sender'
              );
            });

            it('allows operator to transfer any owned token', async function () {
              await c.connect(testWallet2)['transferFrom(address,address,uint256)'](testWallet3.address, testWallet.address, tokenId);
              expect(await c.ownerOf(tokenId)).to.be.equal(testWallet.address);
            });
          }
        );
      });

      describe('safeTransferFrom', function () {
        context(
          'using MockErc721Receiver to test safeTransferFrom functionality',
          function () {
            const r = mockErc721Receiver.attach(mockErc721Receiver.address);
            const tokenId = 10001;

            it('reverts for safeTransferFrom on unsupported ERC721 Receiver smart contract', async function () {
              // we disable support first
              await r.toggleWorks(false);
              // we try a transfer
              await expect(c.connect(testWallet)['safeTransferFrom(address,address,uint256)'](testWallet.address, r.address, tokenId)).to.be.revertedWith(
                'CXIP: onERC721Received fail'
              );
            });

            it('succeeds for safeTransferFrom on supported ERC721 Receiver smart contract', async function () {
              // we enable support first
              await r.toggleWorks(true);
              // we try a safeTransferFrom
              await c.connect(testWallet)['safeTransferFrom(address,address,uint256)'](testWallet.address, r.address, tokenId);
              expect(await c.ownerOf(tokenId)).to.be.equal(r.address);
            });
          }
        );
      });

    });
  });
});
