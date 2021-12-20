// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

/*______/\\\\\\\\\__/\\\_______/\\\__/\\\\\\\\\\\__/\\\\\\\\\\\\\___
 _____/\\\////////__\///\\\___/\\\/__\/////\\\///__\/\\\/////////\\\_
  ___/\\\/_____________\///\\\\\\/________\/\\\_____\/\\\_______\/\\\_
   __/\\\_________________\//\\\\__________\/\\\_____\/\\\\\\\\\\\\\/__
    _\/\\\__________________\/\\\\__________\/\\\_____\/\\\/////////____
     _\//\\\_________________/\\\\\\_________\/\\\_____\/\\\_____________
      __\///\\\_____________/\\\////\\\_______\/\\\_____\/\\\_____________
       ____\////\\\\\\\\\__/\\\/___\///\\\__/\\\\\\\\\\\_\/\\\_____________
        _______\/////////__\///_______\///__\///////////__\///____________*/

import "./interface/ICxipIdentity.sol";
import "./interface/ICxipRegistry.sol";
import "./library/Address.sol";
import "./library/Signature.sol";
import "./struct/Verification.sol";

/**
 * @title CXIP Provenance
 * @author CXIP-Labs
 * @notice A smart contract for managing and validating all of CXIP's provenance.
 * @dev For a CXIP Identity to be valid, it needs to be made through CXIP Provenance.
 */
contract CxipProvenance {
    /**
     * @dev Complete map of all wallets and their associated identities.
     */
    mapping(address => address) private _walletToIdentityMap;
    /**
     * @dev Used for mapping created identity addresses.
     */
    mapping(address => bool) private _identityMap;
    /**
     * @dev Special map for storing blacklisted identities.
     */
    mapping(address => bool) private _blacklistMap;

    /**
     * @notice Event emitted when an identity gets blacklisted.
     * @dev This is reserved for later use, in cases where an identity needs to be publicly blacklisted.
     * @param identityAddress Address of the identity being blacklisted.
     * @param reason A string URI to Arweave, IPFS, or HTTP with a detailed explanation for the blacklist.
     */
    event IdentityBlacklisted(address indexed identityAddress, string reason);
    /**
     * @notice Event emitted when a new identity is created.
     * @dev Can subscribe to this even on Provenance to get all CXIP created identities.
     * @param identityAddress Address of the identity being created.
     */
    event IdentityCreated(address indexed identityAddress);
    /**
     * @notice Event emitted when a new wallet is added to the identity.
     * @dev A wallet can only be added to one identity. It will not be possible to ever use it with another identity after that.
     * @param identityAddress Address of the identity being created.
     * @param initiatingWallet The address of wallet that initiated adding the new wallet.
     * @param newWallet The address of new wallet being added.
     */
    event IdentityWalletAdded(
        address indexed identityAddress,
        address indexed initiatingWallet,
        address indexed newWallet
    );

    /**
     * @notice Constructor is empty and not utilised.
     * @dev There is no data that needs to be set on first time deployment.
     */
    constructor() {}

    /**
     * @notice Create a new identity smart contract.
     * @dev Only a wallet that is not already associated with any CXIP Identity can create a new identity.
     * @param saltHash A salt made up of 12 bytes random data and 20 bytes msg.sender address.
     * @param secondaryWallet An additional wallet to add to identity. Used mostly for proxy wallets.
     * @param verification Signatures made by msg.sender to validate identity creation.
     */
    function createIdentity(
        bytes32 saltHash,
        address secondaryWallet,
        Verification calldata verification
    ) public {
        bool usingSecondaryWallet = !Address.isZero(secondaryWallet);
        address wallet = msg.sender;
        require(
            !Address.isContract(wallet),
            "CXIP: cannot use smart contracts"
        );
        require(
            Address.isZero(_walletToIdentityMap[wallet]),
            "CXIP: wallet already used"
        );
        require(
            address(
                uint160(
                    bytes20(saltHash)
                )
            ) == wallet,
            "CXIP: invalid salt hash"
        );
        if(usingSecondaryWallet) {
            require(
                !Address.isContract(secondaryWallet),
                "CXIP: cannot use smart contracts"
            );
            require(
                Address.isZero(_walletToIdentityMap[secondaryWallet]),
                "CXIP: second wallet already used"
            );
            require(
                Signature.Valid(
                    secondaryWallet,
                    verification.r,
                    verification.s,
                    verification.v,
                    abi.encodePacked(
                        address(this),
                        wallet,
                        secondaryWallet
                    )
                ),
                "CXIP: invalid signature"
            );
        }
        bytes memory bytecode = hex"IDENTITY_PROXY_BYTECODE";
        address identityAddress;
        assembly {
            identityAddress := create2(
                0,
                add(bytecode, 0x20),
                mload(bytecode),
                saltHash
            )
        }
        ICxipIdentity(identityAddress).init(wallet, secondaryWallet);
        _walletToIdentityMap[wallet] = identityAddress;
        _identityMap[identityAddress] = true;
        _notifyIdentityCreated(identityAddress);
        _notifyIdentityWalletAdded(identityAddress, wallet, wallet);
        if(usingSecondaryWallet) {
            _notifyIdentityWalletAdded(
                identityAddress,
                wallet,
                secondaryWallet
            );
        }
    }

    /**
     * @notice Tells provenance to emit IdentityWalletAdded event(s).
     * @dev Can only be called by a valid identity associated wallet.
     * @param newWallet Address of wallet to emit event for.
     */
    function informAboutNewWallet(address newWallet) public {
        address identityAddress = msg.sender;
        require(
            _identityMap[identityAddress],
            "CXIP: invalid Identity contract"
        );
        require(
            Address.isZero(_walletToIdentityMap[newWallet]),
            "CXIP: wallet already added"
        );
        ICxipIdentity identity = ICxipIdentity(identityAddress);
        require(
            identity.isWalletRegistered(newWallet),
            "CXIP: unregistered wallet"
        );
        _notifyIdentityWalletAdded(
            identityAddress,
            identity.getAuthorizer(newWallet),
            newWallet
        );
        _walletToIdentityMap[newWallet] = identityAddress;
    }

    /**
     * @notice Get the identity of current wallet.
     * @dev Gets identity of msg.sender.
     * @return address Returns an identity contract address, or zero address if wallet is not associated with any identity.
     */
    function getIdentity() public view returns (address) {
        return _walletToIdentityMap[msg.sender];
    }

    /**
     * @notice Get the identity associated with a wallet.
     * @dev Can also be used to check if a wallet can create a new identity.
     * @param wallet Address of wallet to get identity for.
     * @return address Returns an identity contract address, or zero address if wallet is not associated with any identity.
     */
    function getWalletIdentity(address wallet) public view returns (address) {
        return _walletToIdentityMap[wallet];
    }

    /**
     * @notice Check if an identity is blacklisted.
     * @dev This is an optional function that can be used to decide if an identity should be not interacted with.
     * @param identityAddress Contract address of the identity
     * @return bool Returns true if identity was blacklisted.
     */
    function isIdentityBlacklisted(
        address identityAddress
    ) public view returns (bool) {
        return _blacklistMap[identityAddress];
    }

    /**
     * @notice Check if an identity is valid.
     * @dev This is used to ensure provenance and prevent malicious actors from creating smart contract clones.
     * @param identityAddress Contract address of the identity
     * @return bool Returns true if identity was created through proper provenance.
     */
    function isIdentityValid(
        address identityAddress
    ) public view returns (bool) {
        return (
            _identityMap[identityAddress]
            && !_blacklistMap[identityAddress]
        );
    }

    /**
     * @dev Trigger the IdentityBlacklisted event.
     * @param contractAddress Address of identity that is being blacklisted.
     * @param reason String URI of Arweave, IPFS, or HTTP link explaining reason for blacklisting.
     */
    function _notifyIdentityBlacklisted(
        address contractAddress,
        string calldata reason
    ) internal {
        emit IdentityBlacklisted(contractAddress, reason);
    }

    /**
     * @dev Trigger the IdentityCreated event.
     * @param contractAddress Address of identity that is being created.
     */
    function _notifyIdentityCreated(address contractAddress) internal {
        emit IdentityCreated(contractAddress);
    }

    /**
     * @dev Trigger the IdentityWalletAdded event.
     * @param identityAddress Address of identity that wallet is being added to.
     * @param intiatingWallet Address of wallet that is triggering this event.
     * @param newWallet Address of wallet that is being added to this identity.
     */
    function _notifyIdentityWalletAdded(
        address identityAddress,
        address intiatingWallet,
        address newWallet
    ) internal {
        emit IdentityWalletAdded(identityAddress, intiatingWallet, newWallet);
    }

    /**
     * @dev Get the top-level CXIP Registry smart contract. Function must always be internal to prevent miss-use/abuse through bad programming practices.
     * @return ICxipRegistry The address of the top-level CXIP Registry smart contract.
     */
    function getRegistry() internal pure returns (ICxipRegistry) {
        return ICxipRegistry(0xdeaDDeADDEaDdeaDdEAddEADDEAdDeadDEADDEaD);
    }
}
