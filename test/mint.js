const { expect } = require('chai');
const { ethers } = require('hardhat');
const hre = require('hardhat');
const { deployments, getNamedAccounts } = require('hardhat');

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const error = function (err) {
  console.log(err);
  process.exit();
};

const remove0x = function (input) {
  if (input.startsWith('0x')) {
    return input.substring(2);
  } else {
    return input;
  }
};

describe('CXIP', () => {
  let deployer;

  let registry;

  let assetProxy;
  let copyrightProxy;
  let erc721Proxy;
  let erc1155Proxy;
  let identityProxy;
  let provenanceProxy;
  let royaltiesProxy;

  let asset;
  let assetSigner;
  let erc721;
  let identity;
  let provenance;
  let royalties;
  let factory;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    user2 = accounts[2];
    user3 = accounts[3];
    const {
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
      CxipERC1155,
      CxipCopyright,
      CxipAsset,
      PA1D,
    } = await deployments.fixture([
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
    asset = await ethers.getContract('CxipAsset');
    royalties = await ethers.getContract('PA1D');

    // TODO: Not sure why this is needed yet
    // signerAddress = await signer.getAddress();

    // Asset Signer
    // const signerTx = await registry.setAssetSigner(deployer);
    // await signerTx.wait();
    // console.log(
    //   `Registered asset signer to: ${await registry.getAssetSigner()}`
    // );
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  describe('Registry', () => {
    it('should set and get asset source', async () => {
      const assetTx = await registry.setAssetSource(asset.address).catch(error);
      await assetTx.wait();
      const assetSourceAddress = await registry.getAssetSource();

      expect(assetSourceAddress).to.equal(asset.address);
    });

    it('should set and get asset proxy', async () => {
      const assetProxyTx = await registry
        .setAsset(assetProxy.address)
        .catch(error);
      await assetProxyTx.wait();
      const assetProxyAddress = await registry.getAsset();
      expect(assetProxyAddress).to.equal(assetProxy.address);
    });

    it('should set and get ERC721', async () => {
      const erc721Tx = await registry
        .setERC721CollectionSource(erc721.address)
        .catch(error);
      await erc721Tx.wait();
      const erc721Address = await registry.getERC721CollectionSource();
      expect(erc721Address).to.equal(erc721.address);
    });

    it('should set and get identity', async () => {
      const identityTx = await registry
        .setIdentitySource(identity.address)
        .catch(error);
      await identityTx.wait();
      const identitySourceAddress = await registry.getIdentitySource();
      expect(identitySourceAddress).to.equal(identity.address);
    });

    it('should set and get provenance', async () => {
      const provenanceTx = await registry
        .setProvenanceSource(provenance.address)
        .catch(error);
      await provenanceTx.wait();
      const provenanceAddress = await registry.getProvenanceSource();
      expect(provenanceAddress).to.equal(provenance.address);
    });

    it('should set and get provenance proxy', async () => {
      const provenanceProxyTx = await registry
        .setProvenance(provenanceProxy.address)
        .catch(error);
      await provenanceProxyTx.wait();
      const provenanceProxyAddress = await registry.getProvenance();
      expect(provenanceProxyAddress).to.equal(provenanceProxy.address);
    });

    it('should set and get royalties', async () => {
      const royaltiesTx = await registry
        .setPA1DSource(royalties.address)
        .catch(error);
      await royaltiesTx.wait();
      const royaltiesAddress = await registry.getPA1DSource();
      expect(royaltiesAddress).to.equal(royalties.address);
    });

    it('should set and get royalties proxy', async () => {
      const royaltiesProxyTx = await registry
        .setPA1D(royaltiesProxy.address)
        .catch(error);
      await royaltiesProxyTx.wait();
      const royaltiesProxyAddress = await registry.getPA1D();
      expect(royaltiesProxyAddress).to.equal(royaltiesProxy.address);
    });
  });

  describe('Identity', () => {
    it('should create an identity', async () => {
      const salt = deployer.address + '0x000000000000000000000000'.substring(2);
      const tx = await provenance.createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0',
        ]
      );

      const receipt = await tx.wait();
      const events = receipt.events.filter((x) => {
        return x.event == 'IdentityCreated';
      });

      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);
      expect(identityAddress).to.equal(events[0].args[0]);
      expect(identityAddress).to.equal(events[0].args.identityAddress);
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
          ]
        )
      ).to.be.revertedWith('CXIP: wallet already used');
    });

    it('should create an identity with a secondary wallet', async () => {});

    it('should be a valid identity', async () => {
      const salt = user.address + '0x000000000000000000000000'.substring(2);
      const tx = await await provenance.connect(user).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user.address.substring(2)}`,
          `0x000000000000000000000000${user.address.substring(2)}`,
          '0x0',
        ]
      );

      const receipt = await tx.wait();
      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);

      const isValid = await provenance.isIdentityValid(identityAddress);
      expect(isValid).to.equal(true);
    });

    it('should not be a blacklisted identity', async () => {
      const salt = user2.address + '0x000000000000000000000000'.substring(2);
      const tx = await await provenance.connect(user2).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user2.address.substring(2)}`,
          `0x000000000000000000000000${user2.address.substring(2)}`,
          '0x0',
        ]
      );

      const receipt = await tx.wait();
      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);

      const isValid = await provenance.isIdentityBlacklisted(identityAddress);
      expect(isValid).to.equal(false);
    });
  });

  describe('Collection', () => {
    it('should create a collection', async () => {
      // Create collection for identity user3
      const salt = user.address + '0x000000000000000000000000'.substring(2);
      const result = await identity.connect(user).createERC721Collection(
        salt,
        user.address,
        [
          `0x000000000000000000000000${user.address.substring(2)}`,
          `0x000000000000000000000000${user.address.substring(2)}`,
          '0x0',
        ],
        [
          // NOTE: ethers.utils.formatBytes32String('Collection name') is not working
          // because it outputs 0x436f6c6c656374696f6e206e616d650000000000000000000000000000000000
          // which is right padded instead of left padded
          '0x0000000000000000000000000000000000436f6c6c656374696f6e206e616d65', // Collection name
          '0x0000000000000000000000000000000000000000000000000000000000000000', // Collection name 2
          '0x000000000000000000000000000000436f6c6c656374696f6e2073796d626f6c', // Collection symbol
          user.address, // royalties (address)
          '0x0000000000000000000003e8', // 1000 bps (uint96)
        ]
      );
    });

    it('should create a collection using a different wallet in the identity', async () => {
      // TODO: Come back to this and use signatures for second address
    });
  });
});
