import { expect } from 'chai';
import { ethers } from 'hardhat';
import Web3 from 'web3';
import { deployments, getNamedAccounts } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import {
  CxipRegistry,
  CxipAssetProxy,
  CxipCopyrightProxy,
  CxipERC721Proxy,
  CxipERC1155Proxy,
  CxipIdentityProxy,
  CxipProvenanceProxy,
  PA1DProxy,
  CxipProvenance,
  CxipIdentity,
  CxipERC721,
  CxipAsset,
  PA1D,
  CxipFactory,
} from '../typechain';

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

describe('CXIP', () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let user4: SignerWithAddress;

  let registry: CxipRegistry;

  let assetProxy: CxipAssetProxy;
  let copyrightProxy: CxipCopyrightProxy;
  let erc721Proxy: CxipERC721Proxy;
  let erc1155Proxy: CxipERC1155Proxy;
  let identityProxy: CxipIdentityProxy;
  let provenanceProxy: CxipProvenanceProxy;
  let royaltiesProxy: PA1DProxy;

  let asset: CxipAsset;
  let erc721: CxipERC721;
  let identity: CxipIdentity;
  let provenance: CxipProvenance;
  let royalties: PA1D;
  let factory: CxipFactory;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    user2 = accounts[2];
    user3 = accounts[3];
    user4 = accounts[4];

    await deployments.fixture([
      'CxipRegistry',
      'CxipAssetProxy',
      'CxipCopyrightProxy',
      'CxipERC721Proxy',
      'CxipERC1155Proxy',
      'CxipIdentityProxy',
      'CxipProvenanceProxy',
      'PA1DProxy',
      'CxipProvenance',
      'CxipIdentity',
      'CxipERC721',
      'CxipERC1155',
      'CxipCopyright',
      'CxipAsset',
      'PA1D',

      'Register',
    ]);
    registry = await ethers.getContract('CxipRegistry');
    assetProxy = await ethers.getContract('CxipAssetProxy');
    copyrightProxy = await ethers.getContract('CxipCopyrightProxy');
    erc721Proxy = await ethers.getContract('CxipERC721Proxy');
    erc1155Proxy = await ethers.getContract('CxipERC1155Proxy');
    identityProxy = await ethers.getContract('CxipIdentityProxy');
    provenanceProxy = await ethers.getContract('CxipProvenanceProxy');
    royaltiesProxy = await ethers.getContract('PA1DProxy');

    provenance = await ethers.getContract('CxipProvenance');
    identity = await ethers.getContract('CxipIdentity');
    erc721 = await ethers.getContract('CxipERC721');
    asset = await ethers.getContract('CxipAsset');
    royalties = await ethers.getContract('PA1D');
  });

  beforeEach(async () => {});

  afterEach(async () => {});

  describe('Registry', () => {
    it('should set and get asset source', async () => {
      const assetTx = await registry.setAssetSource(asset.address);
      await assetTx.wait();
      const assetSourceAddress = await registry.getAssetSource();

      expect(assetSourceAddress).to.equal(asset.address);
    });

    it('should set and get asset proxy', async () => {
      const assetProxyTx = await registry.setAsset(assetProxy.address);

      await assetProxyTx.wait();
      const assetProxyAddress = await registry.getAsset();
      expect(assetProxyAddress).to.equal(assetProxy.address);
    });

    it('should set and get ERC721', async () => {
      const erc721Tx = await registry.setERC721CollectionSource(erc721.address);
      await erc721Tx.wait();
      const erc721Address = await registry.getERC721CollectionSource();
      expect(erc721Address).to.equal(erc721.address);
    });

    it('should set and get identity', async () => {
      const identityTx = await registry.setIdentitySource(identity.address);
      await identityTx.wait();
      const identitySourceAddress = await registry.getIdentitySource();
      expect(identitySourceAddress).to.equal(identity.address);
    });

    it('should set and get provenance', async () => {
      const provenanceTx = await registry.setProvenanceSource(
        provenance.address
      );
      await provenanceTx.wait();
      const provenanceAddress = await registry.getProvenanceSource();
      expect(provenanceAddress).to.equal(provenance.address);
    });

    it('should set and get provenance proxy', async () => {
      const provenanceProxyTx = await registry.setProvenance(
        provenanceProxy.address
      );
      await provenanceProxyTx.wait();
      const provenanceProxyAddress = await registry.getProvenance();
      expect(provenanceProxyAddress).to.equal(provenanceProxy.address);
    });

    it('should set and get royalties', async () => {
      const royaltiesTx = await registry.setPA1DSource(royalties.address);
      await royaltiesTx.wait();
      const royaltiesAddress = await registry.getPA1DSource();
      expect(royaltiesAddress).to.equal(royalties.address);
    });

    it('should set and get royalties proxy', async () => {
      const royaltiesProxyTx = await registry.setPA1D(royaltiesProxy.address);
      await royaltiesProxyTx.wait();
      const royaltiesProxyAddress = await registry.getPA1D();
      expect(royaltiesProxyAddress).to.equal(royaltiesProxy.address);
    });
  });
});
