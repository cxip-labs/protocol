import { run, ethers } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const error = function (err: string) {
    console.log(err);
    process.exit();
  };

  // Get the registry contract and set the required contract addresses
  const registry = await ethers.getContract('CxipRegistry');

  // Asset
  const asset = await ethers.getContract('CxipAsset');
  const assetTx = await registry.setAssetSource(asset.address).catch(error);

  console.log('Transaction hash:', assetTx.hash);
  await assetTx.wait();
  console.log(`Registered asset to: ${await registry.getAssetSource()}`);

  // Asset Proxy
  const assetProxy = await ethers.getContract('CxipAssetProxy');
  const assetProxyTx = await registry
    .setAssetSource(assetProxy.address)
    .catch(error);

  console.log('Transaction hash:', assetProxyTx.hash);
  await assetProxyTx.wait();
  console.log(`Registered asset proxy to: ${await registry.getAsset()}`);

  // ERC721
  const erc721 = await ethers.getContract('CxipERC721');
  const erc721Tx = await registry
    .setERC721CollectionSource(erc721.address)
    .catch(error);

  console.log('Transaction hash:', erc721Tx.hash);
  await erc721Tx.wait();
  console.log(
    `Registered erc721 to: ${await registry.getERC721CollectionSource()}`
  );

  // Identity
  const identity = await ethers.getContract('CxipIdentity');
  const identityTx = await registry
    .setIdentitySource(identity.address)
    .catch(error);

  console.log('Transaction hash:', identityTx.hash);
  await identityTx.wait();
  console.log(`Registered identity to: ${await registry.getIdentitySource()}`);

  // Provenance
  const provenance = await ethers.getContract('CxipProvenance');
  const provenanceTx = await registry
    .setProvenanceSource(provenance.address)
    .catch(error);

  console.log('Transaction hash:', provenanceTx.hash);
  await provenanceTx.wait();
  console.log(
    `Registered provenance to: ${await registry.getProvenanceSource()}`
  );

  // Provenance Proxy
  const provenanceProxy = await ethers.getContract('CxipProvenanceProxy');
  const provenanceProxyTx = await registry
    .setProvenance(provenanceProxy.address)
    .catch(error);

  console.log('Transaction hash:', provenanceProxyTx.hash);
  await provenanceProxyTx.wait();
  console.log(
    `Registered provenance proxy to: ${await registry.getProvenance()}`
  );

  // PA1D (Royalties)
  const royalties = await ethers.getContract('PA1D');
  const royaltiesTx = await registry.setPA1DSource(royalties.address).catch(error);

  console.log('Transaction hash:', royaltiesTx.hash);
  await royaltiesTx.wait();
  console.log(`Registered PA1D to: ${await registry.getPA1DSource()}`);

  // PA1D Proxy (Royalties)
  const royaltiesProxy = await ethers.getContract('PA1DProxy');
  const royaltiesProxyTx = await registry.setPA1D(royaltiesProxy.address).catch(error);

  console.log('Transaction hash:', royaltiesProxyTx.hash);
  await royaltiesProxyTx.wait();
  console.log(`Registered PA1DProxy to: ${await registry.getPA1D()}`);

  // DanielArshamErosions (Royalties)
  const danielArshamErosions = await ethers.getContract('DanielArshamErosions');
  const danielArshamErosionsTx = await registry.setCustomSource('eip1967.CxipRegistry.DanielArshamErosions', danielArshamErosions.address).catch(error);

  console.log('Transaction hash:', danielArshamErosionsTx.hash);
  await danielArshamErosionsTx.wait();
  console.log(`Registered DanielArshamErosions to: ${await registry.getCustomSourceFromString('eip1967.CxipRegistry.DanielArshamErosions')}`);

  // DanielArshamErosions Proxy (Royalties)
  const danielArshamErosionsProxy = await ethers.getContract('DanielArshamErosionsProxy');
  const danielArshamErosionsProxyTx = await registry.setCustomSource('eip1967.CxipRegistry.DanielArshamErosionsProxy', danielArshamErosionsProxy.address).catch(error);

  console.log('Transaction hash:', danielArshamErosionsProxyTx.hash);
  await danielArshamErosionsProxyTx.wait();
  console.log(`Registered DanielArshamErosionsProxy to: ${await registry.getCustomSourceFromString('eip1967.CxipRegistry.DanielArshamErosionsProxy')}`);

  // Asset Signer
  const signerTx = await registry.setAssetSigner(deployer);

  console.log('Transaction hash:', signerTx.hash);
  await signerTx.wait();
  console.log(`Registered asset signer to: ${await registry.getAssetSigner()}`);
};

export default func;
func.tags = ['Register'];
func.dependencies = ['CxipRegistry'];
