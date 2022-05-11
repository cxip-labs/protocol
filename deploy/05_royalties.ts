import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const pA1D = await deploy('PA1D', {
    from: deployer,
    args: [],
    log: true,
  });
};
export default func;
func.tags = ['PA1D'];
func.dependencies = ['CxipFactory', 'CxipRegistry'];
