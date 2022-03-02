module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('PA1D', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['PA1D'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
