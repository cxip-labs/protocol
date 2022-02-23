module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('CxipProvenance', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['CxipProvenance'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
