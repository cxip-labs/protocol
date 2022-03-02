module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deployer } = await getNamedAccounts();

  const error = function (err) {
    console.log(err);
    process.exit();
  };

  // Get the registry contract and set the required contract addresses
  const registry = await ethers.getContract('CxipRegistry');

  // Asset
  const asset = await ethers.getContract('CxipAsset');
  const assetTx = await registry.setAssetSource(asset.address).catch(error);

  console.log('Transaction hash :', assetTx.hash);
  await assetTx.wait();
  console.log(`Registered asset to: ${await registry.getAssetSource()}`);

  // Asset Proxy
  const assetProxy = await ethers.getContract('CxipAssetProxy');
  const assetProxyTx = await registry
    .setAssetSource(assetProxy.address)
    .catch(error);

  console.log('Transaction hash :', assetProxyTx.hash);
  await assetProxyTx.wait();
  console.log(`Registered asset proxy to: ${await registry.getAsset()}`);

  // ERC721
  const erc721 = await ethers.getContract('CxipERC721');
  const erc721Tx = await registry
    .setERC721CollectionSource(erc721.address)
    .catch(error);

  console.log('Transaction hash :', erc721Tx.hash);
  await erc721Tx.wait();
  console.log(
    `Registered erc721 to: ${await registry.getERC721CollectionSource()}`
  );

  // Identity
  const identity = await ethers.getContract('CxipIdentity');
  const identityTx = await registry
    .setIdentitySource(identity.address)
    .catch(error);

  console.log('Transaction hash :', identityTx.hash);
  await identityTx.wait();
  console.log(`Registered identity to: ${await registry.getIdentitySource()}`);

  // Provenance
  const provenance = await ethers.getContract('CxipProvenance');
  const provenanceTx = await registry
    .setProvenanceSource(provenance.address)
    .catch(error);

  console.log('Transaction hash :', provenanceTx.hash);
  await provenanceTx.wait();
  console.log(
    `Registered provenance to: ${await registry.getProvenanceSource()}`
  );

  // Provenance Proxy
  const provenanceProxy = await ethers.getContract('CxipProvenance');
  const provenanceProxyTx = await registry
    .setProvenance(provenanceProxy.address)
    .catch(error);

  console.log('Transaction hash :', provenanceProxyTx.hash);
  await provenanceProxyTx.wait();
  console.log(
    `Registered provenance proxy to: ${await registry.getProvenance()}`
  );

  // PA1D (Royalties)
  const royalties = await ethers.getContract('PA1D');
  const royaltiesTx = await registry.setPA1D(royalties.address).catch(error);

  console.log('Transaction hash :', royaltiesTx.hash);
  await royaltiesTx.wait();
  console.log(`Registered PA1D to: ${await registry.getPA1D()}`);

  // Asset Signer
  const signerTx = await registry.setAssetSigner(deployer);

  console.log('Transaction hash :', signerTx.hash);
  await signerTx.wait();
  console.log(`Registered asset signer to: ${await registry.getAssetSigner()}`);
};

module.exports.tags = ['Register'];
module.exports.dependencies = ['CxipRegistry'];
