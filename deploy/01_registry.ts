module.exports = async ({ getNamedAccounts, deployments }: any) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('CxipRegistry', {
    from: deployer,
    args: [],
    log: true,
  });
};
module.exports.tags = ['CxipRegistry'];
module.exports.dependencies = ['CxipFactory'];
