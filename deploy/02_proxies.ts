import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const cxipERC1155Proxy = await deploy('CxipERC1155Proxy', {
    from: deployer,
    args: [],
    log: true,
  });

  // NOTE: These are disabled here because they need to be deployed in the registry script so their bytecode can be injected
  // with the correct registry address

  // const cxipERC721Proxy = await deploy('CxipERC721Proxy', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });

  const cxipProvenanceProxy = await deploy('CxipProvenanceProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  const pA1DProxy = await deploy('PA1DProxy', {
    from: deployer,
    args: [],
    log: true,
  });
};

export default func;
func.tags = [
  // 'CxipERC721Proxy',
  'CxipERC1155Proxy',
  'CxipProvenanceProxy',
  'PA1DProxy',
];
func.dependencies = ['CxipRegistry'];
