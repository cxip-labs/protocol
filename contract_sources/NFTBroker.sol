// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

/*
 __________________________________
|                                  |
| $ + $ + $ + $ + $ + $ + $ + $ + $|
|+ $ + $ + $ + $ + $ + $ + $ + $ + |
| + $ + $ + $ + $ + $ + $ + $ + $ +|
|$ + $ + $ + $ + $ + $ + $ + $ + $ |
| $ + $ + $ + $ + $ + $ + $ + $ + $|
|+ $ + $ + $ + $ + $ + $ + $ + $ + |
| + $ + $ + $ + $ + $ + $ + $ + $ +|
|__________________________________|

*/

import "./SNUFFY500.sol";
import "./external/OpenSea.sol";
import "./interface/ICxipERC721.sol";
import "./interface/ICxipIdentity.sol";
import "./interface/ICxipProvenance.sol";
import "./interface/ICxipRegistry.sol";
import "./interface/IPA1D.sol";
import "./library/Address.sol";
import "./library/Bytes.sol";
import "./library/RotatingToken.sol";
import "./library/Strings.sol";
import "./struct/CollectionData.sol";
import "./struct/TokenData.sol";
import "./struct/Verification.sol";

/**
 * @title NFT Broker
 * @author CXIP-Labs
 * @notice A simple smart contract for selling NFTs from a private storefront.
 * @dev The entire logic and functionality of the smart contract is self-contained.
 * @dev Deploy, configure, transfer in NFTs, and sell!
 */
contract NFTBroker {

    /**
     * @dev Address of admin user. Primarily used as an additional recovery address.
     */
    address private _admin;

    /**
     * @dev Address of contract owner. This address can run all onlyOwner functions.
     */
    address private _owner;

    /**
     * @dev Address of wallet that can authorise special claims.
     */
    address private _notary;

    /**
     * @dev Address of the token being sold.
     */
    address payable private _tokenContract;

    /**
     * @dev UNIX timestamp of from when the tier 1 is open.
     */
    uint256 private _tier1;

    /**
     * @dev UNIX timestamp of from when the tier 2 is open.
     */
    uint256 private _tier2;

    /**
     * @dev UNIX timestamp of from when the tier 3 is open.
     */
    uint256 private _tier3;

    /**
     * @dev Specific map of what tokenId is allowed to mint for a specific wallet.
     */
    mapping(address => uint256[]) private _reservedTokens;

    /**
     * @dev A mapp keeping tally of total numer of tokens purchased by a wallet. Used on drop to enforce tier purchase amount limits.
     */
    mapping(address => uint256) private _purchasedTokens;

    /**
     * @dev Array of all tokenIds available for minting/purchasing.
     */
    uint256[] private _availableTokens;

    /**
     * @dev Base purchase price of token in wei.
     */
    uint256 private _tokenBasePrice;

/*

    What we are trying to do

    Tier 1 is open for 24 hours. Limited to specific list of wallets and a specific set of NFTs.
    We need a mapping, where we wallet to token id.

    We need a generic array of all available NFTs. The Tier 1 NFTs are removed from that list.

    When wallet steps in to purchase their specific NFT, they are checked against the list, and if approved, they get the NFT minted. Otherwise they are told that the NFT has already been minted.

    When Tier 1 closes, we need to have a function that can transfer the remaining NFTs back into the list of all available NFT.



*/

    constructor (uint256 tokenPrice, uint256[] memory openTokens, address tokenContract, address notary) {
        _admin = tx.origin;
        _owner = tx.origin;
        _tokenBasePrice = tokenPrice;
        _availableTokens = openTokens;
        _tokenContract = payable(tokenContract);
        _notary = notary;
    }

    /**
     * @dev This would get called for special reserved tokens. Message sender must be the approve wallet.
     */
    function claimAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier1, "CXIP: too early to claim");
        require(msg.value >= _tokenBasePrice, "CXIP: payment amount is too low");
        require(!SNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        // need to write a code that will do something here with the funds
        uint256[] storage claimable = _reservedTokens[msg.sender];
        require(claimable.length > 0, "CXIP: no tokens to claim");
        uint256 index;
        bool found;
        for (uint256 i = 0; i < claimable.length; i++) {
            if (!found && claimable[i] == tokenId) {
                found = true;
                index = i;
            }
        }
        require(found, "CXIP: token id not in list");
        SNUFFY500(_tokenContract).mint(_owner, tokenId, tokenData, _owner, verification, msg.sender);
        uint256 lastIndex = claimable.length - 1;
        if (index != lastIndex) {
            claimable[index] = claimable[lastIndex];
        }
        delete claimable[lastIndex];
        claimable.pop();
    }

    /**
     * @dev This would get called for when a proof of stake (token holder) is needed for a purchase.
     */
    function proofOfStakeAndMint (Verification calldata proof, uint256 tokens, uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier2, "CXIP: too early to stake");
        require(msg.value >= _tokenBasePrice, "CXIP: payment amount is too low");
        require(!SNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        // need to write a code that will do something here with the funds
        uint256[] storage claimable = _reservedTokens[msg.sender];
        require(claimable.length > 0, "CXIP: no tokens to claim");
        uint256 index;
        bool found;
        for (uint256 i = 0; i < claimable.length; i++) {
            if (!found && claimable[i] == tokenId) {
                found = true;
                index = i;
            }
        }
        require(found, "CXIP: token id not in list");
        SNUFFY500(_tokenContract).mint(_owner, tokenId, tokenData, _owner, verification, msg.sender);
        uint256 lastIndex = claimable.length - 1;
        if (index != lastIndex) {
            claimable[index] = claimable[lastIndex];
        }
        delete claimable[lastIndex];
        claimable.pop();
    }

    /**
     * @dev This would get called for all regular mint purchases.
     */
    function payAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier3, "CXIP: too early to buy");
        require(msg.value >= _tokenBasePrice, "CXIP: payment amount is too low");
        require(!SNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        // need to write a code that will do something here with the funds
        uint256[] storage claimable = _reservedTokens[msg.sender];
        require(claimable.length > 0, "CXIP: no tokens to claim");
        uint256 index;
        bool found;
        for (uint256 i = 0; i < claimable.length; i++) {
            if (!found && claimable[i] == tokenId) {
                found = true;
                index = i;
            }
        }
        require(found, "CXIP: token id not in list");
        SNUFFY500(_tokenContract).mint(_owner, tokenId, tokenData, _owner, verification, msg.sender);
        uint256 lastIndex = claimable.length - 1;
        if (index != lastIndex) {
            claimable[index] = claimable[lastIndex];
        }
        delete claimable[lastIndex];
        claimable.pop();
    }


    /**
     * @dev Array of all token ids in collection.
     */
    uint256[] private _allTokens;

    /**
     * @dev Map of token id to array index of _ownedTokens.
     */
    mapping(uint256 => uint256) private _ownedTokensIndex;

    /**
     * @dev Token id to wallet (owner) address map.
     */
    mapping(uint256 => address) private _tokenOwner;

    /**
     * @dev 1-to-1 map of token id that was assigned an approved operator address.
     */
    mapping(uint256 => address) private _tokenApprovals;

    /**
     * @dev Map of total tokens owner by a specific address.
     */
    mapping(address => uint256) private _ownedTokensCount;

    /**
     * @dev Map of array of token ids owned by a specific address.
     */
    mapping(address => uint256[]) private _ownedTokens;

    /**
     * @notice Map of full operator approval for a particular address.
     * @dev Usually utilised for supporting marketplace proxy wallets.
     */
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    /**
     * @dev Token data mapped by token id.
     */
    mapping(uint256 => TokenData) private _tokenData;

    /**
     * @dev Simple tracker of all minted (not-burned) tokens.
     */
    uint256 private _totalTokens;

    /**
     * @dev Mapping from token id to position in the allTokens array.
     */
    mapping(uint256 => uint256) private _allTokensIndex;

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner(), "CXIP: caller not an owner");
        _;
    }

    /**
     * @notice Shows the interfaces the contracts support
     * @dev Must add new 4 byte interface Ids here to acknowledge support
     * @param interfaceId ERC165 style 4 byte interfaceId.
     * @return bool True if supported.
     */
    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        if (
            interfaceId == 0x01ffc9a7 || // ERC165
            interfaceId == 0x150b7a02    // ERC721TokenReceiver
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @notice Get list of tokens owned by wallet.
     * @param wallet The wallet address to get tokens for.
     * @return uint256[] Returns an array of token ids owned by wallet.
     */
    function tokensOfOwner(address wallet) external view returns (uint256[] memory) {
        return _ownedTokens[wallet];
    }

    /**
     * @notice Transfers ownership of the collection.
     * @dev Can't be the zero address.
     * @param newOwner Address of new owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(!Address.isZero(newOwner), "CXIP: zero address");
        _owner = newOwner;
    }

    /**
     * @notice Get total number of tokens owned by wallet.
     * @dev Used to see total amount of tokens owned by a specific wallet.
     * @param wallet Address for which to get token balance.
     * @return uint256 Returns an integer, representing total amount of tokens held by address.
     */
    function balanceOf(address wallet) public view returns (uint256) {
        require(!Address.isZero(wallet), "CXIP: zero address");
        return _ownedTokensCount[wallet];
    }

    /**
     * @notice Check if the sender is the owner.
     * @dev The owner could also be the admin or identity contract of the owner.
     * @return bool True if owner.
     */
    function isOwner() public view returns (bool) {
        return (msg.sender == _owner || msg.sender == _admin);
    }

    /**
     * @notice Gets the owner's address.
     * @dev _owner is first set in init.
     * @return address Of ower.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @notice Checks who the owner of a token is.
     * @dev The token must exist.
     * @param tokenId The token to look up.
     * @return address Owner of the token.
     */
    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _tokenOwner[tokenId];
        require(!Address.isZero(tokenOwner), "ERC721: token does not exist");
        return tokenOwner;
    }

    /**
     * @notice Get token by index.
     * @dev Used in conjunction with totalSupply function to iterate over all tokens in collection.
     * @param index Index of token in array.
     * @return uint256 Returns the token id of token located at that index.
     */
    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply(), "CXIP: index out of bounds");
        return _allTokens[index];
    }

    /**
     * @notice Get token from wallet by index instead of token id.
     * @dev Helpful for wallet token enumeration where token id info is not yet available. Use in conjunction with balanceOf function.
     * @param wallet Specific address for which to get token for.
     * @param index Index of token in array.
     * @return uint256 Returns the token id of token located at that index in specified wallet.
     */
    function tokenOfOwnerByIndex(
        address wallet,
        uint256 index
    ) public view returns (uint256) {
        require(index < balanceOf(wallet));
        return _ownedTokens[wallet][index];
    }

    /**
     * @notice Total amount of tokens in the collection.
     * @dev Ignores burned tokens.
     * @return uint256 Returns the total number of active (not burned) tokens.
     */
    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    /**
     * @notice Empty function that is triggered by external contract on NFT transfer.
     * @dev We have this blank function in place to make sure that external contract sending in NFTs don't error out.
     * @dev Since it's not being used, the _operator variable is commented out to avoid compiler warnings.
     * @dev Since it's not being used, the _from variable is commented out to avoid compiler warnings.
     * @dev Since it's not being used, the _tokenId variable is commented out to avoid compiler warnings.
     * @dev Since it's not being used, the _data variable is commented out to avoid compiler warnings.
     * @return bytes4 Returns the interfaceId of onERC721Received.
     */
    function onERC721Received(
        address, /*_operator*/
        address, /*_from*/
        uint256, /*_tokenId*/
        bytes calldata /*_data*/
    ) public pure returns (bytes4) {
        return 0x150b7a02;
    }

    /**
     * @dev Add a newly minted token into managed list of tokens.
     * @param to Address of token owner for which to add the token.
     * @param tokenId Id of token to add.
     */
    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        _ownedTokensIndex[tokenId] = _ownedTokensCount[to];
        _ownedTokensCount[to]++;
        _ownedTokens[to].push(tokenId);
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        uint256 lastTokenIndex = _allTokens.length - 1;
        uint256 tokenIndex = _allTokensIndex[tokenId];
        uint256 lastTokenId = _allTokens[lastTokenIndex];
        _allTokens[tokenIndex] = lastTokenId;
        _allTokensIndex[lastTokenId] = tokenIndex;
        delete _allTokensIndex[tokenId];
        delete _allTokens[lastTokenIndex];
        _allTokens.pop();
    }

    /**
     * @dev Remove a token from managed list of tokens.
     * @param from Address of token owner for which to remove the token.
     * @param tokenId Id of token to remove.
     */
    function _removeTokenFromOwnerEnumeration(
        address from,
        uint256 tokenId
    ) private {
        _removeTokenFromAllTokensEnumeration(tokenId);
        _ownedTokensCount[from]--;
        uint256 lastTokenIndex = _ownedTokensCount[from];
        uint256 tokenIndex = _ownedTokensIndex[tokenId];
        if(tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];
            _ownedTokens[from][tokenIndex] = lastTokenId;
            _ownedTokensIndex[lastTokenId] = tokenIndex;
        }
        if(lastTokenIndex == 0) {
            delete _ownedTokens[from];
        } else {
            delete _ownedTokens[from][lastTokenIndex];
            _ownedTokens[from].pop();
        }
    }

}
