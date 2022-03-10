module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const provenance = await deploy('CxipProvenance', {
    from: deployer,
    args: [],
    log: true,
  });
  // try {
  //   await hre.run('verify:verify', {
  //     address: provenance.address,
  //     constructorArguments: [],
  //   });
  // } catch (error) {
  //   console.error(`Failed to verify Provenance ${error}`);
  // }
};
module.exports.tags = ['CxipProvenance'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
