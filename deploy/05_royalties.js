module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const pA1D = await deploy('PA1D', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['PA1D'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
