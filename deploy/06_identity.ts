module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('CxipIdentity', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['CxipIdentity'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
