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
      'DanielArshamErosionsProxy'
    )) as DanielArshamErosionsProxy;
    danielArshamErosions = await ethers.getContract('DanielArshamErosions');
    danielArshamErosionsProxy = (await ethers.getContract(
      'DanielArshamErosionsProxy'
    )) as DanielArshamErosionsProxy;

    danielArshamErosionsProxyBytecode = (
      (await ethers.getContractFactory(
        'DanielArshamErosionsProxy'
      )) as ContractFactory
    ).bytecode;
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

      // Finally create a new ERC721 NFT in the collection
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
        ] as unknown as {
          r: BytesLike;
          s: BytesLike;
          v: BigNumberish
        },
        [
          `${utf8ToBytes32('Eroding and Reforming Cars')}`, // Collection name
          '0x0000000000000000000000000000000000000000000000000000000000000000', // Collection name 2
          `${utf8ToBytes32('ERCs')}`, // Collection symbol
          user4.address, // royalties (address)
          '0x0000000000000000000003e8', // 1000 bps (uint96)
        ] as unknown as {
          name: BytesLike;
          name2: BytesLike;
          symbol: BytesLike;
          royalties: string;
          bps: BigNumberish;
        },
        '0x34614b2160c4ad0a9004a062b1210e491f551c3b3eb86397949dc0279cf60c0d', // Daniel Arsham Erosions Proxy - Registry storage slot
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

      assert.isNotOk(collectionName != 'Eroding and Reforming Cars', 'Collection name missmatch, we want "Eroding and Reforming Cars", but got "' + collectionName + '" instead.');
      assert.isNotOk(collectionSymbol != 'ERCs', 'Collection symbol missmatch, we want "ERCs", but got "' + collectionSymbol + '" instead.');

      await c.connect(user4).setStartTimestamp('0x' + Date.now().toString(16));
      await c.connect(user4).setTokenSeparator(10000);
      await c.connect(user4).setTokenLimit(50 + 100 + 100 + 150);
      await c.connect(user4).setIntervalConfig([113 * 60, 116 * 60, 103 * 60, 126 * 60]);

      const wallet = user4.address;
      let payload: BytesLike;
      let arHash: BytesLike;
      let ipfsHash: BytesLike;
      let sig: any;
      let signature: { r: BytesLike; s: BytesLike; v: BigNumberish };

      // Mustang (State 1)
      arHash = 'k6Dej-c5ga1TkKlJ5vjxtCyY6W6Ipc2ds7gzHAZKir0';
      ipfsHash = 'QmVLY9uE6quyCumNg4CqhAPh8Q8Kn4Hw5FTE6wKPMxKK9w';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      arHash = '3hBx7NynGoLPctHG8oS5uYKYdJNDj7A_IwTos9K-bUA';
      ipfsHash = 'QmYpYw7pk3pJqeLF7GNCP6QD7WjST3JK8zzG4cmDMM4RiU';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      const mustangTx = await c.connect(user4).prepareMintDataBatch([2, 3], [mustang1, mustang2]);

      await mustangTx.wait();


      // DeLorean (State 1)
      arHash = 'tbkb5xO694ktcSTGn7WVIwm8Y_7cucgoN6bduo9kZDA';
      ipfsHash = 'QmeZEHUkaXhRBUQhCVSJ3wrqjpAiGjySoeWq8aHufFX87e';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      arHash = 'KLBvdyxNunXuNhCyrDkPyEuJUA9frtKNa-bjFAEusB4';
      ipfsHash = 'QmXXtXd943CP6fx2ZMgX4iPvZpzzW9a4FbpFCs1GMeeMof';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      const deloreanTx = await c.connect(user4).prepareMintDataBatch([4, 5], [delorean1, delorean2]);

      await deloreanTx.wait();


      // California (State 1)
      arHash = 'veEDJpGhtGpA4bac62nyhY3HTbWDAV_bTtAkj6vi4dc';
      ipfsHash = 'QmfX685GuEWkeLtPyyXm4DSRpHXXUsgAYDCEShrHY7GHej';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      arHash = '_XAoDq-i3N7bwMNeNoUwCDVLvasCh46Fnhl9wKoaF88';
      ipfsHash = 'QmQpH5cm3CDCBGUEJ9Lo1aZc6afRdpy4jUbb9R7yfZLHxX';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      const californiaTx = await c.connect(user4).prepareMintDataBatch([6, 7], [california1, california2]);

      await californiaTx.wait();


      // E30 (State 1)
      arHash = 'WYDKFYbl6sbJP5LENzwAIlbtH0enQx_HDde0_kD5QAE';
      ipfsHash = 'QmYQWLJgq9zVMfkqUwDpGrP31jaobVqRMvgzzch9K1J25Y';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      arHash = 'ucbj933WwVHVTQZP2yupmfEatLqoFYnWCQr1xXKbKdg';
      ipfsHash = 'QmNs7Fvu81wDuWE2oG7D3SdSpDRmS5aDzFQHDGXdXzz8AU';
      payload = '0x' + '00'.repeat(32);
      sig = await user3.signMessage(payload);
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
      const e30Tx = await c.connect(user4).prepareMintDataBatch([8, 9], [e301, e302]);

      await e30Tx.wait();

      // mustang #50
      await c.connect(user4).batchMint(wallet, 10001, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');

      // delorean #100
      await c.connect(user4).batchMint(wallet, 20001, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');
      await c.connect(user4).batchMint(wallet, 20051, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');

      // california #100
      await c.connect(user4).batchMint(wallet, 30001, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');
      await c.connect(user4).batchMint(wallet, 30051, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');

      // e30 #150
      await c.connect(user4).batchMint(wallet, 40001, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');
      await c.connect(user4).batchMint(wallet, 40051, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');
      await c.connect(user4).batchMint(wallet, 40101, 50, '0xE052113bd7D7700d623414a0a4585BCaE754E9d5');

      await c.connect(user4).setMintingClosed();
/*
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
*/
    });
  });
});
