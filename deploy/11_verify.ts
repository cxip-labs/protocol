import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;

  const cxipRegistry = await hre.ethers.getContract('CxipRegistry');
  const cxipAssetProxy = await hre.ethers.getContract('CxipAssetProxy');
  const cxipERC721Proxy = await hre.ethers.getContract('CxipERC721Proxy');
  const cxipIdentityProxy = await hre.ethers.getContract('CxipIdentityProxy');
  const cxipProvenanceProxy = await hre.ethers.getContract('CxipProvenanceProxy');
  const pA1DProxy = await hre.ethers.getContract('PA1DProxy');
  const danielArshamErosionsProxy = await hre.ethers.getContract('DanielArshamErodingAndReformingCarsProxy');

  const cxipProvenance = await hre.ethers.getContract('CxipProvenance');
  const cxipIdentity = await hre.ethers.getContract('CxipIdentity');
  const cxipERC721 = await hre.ethers.getContract('CxipERC721');
  const cxipAsset = await hre.ethers.getContract('CxipAsset');
  const pA1D = await hre.ethers.getContract('PA1D');
  const danielArshamErosions = await hre.ethers.getContract('DanielArshamErodingAndReformingCars');

  const mockErc721Receiver = await hre.ethers.getContract('MockERC721Receiver');

  // Registry
  try {
    await hre.run('verify:verify', {
      address: cxipRegistry.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Registry ${error}`);
  }

  // Proxies
  try {
    await hre.run('verify:verify', {
      address: cxipAssetProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify AssetProxy ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipERC721Proxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC721Proxy ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipIdentityProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify IdentityProxy ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipProvenanceProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ProvenanceProxy ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: pA1DProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify PA1DProxy ${error}`);
  }

  try {
    await hre.run('verify:verify', {
      address: pA1DProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify PA1DProxy ${error}`);
  }

  try {
    await hre.run('verify:verify', {
      address: danielArshamErosionsProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify DanielArshamErodingAndReformingCarsProxy ${error}`);
  }

  // Implementations
  try {
    await hre.run('verify:verify', {
      address: cxipAsset.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Asset ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipERC721.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC721 ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipIdentity.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Identity ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipProvenance.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Provenance ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: pA1D.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify PA1D ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: danielArshamErosions.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify DanielArshamErodingAndReformingCars ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: mockErc721Receiver.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify MockERC721Receiver ${error}`);
  }
};
export default func;
func.tags = ['Verify'];
func.dependencies = [];
