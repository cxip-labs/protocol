module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('CxipAsset', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['CxipAsset'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
