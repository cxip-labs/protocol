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
  console.log('Registry address is:', registry.address);

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
  const royaltiesTx = await registry
    .setPA1DSource(royalties.address)
    .catch(error);

  console.log('Transaction hash:', royaltiesTx.hash);
  await royaltiesTx.wait();
  console.log(`Registered PA1D to: ${await registry.getPA1DSource()}`);

  // PA1D Proxy (Royalties)
  const royaltiesProxy = await ethers.getContract('PA1DProxy');
  const royaltiesProxyTx = await registry
    .setPA1D(royaltiesProxy.address)
    .catch(error);

  console.log('Transaction hash:', royaltiesProxyTx.hash);
  await royaltiesProxyTx.wait();
  console.log(`Registered PA1DProxy to: ${await registry.getPA1D()}`);

};

export default func;
func.tags = ['Register'];
func.dependencies = ['CxipRegistry'];
