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

  await deploy('CxipRegistry', {
    from: deployer,
    args: [],
    log: true,
  });

  // This is a bit of a hack to inject the correct registry address and bytecode params into the build config.
  const cxipRegistry = await ethers.getContract('CxipRegistry');
  config.registry = cxipRegistry.address;
  const cxipIdentityProxy = await hre.deployments.getArtifact(
    'CxipIdentityProxy'
  );
  config.identityProxyBytecode = cxipIdentityProxy.bytecode.substring(2); // remove 0x;

  const erc721Proxy = await hre.deployments.getArtifact('CxipERC721Proxy');
  config.erc721ProxyBytecode = erc721Proxy.bytecode.substring(2); // remove 0x

  console.log(`Config: ${JSON.stringify(config, null, 2)}`);

  if (network === 'hardhat') {
    console.warn(
      '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
    );
    console.log('Test network detected. Skipping code injection');
    console.log(
      '++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++'
    );
    return;
  }

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
