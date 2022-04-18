import { expect } from 'chai';
import { ethers } from 'hardhat';
import Web3 from 'web3';
import { deployments } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { CxipProvenance, CxipProvenanceProxy } from '../typechain-types';
import { ZERO_ADDRESS } from './utils';
import { BigNumberish, BytesLike } from 'ethers';

const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8545');

describe('CXIP', () => {
  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;

  let provenanceProxy: CxipProvenanceProxy;
  let provenance: CxipProvenance;

  before(async () => {
    const accounts = await ethers.getSigners();
    deployer = accounts[0];
    user = accounts[1];
    user2 = accounts[2];

    await deployments.fixture([
      'CxipRegistry',
      'CxipAssetProxy',
      'CxipCopyrightProxy',
      'CxipERC721Proxy',
      'CxipERC1155Proxy',
      'CxipIdentityProxy',
      'CxipProvenanceProxy',
      'PA1DProxy',
      'DanielArshamErosionsProxy',
      'CxipProvenance',
      'CxipIdentity',
      'CxipERC721',
      'CxipERC1155',
      'CxipCopyright',
      'CxipAsset',
      'PA1D',
      'DanielArshamErosions',

      'Register',
    ]);
    provenanceProxy = (await ethers.getContract(
      'CxipProvenanceProxy'
    )) as CxipProvenanceProxy;
    provenance = (await ethers.getContract('CxipProvenance')) as CxipProvenance;
  });

  describe('Identity', () => {
    it('should create an identity', async () => {
      const salt = deployer.address + '0x000000000000000000000000'.substring(2);
      const tx = await provenance.createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0000000000000000000000000000000000000000000000000000000000000000',
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const events = receipt.events?.filter((x) => {
        return x.event == 'IdentityCreated';
      });

      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);
      expect(identityAddress).to.equal(events?.[0].args?.[0]);
      expect(identityAddress).to.equal(events?.[0].args?.identityAddress);
    });

    it('should not allow duplicate identities', async () => {
      const salt = deployer.address + '0x000000000000000000000000'.substring(2);

      await expect(
        provenance.createIdentity(
          salt,
          '0x' + '00'.repeat(20), // zero address
          [
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            '0x0',
          ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
        )
      ).to.be.revertedWith('CXIP: wallet already used');
    });

    it.skip('should create an identity with a secondary wallet', async () => {
      // TODO: Come back to this and use signatures for second address
    });

    it('should be a valid identity', async () => {
      const salt = user.address + '0x000000000000000000000000'.substring(2);
      const tx = await provenance.connect(user).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user.address.substring(2)}`,
          `0x000000000000000000000000${user.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);

      const isValid = await provenance.isIdentityValid(identityAddress);
      expect(isValid).to.equal(true);
    });

    it('should not be a blacklisted identity', async () => {
      const salt = user2.address + '0x000000000000000000000000'.substring(2);
      const tx = await provenance.connect(user2).createIdentity(
        salt,
        '0x' + '00'.repeat(20), // zero address
        [
          `0x000000000000000000000000${user2.address.substring(2)}`,
          `0x000000000000000000000000${user2.address.substring(2)}`,
          '0x0',
        ] as unknown as { r: BytesLike; s: BytesLike; v: BigNumberish }
      );

      const receipt = await tx.wait();
      const identityAddress = await provenance.getIdentity();
      expect(identityAddress).not.to.equal(ZERO_ADDRESS);

      const isValid = await provenance.isIdentityBlacklisted(identityAddress);
      expect(isValid).to.equal(false);
    });
  });
});
