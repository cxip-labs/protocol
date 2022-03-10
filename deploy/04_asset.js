module.exports = async ({ getNamedAccounts, deployments }) => {
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
module.exports.tags = ['CxipAsset'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
