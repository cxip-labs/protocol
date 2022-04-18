import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
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

  /**
   * These next few lines are a hack to inject the correct registry address and bytecode params into the build config
   */
  config.registry = cxipRegistry.address;

  const cxipIdentityProxy = await deploy('CxipIdentityProxy', {
    from: deployer,
    args: [],
    log: true,
  });
  config.identityProxyBytecode = cxipIdentityProxy?.bytecode?.substring(2); // remove 0x;

  const erc721Proxy = await deploy('CxipERC721Proxy', {
    from: deployer,
    args: [],
    log: true,
  });
  config.erc721ProxyBytecode = erc721Proxy?.bytecode?.substring(2); // remove 0x
  /**
   * End hack
   */

  // console.log(`Config: ${JSON.stringify(config, null, 2)}`);

  // TODO: It turns out we also need to inject the proper registry and bytecode to run tests locally
  // Need to figure out best way to manage to keep dev address and bytecode in sync when on live networks
  // For now we allow variable / changing of the registry and bytecode on develop branch, but not on live networks
  // if (network === 'hardhat') {
  //   console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  //   console.log('Test network detected. Skipping code injection');
  //   console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
  //   return;
  // } else {
  //   console.log('Injecting code into build contracts');
  // }

  const replaceValues = function (data: any) {
    Object.keys(buildConfig).forEach(function (key, index) {
      data = data.replace(new RegExp(buildConfig[key], 'gi'), config[key]);
    });
    return data;
  };

  const recursiveBuild = function (buildDir: any, deployDir: any) {
    fs.readdir(buildDir, function (err: any, files: any) {
      if (err) {
        throw err;
      }
      files.forEach(function (file: any) {
        fs.stat(buildDir + '/' + file, function (err: any, stats: any) {
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
              // console.log(file);
              fs.readFile(
                buildDir + '/' + file,
                'utf8',
                function (err: any, data: any) {
                  if (err) {
                    throw err;
                  }
                  fs.writeFile(
                    deployDir + '/' + file,
                    replaceValues(data),
                    function (err: any) {
                      if (err) {
                        throw err;
                      }
                    }
                  );
                }
              );
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

export default func;
func.tags = ['CxipRegistry'];
func.dependencies = ['CxipFactory'];
