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
};
export default func;
func.tags = ['CxipAsset'];
func.dependencies = ['CxipFactory', 'CxipRegistry'];
