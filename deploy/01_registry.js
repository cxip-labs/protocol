const hre = require('hardhat');

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const fs = require('fs');
  const buildDir = './src';
  const deployDir = './contracts';
  const buildConfig = JSON.parse(
    fs.readFileSync('./config/build.config.json', 'utf8')
  );

  const network = hre.network.name;
  const config = JSON.parse(
    fs.readFileSync('./config/' + network + '.config.json', 'utf8')
  );

  const cxipRegistry = await deploy('CxipRegistry', {
    from: deployer,
    args: [],
    log: true,
  });

  // Verify Registry
  try {
    await hre.run('verify:verify', {
      address: cxipRegistry.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Registry ${error}`);
  }

  /**
   * These next few lines are a hack to inject the correct registry address and bytecode params into the build config
   */
  config.registry = cxipRegistry.address;

  const cxipIdentityProxy = await deploy('CxipIdentityProxy', {
    from: deployer,
    args: [],
    log: true,
  });
  config.identityProxyBytecode = cxipIdentityProxy.bytecode.substring(2); // remove 0x;

  const erc721Proxy = await deploy('CxipERC721Proxy', {
    from: deployer,
    args: [],
    log: true,
  });
  config.erc721ProxyBytecode = erc721Proxy.bytecode.substring(2); // remove 0x
  /**
   * End hack
   */

  // Verify Identity Proxy and ERC721 Proxy
  try {
    await hre.run('verify:verify', {
      address: cxipIdentityProxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify IdentityProxy ${error}`);
  }

  try {
    await hre.run('verify:verify', {
      address: erc721Proxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC721Proxy ${error}`);
  }

  console.log(`Config: ${JSON.stringify(config, null, 2)}`);

  // if (network === 'hardhat') {
  //   console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  //   console.log('Test network detected. Skipping code injection');
  //   console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  //   return;
  // } else {
  //   console.log('Injecting code into build contracts');
  // }

  const replaceValues = function (data) {
    Object.keys(buildConfig).forEach(function (key, index) {
      data = data.replace(new RegExp(buildConfig[key], 'gi'), config[key]);
    });
    return data;
  };

  const recursiveBuild = function (buildDir, deployDir) {
    fs.readdir(buildDir, function (err, files) {
      if (err) {
        throw err;
      }
      files.forEach(function (file) {
        fs.stat(buildDir + '/' + file, function (err, stats) {
          if (err) {
            throw err;
          }
          if (stats.isDirectory()) {
            // we go into it
            fs.mkdir(deployDir + '/' + file, function () {
              recursiveBuild(buildDir + '/' + file, deployDir + '/' + file);
            });
          } else {
            if (file.endsWith('.sol')) {
              console.log(file);
              fs.readFile(buildDir + '/' + file, 'utf8', function (err, data) {
                if (err) {
                  throw err;
                }
                fs.writeFile(
                  deployDir + '/' + file,
                  replaceValues(data),
                  function (err) {
                    if (err) {
                      throw err;
                    }
                  }
                );
              });
            }
          }
        });
      });
    });
  };

  fs.mkdir(deployDir, function () {
    recursiveBuild(buildDir, deployDir);
  });
};

module.exports.tags = ['CxipRegistry'];
module.exports.dependencies = ['CxipFactory'];
