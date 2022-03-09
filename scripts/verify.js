const hre = require('hardhat');

async function main() {
  const cxipRegistry = await ethers.getContract('CxipRegistry');
  const cxipAssetProxy = await ethers.getContract('CxipAssetProxy');
  const cxipCopyrightProxy = await ethers.getContract('CxipCopyrightProxy');
  const cxipERC721Proxy = await ethers.getContract('CxipERC721Proxy');
  const cxipERC1155Proxy = await ethers.getContract('CxipERC1155Proxy');
  const cxipIdentityProxy = await ethers.getContract('CxipIdentityProxy');
  const cxipProvenanceProxy = await ethers.getContract('CxipProvenanceProxy');
  const pA1DProxy = await ethers.getContract('PA1DProxy');

  const cxipProvenance = await hre.deployments.getArtifact('CxipProvenance');
  const cxipIdentity = await hre.deployments.getExtendedArtifact(
    'CxipIdentity'
  );
  const cxipERC721 = await hre.deployments.getArtifact('CxipERC721');
  const cxipERC1155 = await hre.deployments.getArtifact('CxipERC1155');
  const cxipCopyright = await hre.deployments.getArtifact('CxipCopyright');
  const cxipAsset = await hre.deployments.getArtifact('CxipAsset');
  const pA1D = await hre.deployments.getArtifact('PA1D');

  console.log(pA1DProxy);
  console.log(cxipProvenance);
  console.log(cxipIdentity.address);
  console.log(cxipERC721.address);
  console.log(cxipERC1155.address);
  console.log(cxipCopyright.address);
  console.log(cxipAsset.address);
  console.log(pA1D.address);

  // Registry
  try {
    await hre.run('verify:verify', {
      address: cxipRegistry.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Registry ${error}`);
  }

  // Proxies
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
  try {
    await hre.run('verify:verify', {
      address: cxipERC721Proxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC721Proxy ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipERC1155Proxy.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC1155Proxy ${error}`);
  }
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

  // Implementations
  try {
    await hre.run('verify:verify', {
      address: cxipAsset.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Asset ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipCopyright.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Copyright ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipERC721.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC721 ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipERC1155.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify ERC1155 ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipIdentity.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Identity ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: cxipProvenance.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify Provenance ${error}`);
  }
  try {
    await hre.run('verify:verify', {
      address: pA1D.address,
      constructorArguments: [],
    });
  } catch (error) {
    console.error(`Failed to verify PA1D ${error}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
