const { expect } = require('chai');
const { ethers } = require('hardhat');
const { deployments, getNamedAccounts } = require('hardhat');

const error = function (err) {
  console.log(err);
  process.exit();
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
    deployer = (await ethers.getSigners())[0];
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
    // console.log('Transaction hash:', signerTx.hash);
    // await signerTx.wait();
    // console.log(
    //   `Registered asset signer to: ${await registry.getAssetSigner()}`
    // );
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  it('should set and get asset source', async () => {
    const assetTx = await registry.setAssetSource(asset.address).catch(error);
    // console.log('Transaction hash:', assetTx.hash);
    await assetTx.wait();
    const assetSourceAddress = await registry.getAssetSource();
    // console.log(`Registered asset to: ${assetSourceAddress}`);

    expect(assetSourceAddress).to.equal(asset.address);
  });

  it('should set and get asset proxy', async () => {
    const assetProxyTx = await registry
      .setAsset(assetProxy.address)
      .catch(error);
    // console.log('Transaction hash:', assetProxyTx.hash);
    await assetProxyTx.wait();
    const assetProxyAddress = await registry.getAsset();
    expect(assetProxyAddress).to.equal(assetProxy.address);
  });

  it('should set and get ERC721', async () => {
    const erc721Tx = await registry
      .setERC721CollectionSource(erc721.address)
      .catch(error);
    // console.log('Transaction hash:', erc721Tx.hash);
    await erc721Tx.wait();
    const erc721Address = await registry.getERC721CollectionSource();
    // console.log(`Registered ERC721 to: ${erc721Address}`);
    expect(erc721Address).to.equal(erc721.address);
  });

  it('should set and get identity', async () => {
    const identityTx = await registry
      .setIdentitySource(identity.address)
      .catch(error);
    // console.log('Transaction hash:', identityTx.hash);
    await identityTx.wait();
    const identitySourceAddress = await registry.getIdentitySource();
    // console.log(`Registered identity to: ${identitySourceAddress}`);
    expect(identitySourceAddress).to.equal(identity.address);
  });

  it('should set and get provenance', async () => {
    const provenanceTx = await registry
      .setProvenanceSource(provenance.address)
      .catch(error);
    // console.log('Transaction hash:', provenanceTx.hash);
    await provenanceTx.wait();
    const provenanceAddress = await registry.getProvenanceSource();
    // console.log(`Registered provenance to: ${provenanceAddress}`);
    expect(provenanceAddress).to.equal(provenance.address);
  });

  it('should set and get provenance proxy', async () => {
    const provenanceProxyTx = await registry
      .setProvenance(provenanceProxy.address)
      .catch(error);
    // console.log('Transaction hash:', provenanceProxyTx.hash);
    await provenanceProxyTx.wait();
    const provenanceProxyAddress = await registry.getProvenance();
    // console.log(`Registered provenance proxy to: ${provenanceProxyAddress}`);
    expect(provenanceProxyAddress).to.equal(provenanceProxy.address);
  });

  it('should set and get royalties', async () => {
    const royaltiesTx = await registry
      .setPA1DSource(royalties.address)
      .catch(error);
    // console.log('Transaction hash:', royaltiesTx.hash);
    await royaltiesTx.wait();
    const royaltiesAddress = await registry.getPA1DSource();
    // console.log(`Registered royalties to: ${royaltiesAddress}`);
    expect(royaltiesAddress).to.equal(royalties.address);
  });

  it('should set and get royalties proxy', async () => {
    const royaltiesProxyTx = await registry
      .setPA1D(royaltiesProxy.address)
      .catch(error);
    // console.log('Transaction hash:', royaltiesProxyTx.hash);
    await royaltiesProxyTx.wait();
    const royaltiesProxyAddress = await registry.getPA1D();
    // console.log(`Registered royalties proxy to: ${royaltiesProxyAddress}`);
    expect(royaltiesProxyAddress).to.equal(royaltiesProxy.address);
  });
});
