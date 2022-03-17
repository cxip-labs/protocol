import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const provenance = await deploy('CxipProvenance', {
    from: deployer,
    args: [],
    log: true,
  });
  try {
    await hre.run('verify:verify', {
      address: provenance.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Provenance ${error}`);
  }
};
export default func;
func.tags = ['CxipProvenance'];
func.dependencies = ['CxipFactory', 'CxipRegistry'];
