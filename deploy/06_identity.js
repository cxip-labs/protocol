module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const identity = await deploy('CxipIdentity', {
    from: deployer,
    args: [],
    log: true,
  });
  // try {
  //   await hre.run('verify:verify', {
  //     address: identity.address,
  //     constructorArguments: [],
  //   });
  // } catch (error) {
  //   console.error(`Failed to verify Identity ${error}`);
  // }
};
module.exports.tags = ['CxipIdentity'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
