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

import "./interface/ICxipERC721.sol";
import "./interface/ICxipProvenance.sol";
import "./interface/ICxipRegistry.sol";
import "./library/Address.sol";
import "./library/Signature.sol";
import "./struct/CollectionData.sol";
import "./struct/InterfaceType.sol";
import "./struct/Token.sol";
import "./struct/TokenData.sol";
import "./struct/Verification.sol";

/**
 * @title CXIP Identity
 * @author CXIP-Labs
 * @notice A smart contract for managing an on-chain identity.
 * @dev The smart contract interacts and relies on CXIP Provenance.
 */
contract CxipIdentity {
    /**
     * @dev A variable that is used as an external indicator.
     */
    bool private _newTrigger;
    /**
     * @dev Array of all wallets associated with the identity.
     */
    address[] private _walletArray;
    /**
     * @dev Array of addresses for all collection that were created by the identity.
     */
    address[] private _collectionArray;
    /**
     * @dev Temporary map for storing wallets that need to be added, but have not been authorised yet.
     */
    mapping(address => address) private _preAuthWallets;
    /**
     * @dev A map of nonces already used by a wallet, to prevent signature hijacking.
     */
    mapping(address => uint256) private _lastNonce;
    /**
     * @dev A map to make it possible for retrieving wallets by address rather than array index.
     */
    mapping(address => uint256) private _walletIndexMap;
    /**
     * @dev Map with interface type definitions for identity created collections.
     */
    mapping(address => InterfaceType) private _additionalInfo;

    /**
     * @dev Reentrancy implementation from OpenZepellin. State 1 == NOT_ENDERED, State 2 == ENTERED
     */
    uint256 private _reentrancyState;

    /**
     * @notice Constructor is empty and only reentrancy guard is implemented.
     * @dev To make exact CREATE2 deployment possible, constructor is left empty. We utilize the "init" function instead.
     */
    constructor() {
        _reentrancyState = 1;
    }

    /**
     * @notice Enables royaltiy functionality at the ERC721 level when ether is sent with no calldata.
     * @dev See implementation of _royaltiesFallback.
     */
    receive() external payable {
        _royaltiesFallback();
    }

    /**
     * @notice Enables royaltiy functionality at the ERC721 level no other function matches the call.
     * @dev See implementation of _royaltiesFallback.
     */
    fallback() external {
        _royaltiesFallback();
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
     * @notice Add a new wallet to the identity.
     * @dev This function needs to be called by a wallet already associated with the identity.
     * @dev Signature from new wallet can be included or omitted. If not included, new wallet will need to make a connectWallet function call.
     * @param newWallet Address of new wallet being added to the identity.
     * @param v The V value of the new wallet signature (27-28). Optional.
     * @param r The R value of the new wallet signature. Optional.
     * @param s The S value of the new wallet signature. Optional.
     */
    function addSignedWallet(
        address newWallet,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public nonReentrant {
        require(_isOwner(msg.sender), "CXIP: you are not an the owner");
        require(!Address.isContract(newWallet), "CXIP: contract not allowed");
        require(
            Address.isZero(
                ICxipProvenance(
                    getRegistry().getProvenance()
                ).getWalletIdentity(newWallet)
            ),
            "CXIP: wallet already registered"
        );
        if(
            r != 0x00
            && s != 0x0000000000000000000000000000000000000000000000000000000000000000
            && v != 0x0000000000000000000000000000000000000000000000000000000000000000
        ) {
            uint256 nonce = nextNonce(newWallet);
            bytes memory encoded = abi.encodePacked(
                address(this),
                newWallet,
                nonce
            );
            bool validSig = Signature.Valid(newWallet, r, s, v, encoded);
            require(validSig, "CXIP: invalid signature");
            _lastNonce[newWallet] = nonce;
            _addWalletToEnumeration(newWallet);
            ICxipProvenance(
                getRegistry().getProvenance()
            ).informAboutNewWallet(newWallet);
        } else {
            _preAuthWallets[newWallet] = msg.sender;
        }
    }

    /**
     * @notice Short-hand for addSignedWallet, but without the signature.
     * @dev Use this function if you are not planning to include wallet signature.
     * @param newWallet Address of new wallet being added to the identity.
     */
    function addWallet(address newWallet) public {
        addSignedWallet(newWallet, 0, 0, 0);
    }

    /**
     * @notice Connects a pre-authorised wallet.
     * @dev Make this call with a new wallet after an addWallet function is called by an existing wallet.
     */
    function connectWallet() public nonReentrant {
        address newWallet = msg.sender;
        address authorizer = _preAuthWallets[newWallet];
        require(!Address.isZero(authorizer), "CXIP: not authorized by owner");
        require(_isOwner(authorizer), "CXIP: authorizer no longer owner");
        require(
            Address.isZero(
                ICxipProvenance(
                    getRegistry().getProvenance()
                ).getWalletIdentity(newWallet)
            ),
            "CXIP: wallet already registered"
        );
        _addWalletToEnumeration(newWallet);
        ICxipProvenance(getRegistry().getProvenance()).informAboutNewWallet(
            newWallet
        );
        delete _preAuthWallets[newWallet];
    }

    /**
     * @notice Create an ERC721 NFT for a collection created by this identity.
     * @dev This function is embedded inside of the identity contract to make validation and providence bulletproof.
     * @dev An NFT can be minted directly inside the collection, but the CXIP Asset smart contract will not mark it as a certified NFT.
     * @param collection Address of the smart contract for the collection. Must have been created by this identity.
     * @param id Token id for the NFT to mint. Can be left as 0 to allow automatic token id allocation.
     * @param tokenData A struct containing all of the necessary NFT information.
     * @param verification A verification signature issued by the CXIP Asset Signer as a guarantee of a valid NFT.
     * @return uint256 Returns the token id of the newly minted NFT.
     */
    function createERC721Token(
        address collection,
        uint256 id,
        TokenData calldata tokenData,
        Verification calldata verification
    ) public nonReentrant returns (uint256) {
        require(_isOwner(msg.sender), "CXIP: you are not an the owner");
        require(_isOwner(tokenData.creator), "CXIP: creator not owner");
        require(
            _additionalInfo[collection] == InterfaceType.ERC721,
            "CXIP: collection not ERC721"
        );
        bytes memory encoded = abi.encodePacked(
            address(this),
            tokenData.creator,
            collection,
            id,
            tokenData.payloadHash,
            tokenData.payloadSignature.r,
            tokenData.payloadSignature.s,
            tokenData.payloadSignature.v,
            tokenData.arweave,
            tokenData.arweave2,
            tokenData.ipfs,
            tokenData.ipfs2
        );
        require(Signature.Valid(
            getRegistry().getAssetSigner(),
            verification.r,
            verification.s,
            verification.v,
            encoded
        ), "CXIP: invalid signature");
        return ICxipERC721(collection).cxipMint(id, tokenData);
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
        require(_isOwner(collectionCreator), "CXIP: creator not owner");
        bytes memory bytecode = hex"ERC721_PROXY_BYTECODE";
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
        require(_isOwner(collectionCreator), "CXIP: creator not owner");
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
            keccak256(cxipAddress.code) == keccak256(ICxipRegistry(0xdeaDDeADDEaDdeaDdEAddEADDEAdDeadDEADDEaD).getCustomSource(slot).code),
            "CXIP: byte code missmatch"
        );
        ICxipERC721(cxipAddress).init(collectionCreator, collectionData);
        _addCollectionToEnumeration(cxipAddress, InterfaceType.ERC721);
        return(cxipAddress);
    }

    /**
     * @notice Initialise the identity. This function works only once.
     * @dev It is important to run this inside the same function as the create2 for this contract.
     * @param wallet The address of the wallet to add to new identity.
     * @param secondaryWallet Optional second wallet to add to new identity.
     */
    function init(address wallet, address secondaryWallet) public nonReentrant {
        require(_walletArray.length == 0, "CXIP: already initialized");
        _addWalletToEnumeration(wallet);
        if(!Address.isZero(secondaryWallet)) {
            _addWalletToEnumeration(secondaryWallet);
        }
    }

    /**
     * @notice Returns the wallet that is authorising the new wallet to be added.
     * @dev Should be used for visual validation of wallet that is authorising a new wallet to be added.
     * @param wallet The address of the new wallet being requested to add.
     * @return address Returns the address of the wallet that is requesting the new wallet.
     */
    function getAuthorizer(address wallet) public view returns (address) {
        return _preAuthWallets[wallet];
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
     * @notice Get wallets associated with identity.
     * @dev Any wallet returned in this response should be considered as owner.
     * @return address[] Returns an array of all the wallets that have been associated with the identity contract..
     */
    function getWallets() public view returns (address[] memory) {
        return _walletArray;
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
     * @notice Used for cross-contract confirmation/validation. You should not use this.
     * @dev This function is called by provenance as an extra layer of validation.
     * @return bool Returns the current state of the _newTrigger variable.
     */
    function isNew() public view returns (bool) {
        return _newTrigger;
    }

    /**
     * @notice Check if current caller is owner of the smart contract.
     * @dev This checks if the msg.sender wallet is associated with the identity.
     * @return bool Returns true is the wallet is authorised by the identity.
     */
    function isOwner() public view returns (bool) {
        return isWalletRegistered(msg.sender);
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
     * @notice Check if wallet is associated with the identity.
     * @dev Used for external validation. Wallets can only be associated to one identity, ever.
     * @param wallet Address of wallet to check against the identity.
     * @return bool Returns true if wallet is registered to this identity.
     */
    function isWalletRegistered(address wallet) public view returns (bool) {
        return _isOwner(wallet);
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
     * @notice Get next nonce to be used for a particular wallet.
     * @dev This is not wallet transaction nonce. This is an internal nonce handled by the smart contract. Should be used for special instances where nonced signatures are required.
     * @param wallet Address of wallet.
     * @return uint256 Returns the next nonce to use.
     */
    function nextNonce(address wallet) public view returns (uint256) {
        uint256 nonce = _lastNonce[wallet];
        return nonce + 1;
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
     * @dev Add wallet to identity.
     * @param wallet Address of wallet to add.
     */
    function _addWalletToEnumeration(address wallet) internal {
        uint256 index = _walletArray.length;
        _walletArray.push(wallet);
        _walletIndexMap[wallet] = index;
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
     * @dev Remove wallet from identity.
     * @param wallet Address of wallet to remove.
     */
    function _removeWalletFromEnumeration(address wallet) internal {
        require(_walletArray.length != 0, "CXIP: removing from empty array");
        uint256 lastIndex = _walletArray.length - 1;
        require(lastIndex != 0, "CXIP: cannot remove last wallet");
        uint256 walletIndex = _walletIndexMap[wallet];
        if(walletIndex != lastIndex) {
            address lastWallet = _walletArray[lastIndex];
            _walletArray[walletIndex] = lastWallet;
            _walletIndexMap[lastWallet] = walletIndex;
        }
        delete _walletArray[lastIndex];
        delete _walletIndexMap[wallet];
    }

    /**
     * @notice Allows retrieval of royalties from the contract.
     * @dev This is a default fallback to ensure the royalties are available.
     */
    function _royaltiesFallback() internal {
        address _target = getRegistry().getPA1D();
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _target, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
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
     * @dev Check if wallet is associated with this identity.
     * @param wallet Address of the wallet.
     * @return bool Returns true if wallet is associated with this identity.
     */
    function _isOwner(address wallet) internal view returns (bool) {
        return _walletArray[_walletIndexMap[wallet]] == wallet;
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
        return ICxipRegistry(0xdeaDDeADDEaDdeaDdEAddEADDEAdDeadDEADDEaD);
    }
}
