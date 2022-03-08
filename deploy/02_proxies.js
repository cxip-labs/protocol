module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const cxipAssetProxy = await deploy('CxipAssetProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  await hre.run('verify:verify', {
    address: cxipAssetProxy.address,
    constructorArguments: [],
  });

  await deploy('CxipCopyrightProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  await deploy('CxipERC721Proxy', {
    from: deployer,
    args: [],
    log: true,
  });

  await deploy('CxipERC1155Proxy', {
    from: deployer,
    args: [],
    log: true,
  });

  await deploy('CxipIdentityProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  await deploy('CxipProvenanceProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  await deploy('PA1DProxy', {
    from: deployer,
    args: [],
    log: true,
  });
};

module.exports.tags = [
  'CxipAssetProxy',
  'CxipCopyrightProxy',
  'CxipERC721Proxy',
  'CxipERC1155Proxy',
  'CxipIdentityProxy',
  'CxipProvenanceProxy',
  'PA1DProxy',
];
module.exports.dependencies = ['CxipRegistry'];
