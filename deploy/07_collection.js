module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const identity = await deploy('CxipERC721', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['CxipERC721'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
