import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;

  const cxipRegistry = await hre.ethers.getContract('CxipRegistry');
  const cxipERC721Proxy = await hre.ethers.getContract('CxipERC721Proxy');
  const cxipProvenanceProxy = await hre.ethers.getContract('CxipProvenanceProxy');
  const pA1DProxy = await hre.ethers.getContract('PA1DProxy');

  const cxipProvenance = await hre.ethers.getContract('CxipProvenance');
  const cxipERC721 = await hre.ethers.getContract('CxipERC721');
  const pA1D = await hre.ethers.getContract('PA1D');

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
      address: cxipERC721Proxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC721Proxy ${error}`);
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

  // Implementations
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
