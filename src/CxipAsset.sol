// SPDX-License-Identifier: MIT

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

import "./interface/ICxipERC721.sol";
import "./interface/ICxipIdentity.sol";
import "./interface/ICxipProvenance.sol";
import "./interface/ICxipRegistry.sol";
import "./library/Address.sol";
import "./struct/UriType.sol";

/**
 * @title CXIP Asset
 * @author CXIP-Labs
 * @notice A smart contract for providing a single entry for checking validity of collections and tokens minted through CXIP.
 * @dev Listen events broadcasted by this smart contract, to get all collections and NFT being minted with CXIP smart contracts.
 */
contract CxipAsset {
    /**
     * @dev Used for setting a default URI type to be returned in a tokenURI / URI calls from the ERC721 and ERC1155 smart contracts.
     * @dev Convenient method for having a quick toggle in case a network (like Arweave) goes offline.
     */
    UriType private _defaultUri;

    /**
     * @dev Collections mapped to Identity smart contract addresses.
     */
    mapping(address => address) private _collectionIdentity;

    /**
     * @notice Event emitted when an existing collection is added to an Identity.
     * @dev Emits event to record when an existing collection was added.
     * @param collectionAddress Address of the collection smart contract.
     * @param identityAddress Address of the identity smart contract.
     */
    event CollectionAdded(address indexed collectionAddress, address indexed identityAddress);

    /**
     * @notice Event emitted when a new collection is created and added to an Identity.
     * @dev Emits event to record when a new collection is created.
     * @param collectionAddress Address of the collection smart contract.
     * @param identityAddress Address of the identity smart contract.
     */
    event CollectionCreated(address indexed collectionAddress, address indexed identityAddress);

    /**
     * @notice Event emitted when an existing token is added to an Identity.
     * @dev Emits event to record when an existing token was added.
     * @param collectionAddress Address of the collection smart contract.
     * @param identityAddress Address of the identity smart contract.
     * @param tokenId Id of the token being added.
     */
    event TokenAdded(
        address indexed collectionAddress,
        address indexed identityAddress,
        uint256 indexed tokenId
    );

    /**
     * @notice Event emitted when a new token is created and added to an Identity.
     * @dev Emits event to record when a new token is created.
     * @param collectionAddress Address of the collection smart contract.
     * @param identityAddress Address of the identity smart contract.
     * @param tokenId Id of the token being created.
     */
    event TokenCreated(
        address indexed collectionAddress,
        address indexed identityAddress,
        uint256 indexed tokenId
    );

    /**
     * @notice Constructor is empty and not utilised of anything but setting a default URI type.
     * @dev Smart contract is being used as an on-chain ledger. Nothing needs to be configured.
     */
    constructor() {
        _defaultUri = UriType.ARWEAVE;
    }

    /**
     * @notice Associates the collection with an identity.
     * @dev Contains logic to check if collection is new.
     * @param creator The creator of the collection.
     * @param collection The collection address.
     * @param fresh A flag to certify the collection and will be used to implement copyright.
     */
    function AddCollection(
        address creator,
        address collection,
        bool fresh
    ) public {
        address identityAddress = msg.sender;
        require(
            ICxipProvenance(getRegistry().getProvenance()).isIdentityValid(identityAddress),
            "CXIP: invalid Identity contract"
        );
        ICxipIdentity identity = ICxipIdentity(identityAddress);
        require(identity.isWalletRegistered(creator), "CXIP: creator wallet not owner");
        require(identity.isCollectionRegistered(collection), "CXIP: not registered collection");
        bool certified = false;
        if (fresh) {
            require(identity.isNew(), "CXIP: not a new collection");
            certified = true;
            emit CollectionCreated(collection, creator);
        } else {
            emit CollectionAdded(collection, creator);
        }
        _collectionIdentity[collection] = identityAddress;
    }

    /**
     * @notice Adds a token to a collection.
     * @dev Contains logic to check if token is new.
     * @param creator Creator of the collection.
     * @param collection Address of the collection.
     * @param tokenId The token to be added to the collection.
     * @param fresh A flag to certify the token and will be used to implement copyright.
     */
    function AddToken(
        address creator,
        address collection,
        uint256 tokenId,
        bool fresh
    ) public {
        address identityAddress = msg.sender;
        require(
            ICxipProvenance(getRegistry().getProvenance()).isIdentityValid(identityAddress),
            "CXIP: invalid Identity contract"
        );
        ICxipIdentity identity = ICxipIdentity(identityAddress);
        require(identity.isWalletRegistered(creator), "CXIP: creator wallet not owner");
        require(identity.isCollectionRegistered(collection), "CXIP: not registered collection");
        require(identity.isTokenRegistered(collection, tokenId), "CXIP: not registered token");
        bool certified = false;
        if (fresh) {
            require(identity.isNew(), "CXIP: not a new collection token");
            certified = true;
            emit TokenCreated(collection, creator, tokenId);
        } else {
            emit TokenAdded(collection, creator, tokenId);
        }
    }

    /**
     * @notice Gets the type of URI (Arweave / IPFS / HTTP).
     * @dev Uses an enum value from 0 - 2 for each type.
     * @return UriType.
     */
    function defaultUriType() public view returns (UriType) {
        return _defaultUri;
    }

    /**
     * @notice Gets the identity associated with the collection.
     * @dev Gets the address of the identity contract.
     * @param collection The address of the collection.
     * @return address of the identity contract.
     */
    function getCollectionIdentity(address collection) public view returns (address) {
        ICxipIdentity identity = _getIdentity(collection);
        return address(identity);
    }

    /**
     * @notice Get the collection's Interface Type: ERC20, ERC721, ERC1155.
     * @dev Collection must be associated with identity.
     * @param collection Contract address of the collection.
     * @return InterfaceType Returns an enum (uint8) of the collection interface type.
     */
    function getCollectionType(address collection) public view returns (InterfaceType) {
        ICxipIdentity identity = _getIdentity(collection);
        require(!Address.isZero(address(identity)), "CXIP: not registered collection");
        return identity.getCollectionType(collection);
    }

    /**
     * @dev Reserved function for later use. Will be used to identify if collection was heavily vetted.
     * @param collection Contract address of the collection.
     * @return bool Returns true if collection is associated with the identity.
     */
    function isCollectionCertified(address collection) public view returns (bool) {
        ICxipIdentity identity = _getIdentity(collection);
        if (Address.isZero(address(identity))) {
            return false;
        }
        return identity.isCollectionCertified(collection);
    }

    /**
     * @notice Check if an identity collection is open to external minting.
     * @dev For now this always returns false. Left as a placeholder for future development where shared collections might be used.
     * @dev Since it's not being used, the collection variable is commented out to avoid compiler warnings.
     * @return bool Returns true of false, to indicate if a specific collection is open/shared.
     */
    function isCollectionOpen(address collection) public view returns (bool) {
        ICxipIdentity identity = _getIdentity(collection);
        if (Address.isZero(address(identity))) {
            return false;
        }
        return identity.isCollectionOpen(collection);
    }

    /**
     * @notice Check if a collection is registered with identity.
     * @dev For now will only return true for collections created directly from the identity contract.
     * @param collection Contract address of the collection.
     * @return bool Returns true if collection is associated with the identity.
     */
    function isCollectionRegistered(address collection) public view returns (bool) {
        ICxipIdentity identity = _getIdentity(collection);
        if (Address.isZero(address(identity))) {
            return false;
        }
        return identity.isCollectionRegistered(collection);
    }

    /**
     * @dev Reserved function for later use. Will be used to identify if token was heavily vetted.
     * @param collection Contract address of the collection.
     * @param tokenId Id of the token.
     * @return bool Returns true if token is associated with the identity.
     */
    function isTokenCertified(address collection, uint256 tokenId) public view returns (bool) {
        ICxipIdentity identity = _getIdentity(collection);
        if (Address.isZero(address(identity))) {
            return false;
        }
        return identity.isTokenCertified(collection, tokenId);
    }

    /**
     * @notice Check if a token is registered with identity.
     * @dev For now will only return true for tokens created directly from the identity contract.
     * @param collection Contract address of the collection.
     * @param tokenId Id of the token.
     * @return bool Returns true if token is associated with the identity.
     */
    function isTokenRegistered(address collection, uint256 tokenId) public view returns (bool) {
        ICxipIdentity identity = _getIdentity(collection);
        if (Address.isZero(address(identity))) {
            return false;
        }
        return identity.isTokenRegistered(collection, tokenId);
    }

    /**
     * @notice Gets the identity associated with the collection.
     * @dev Returns zero address if identity doesn't exist.
     * @param collection Collection associated with the identitiy.
     * @return ICxipIdentity The identity interface.
     */
    function _getIdentity(address collection) internal view returns (ICxipIdentity) {
        address identityAddress = _collectionIdentity[collection];
        return ICxipIdentity(identityAddress);
    }

    /**
     * @dev Get the top-level CXIP Registry smart contract. Function must always be internal to prevent miss-use/abuse through bad programming practices.
     * @return ICxipRegistry The address of the top-level CXIP Registry smart contract.
     */
    function getRegistry() internal pure returns (ICxipRegistry) {
        return ICxipRegistry(0xdeaDDeADDEaDdeaDdEAddEADDEAdDeadDEADDEaD);
    }
}
