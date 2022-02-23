module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('CxipERC721', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['CxipERC721'];
module.exports.dependencies = ['CxipFactory', 'CxipRegistry'];
