module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const cxipAssetProxy = await deploy('CxipAssetProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  const cxipCopyrightProxy = await deploy('CxipCopyrightProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  const cxipERC1155Proxy = await deploy('CxipERC1155Proxy', {
    from: deployer,
    args: [],
    log: true,
  });

  // NOTE: These are disabled here because they need to be deployed in the registry script so their bytecode can be injected
  // with the correct registry address

  // const cxipERC721Proxy = await deploy('CxipERC721Proxy', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });

  // const cxipIdentityProxy = await deploy('CxipIdentityProxy', {
  //   from: deployer,
  //   args: [],
  //   log: true,
  // });

  const cxipProvenanceProxy = await deploy('CxipProvenanceProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  const pA1DProxy = await deploy('PA1DProxy', {
    from: deployer,
    args: [],
    log: true,
  });

  // Verify
  try {
    await hre.run('verify:verify', {
      address: cxipAssetProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify AssetProxy ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipCopyrightProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify CopyrightProxy ${error}`);
  }
  // try {
  //   await hre.run('verify:verify', {
  //     address: cxipERC721Proxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (error) {
  //   console.error(`Failed to verify ERC721Proxy ${error}`);
  // }
  try {
    await hre.run('verify:verify', {
      address: cxipERC1155Proxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC1155Proxy ${error}`);
  }
  // try {
  //   await hre.run('verify:verify', {
  //     address: cxipIdentityProxy.address,
  //     constructorArguments: [],
  //   });
  // } catch (error) {
  //   console.error(`Failed to verify IdentityProxy ${error}`);
  // }
  try {
    await hre.run('verify:verify', {
      address: cxipProvenanceProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ProvenanceProxy ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: pA1DProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify PA1DProxy ${error}`);
  }

  try {
    await hre.run('verify:verify', {
      address: pA1DProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify PA1DProxy ${error}`);
  }
};

module.exports.tags = [
  'CxipAssetProxy',
  'CxipCopyrightProxy',
  // 'CxipERC721Proxy',
  'CxipERC1155Proxy',
  // 'CxipIdentityProxy',
  'CxipProvenanceProxy',
  'PA1DProxy',
];
module.exports.dependencies = ['CxipRegistry'];
