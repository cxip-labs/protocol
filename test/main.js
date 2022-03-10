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

  before(async () => {});

  beforeEach(async () => {
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
    pA1DProxy = await ethers.getContract('PA1DProxy');

    provenance = await ethers.getContract('CxipProvenance');
    identity = await ethers.getContract('CxipIdentity');
    erc721 = await ethers.getContract('CxipERC721');
    asset = await ethers.getContract('CxipAsset');
    royalties = await ethers.getContract('PA1D');

    // TODO: Not sure why this is needed yet
    // signerAddress = await signer.getAddress();

    // Asset
    const assetTx = await registry.setAssetSource(asset.address).catch(error);
    console.log('Transaction hash:', assetTx.hash);
    await assetTx.wait();
    console.log(`Registered asset to: ${await registry.getAssetSource()}`);

    // Asset Proxy
    const assetProxyTx = await registry
      .setAsset(assetProxy.address)
      .catch(error);
    console.log('Transaction hash:', assetProxyTx.hash);
    await assetProxyTx.wait();
    console.log(
      `Registered asset proxy to: ${await registry.getAssetSource()}`
    );

    // ERC721
    const erc721Tx = await registry
      .setERC721CollectionSource(erc721.address)
      .catch(error);
    console.log('Transaction hash:', erc721Tx.hash);
    await erc721Tx.wait();
    console.log(
      `Registered erc721 to: ${await registry.getERC721CollectionSource()}`
    );

    // Identity
    const identityTx = await registry
      .setIdentitySource(identity.address)
      .catch(error);
    console.log('Transaction hash:', identityTx.hash);
    await identityTx.wait();
    console.log(
      `Registered identity to: ${await registry.getIdentitySource()}`
    );

    // Provenance
    const provenanceTx = await registry
      .setProvenanceSource(provenance.address)
      .catch(error);
    console.log('Transaction hash:', provenanceTx.hash);
    await provenanceTx.wait();
    console.log(
      `Registered provenance to: ${await registry.getProvenanceSource()}`
    );

    // Provenance Proxy
    const provenanceProxyTx = await registry
      .setProvenance(provenanceProxy.address)
      .catch(error);
    console.log('Transaction hash:', provenanceProxyTx.hash);
    await provenanceProxyTx.wait();
    console.log(
      `Registered provenance proxy to: ${await registry.getProvenance()}`
    );

    // PA1D (Royalties)
    const royaltiesTx = await registry.setPA1D(royalties.address).catch(error);
    console.log('Transaction hash:', royaltiesTx.hash);
    await royaltiesTx.wait();
    console.log(`Registered PA1D to: ${await registry.getPA1D()}`);

    // Asset Signer
    // const signerTx = await registry.setAssetSigner(deployer);
    // console.log('Transaction hash:', signerTx.hash);
    // await signerTx.wait();
    // console.log(
    //   `Registered asset signer to: ${await registry.getAssetSigner()}`
    // );
  });

  afterEach(async () => {});

  it('run a test', async () => {
    console.log('test');
  });

  it('should check the registry', async () => {
    // TODO: Convert to ethersjs
    // const asset = await contract.methods
    //   .getAssetSource()
    //   .call(from)
    //   .catch(error);
    // const assetProxy = await contract.methods;
    //   .getAsset()
    //   .call(from)
    //   .catch(error);
    // const assetSigner = await contract.methods
    //   .getAssetSigner()
    //   .call(from)
    //   .catch(error);
    // const erc721 = await contract.methods
    //   .getERC721CollectionSource()
    //   .call(from)
    //   .catch(error);
    // const identity = await contract.methods
    //   .getIdentitySource()
    //   .call(from)
    //   .catch(error);
    // const provenance = await contract.methods
    //   .getProvenanceSource()
    //   .call(from)
    //   .catch(error);
    // const provenanceProxy = await contract.methods
    //   .getProvenance()
    //   .call(from)
    //   .catch(error);
    // const royalties = await contract.methods
    //   .getPA1DSource()
    //   .call(from)
    //   .catch(error);
    // const royaltiesProxy = await contract.methods
    //   .getPA1D()
    //   .call(from)
    //   .catch(error);
  });
});
