// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

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
import "./interface/ICxipRegistry.sol";
import "./library/Address.sol";
import "./library/Signature.sol";
import "./struct/CollectionData.sol";
import "./struct/InterfaceType.sol";
import "./struct/Token.sol";
import "./struct/TokenData.sol";
import "./struct/Verification.sol";

/**
 * @title CXIP Provenance
 * @author CXIP-Labs
 * @notice A smart contract for managing and validating all of CXIP's provenance.
 * @dev For a CXIP Identity to be valid, it needs to be made through CXIP Provenance.
 */
contract CxipProvenance {
    /**
     * @dev Reentrancy implementation from OpenZepellin. State 1 == NOT_ENDERED, State 2 == ENTERED
     */
    uint256 private _reentrancyState;

    /**
     * @dev Array of addresses for all collection that were created by the identity.
     */
    address[] private _collectionArray;

    /**
     * @dev Map with interface type definitions for identity created collections.
     */
    mapping(address => InterfaceType) private _additionalInfo;

    /**
     * @notice Event emitted when a collection is created.
     * @dev Allows off-chain services to index the newly deployed collection address.
     * @param collectionCreator Address of the collection creator (msg.sender).
     * @param collectionAddress Address of the newly created collection.
     * @param salt A salt used for deploying a collection to a specific address.
     */
    event CollectionCreated(address indexed collectionCreator, address indexed collectionAddress, bytes32 indexed salt);

    /**
     * @notice Constructor is empty and only reentrancy guard is implemented.
     * @dev There is no data that needs to be set on first time deployment.
     */
    constructor() {
        _reentrancyState = 1;
    }

    /**
     * @dev Implementation from OpenZeppelin (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol)
     */
    modifier nonReentrant() {
        require(_reentrancyState != 2, "ReentrancyGuard: reentrant call");
        _reentrancyState = 2;
        _;
        _reentrancyState = 1;
    }

    /**
     * @notice Check if an identity collection is open to external minting.
     * @dev For now this always returns false. Left as a placeholder for future development where shared collections might be used.
     * @dev Since it's not being used, the collection variable is commented out to avoid compiler warnings.
     * @return bool Returns true of false, to indicate if a specific collection is open/shared.
     */
    function isCollectionOpen(
        address/* collection*/
    ) external pure returns (bool) {
        return false;
    }

    /**
     * @notice Create an ERC721 collection.
     * @dev Creates and associates the ERC721 collection with the identity.
     * @param saltHash A salt used for deploying a collection to a specific address.
     * @param collectionCreator Specific wallet, associated with the identity, that will be marked as the creator of this collection.
     * @param verification Signature created by the collectionCreator wallet to validate the integrity of the collection data.
     * @param collectionData The collection data struct, with all the default collection info.
     * @return address Returns the address of the newly created collection.
     */
    function createERC721Collection(
        bytes32 saltHash,
        address collectionCreator,
        Verification calldata verification,
        CollectionData calldata collectionData
    ) public nonReentrant returns (address) {
        if(collectionCreator != msg.sender) {
            require(
                Signature.Valid(
                    collectionCreator,
                    verification.r,
                    verification.s,
                    verification.v,
                    abi.encodePacked(
                        address(this),
                        collectionCreator,
                        collectionData.name,
                        collectionData.name2,
                        collectionData.symbol,
                        collectionData.royalties,
                        collectionData.bps
                    )
                ),
                "CXIP: invalid signature"
            );
        }
        bytes memory bytecode = hex"608060405234801561001057600080fd5b5060f68061001f6000396000f3fe60806040819052632c5feccb60e11b8152600090735fbdb2315678afecb367f032d93f642f64180aa3906358bfd99690608490602090600481865afa158015604b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190606d91906092565b90503660008037600080366000845af43d6000803e808015608d573d6000f35b3d6000fd5b60006020828403121560a357600080fd5b81516001600160a01b038116811460b957600080fd5b939250505056fea26469706673582212200ccd0771ef68a12b3c78ffcaf88afcf10e0d0f2a51e9296249fb5a9282c0b42664736f6c634300080c0033";
        address cxipAddress;
        assembly {
            cxipAddress := create2(
                0,
                add(bytecode, 0x20),
                mload(bytecode),
                saltHash
            )
        }
        ICxipERC721(cxipAddress).init(collectionCreator, collectionData);
        _addCollectionToEnumeration(cxipAddress, InterfaceType.ERC721);
        emit CollectionCreated(collectionCreator, cxipAddress, saltHash);
        return(cxipAddress);
    }

    /**
     * @notice Create a custom ERC721 collection.
     * @dev Creates and associates the custom ERC721 collection with the identity.
     * @param saltHash A salt used for deploying a collection to a specific address.
     * @param collectionCreator Specific wallet, associated with the identity, that will be marked as the creator of this collection.
     * @param verification Signature created by the collectionCreator wallet to validate the integrity of the collection data.
     * @param collectionData The collection data struct, with all the default collection info.
     * @param slot Hash of proxy contract slot where the source is saved in registry.
     * @param bytecode The bytecode used for deployment. Validated against slot code for abuse prevention.
     * @return address Returns the address of the newly created collection.
     */
    function createCustomERC721Collection(
        bytes32 saltHash,
        address collectionCreator,
        Verification calldata verification,
        CollectionData calldata collectionData,
        bytes32 slot,
        bytes memory bytecode
    ) public nonReentrant returns (address) {
        if(collectionCreator != msg.sender) {
            require(
                Signature.Valid(
                    collectionCreator,
                    verification.r,
                    verification.s,
                    verification.v,
                    abi.encodePacked(
                        address(this),
                        collectionCreator,
                        collectionData.name,
                        collectionData.name2,
                        collectionData.symbol,
                        collectionData.royalties,
                        collectionData.bps
                    )
                ),
                "CXIP: invalid signature"
            );
        }
        address cxipAddress;
        assembly {
            cxipAddress := create2(
                0,
                add(bytecode, 0x20),
                mload(bytecode),
                saltHash
            )
        }
        require(
            keccak256(cxipAddress.code) == keccak256(ICxipRegistry(0x5FbDB2315678afecb367f032d93F642f64180aa3).getCustomSource(slot).code),
            "CXIP: byte code missmatch"
        );
        ICxipERC721(cxipAddress).init(collectionCreator, collectionData);
        _addCollectionToEnumeration(cxipAddress, InterfaceType.ERC721);
        emit CollectionCreated(collectionCreator, cxipAddress, saltHash);
        return(cxipAddress);
    }

    /**
     * @dev This retrieves a collection by index. Don't be confused by the ID in the title.
     * @param index Index of the item to get from the array.
     * @return address Returns the collection contract address at that index of array.
     */
    function getCollectionById(uint256 index) public view returns (address) {
        return _collectionArray[index];
    }

    /**
     * @notice Get the collection's Interface Type: ERC20, ERC721, ERC1155.
     * @dev Collection must be associated with identity.
     * @param collection Contract address of the collection.
     * @return InterfaceType Returns an enum (uint8) of the collection interface type.
     */
    function getCollectionType(address collection) public view returns (InterfaceType) {
        return _additionalInfo[collection];
    }

    /**
     * @dev Reserved function for later use. Will be used to identify if collection was heavily vetted.
     * @param collection Contract address of the collection.
     * @return bool Returns true if collection is associated with the identity.
     */
    function isCollectionCertified(
        address collection
    ) public view returns (bool) {
        return _isCollectionValid(collection);
    }

    /**
     * @notice Check if a collection is registered with identity.
     * @dev For now will only return true for collections created directly from the identity contract.
     * @param collection Contract address of the collection.
     * @return bool Returns true if collection is associated with the identity.
     */
    function isCollectionRegistered(
        address collection
    ) public view returns (bool) {
        return _isCollectionValid(collection);
    }

    /**
     * @dev Reserved function for later use. Will be used to identify if token was heavily vetted.
     * @param collection Contract address of the collection.
     * @param tokenId Id of the token.
     * @return bool Returns true if token is associated with the identity.
     */
    function isTokenCertified(
        address collection,
        uint256 tokenId
    ) public view returns (bool) {
        return _isValidToken(collection, tokenId);
    }

    /**
     * @notice Check if a token is registered with identity.
     * @dev For now will only return true for tokens created directly from the identity contract.
     * @param collection Contract address of the collection.
     * @param tokenId Id of the token.
     * @return bool Returns true if token is associated with the identity.
     */
    function isTokenRegistered(
        address collection,
        uint256 tokenId
    ) public view returns (bool) {
        return _isValidToken(collection, tokenId);
    }

    /**
     * @notice List all collections associated with this identity.
     * @dev Use in conjunction with the totalCollections function, for pagination.
     * @param offset Index from where to start pagination. Start at 0.
     * @param length Length of slice to return, starting from offset index.
     * @return address[] Returns a fixed length array starting from offset.
     */
    function listCollections(
        uint256 offset,
        uint256 length
    ) public view returns (address[] memory) {
        uint256 limit = offset + length;
        if(limit > _collectionArray.length) {
            limit = _collectionArray.length;
        }
        address[] memory collections = new address[](limit - offset);
        uint256 n = 0;
        for(uint256 i = offset; i < limit; i++) {
            collections[n] = _collectionArray[i];
            n++;
        }
        return collections;
    }

    /**
     * @notice Get total number of collections associated with this identity.
     * @dev Use in conjunction with the listCollections, for pagination.
     * @return uint256 Returns the total length of collections.
     */
    function totalCollections() public view returns (uint256) {
        return _collectionArray.length;
    }

    /**
     * @dev Add collection to identity.
     * @param collection Contract address of the collection to add.
     * @param collectionType Interface type of the collection being added.
     */
    function _addCollectionToEnumeration(
        address collection,
        InterfaceType collectionType
    ) internal {
        _collectionArray.push(collection);
        _additionalInfo[collection] = collectionType;
    }

    /**
     * @dev Remove collection from identity.
     * @param index Array index of the collection to remove.
     */
    function _removeCollectionFromEnumeration(uint256 index) internal {
        require(
            _collectionArray.length != 0,
            "CXIP: removing from empty array"
        );
        delete _additionalInfo[_collectionArray[index]];
        uint256 lastIndex = _collectionArray.length - 1;
        if(lastIndex != 0) {
            if(index != lastIndex) {
                address lastCollection = _collectionArray[lastIndex];
                _collectionArray[index] = lastCollection;
            }
        }
        if(lastIndex == 0) {
            delete _collectionArray;
        } else {
            delete _collectionArray[lastIndex];
        }
    }

    /**
     * @dev Check if collection is associated with this identity.
     * @param collection Contract address of the collection.
     * @return bool Returns true if collection is associated with this identity.
     */
    function _isCollectionValid(
        address collection
    ) internal view returns (bool) {
        return _additionalInfo[collection] != InterfaceType.NULL;
    }

    /**
     * @dev Check if token is associated with this identity.
     * @param collection Contract address of the collection.
     * @dev Since it's not being used yet, the tokenId variable is commented out to avoid compiler warnings.
     * @return bool Returns true if token is associated with this identity.
     */
    function _isValidToken(
        address collection,
        uint256/* tokenId*/
    ) internal view returns (bool) {
        return _additionalInfo[collection] != InterfaceType.NULL;
    }

    /**
     * @dev Get the top-level CXIP Registry smart contract. Function must always be internal to prevent miss-use/abuse through bad programming practices.
     * @return ICxipRegistry The address of the top-level CXIP Registry smart contract.
     */
    function getRegistry() internal pure returns (ICxipRegistry) {
        return ICxipRegistry(0x5FbDB2315678afecb367f032d93F642f64180aa3);
    }
}
