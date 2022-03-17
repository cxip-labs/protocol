import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const asset = await deploy('CxipAsset', {
    from: deployer,
    args: [],
    log: true,
  });
  try {
    await hre.run('verify:verify', {
      address: asset.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Asset ${error}`);
  }
};
export default func;
func.tags = ['CxipAsset'];
func.dependencies = ['CxipFactory', 'CxipRegistry'];
