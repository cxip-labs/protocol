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
     * @dev A map keeping tally of total numer of tokens purchased by a wallet. Used on drop to enforce tier purchase limits.
     */
    mapping(address => uint256) private _purchasedTokens;

    /**
     * @dev Base purchase price of token in wei.
     */
    uint256 private _tokenBasePrice;

    /**
     * @dev Array of all tokenIds available for minting/purchasing.
     */
    uint256[] private _allTokens;

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

/*

    What we are trying to do

    Tier 1 is open for 24 hours. Limited to specific list of wallets and a specific set of NFTs.
    We need a mapping, where we wallet to token id.

    We need a generic array of all available NFTs. The Tier 1 NFTs are removed from that list.

    When wallet steps in to purchase their specific NFT, they are checked against the list, and if approved, they get the NFT minted. Otherwise they are told that the NFT has already been minted.

    When Tier 1 closes, we need to have a function that can transfer the remaining NFTs back into the list of all available NFT.

*/

    // we have to set separately for gas efficiency
    // uint256[] memory openTokens
    // _allTokens = openTokens;

    constructor (uint256 tokenPrice, address tokenContract, address notary) {
        _admin = tx.origin;
        _owner = tx.origin;
        _tokenBasePrice = tokenPrice;
        _tokenContract = payable(tokenContract);
        _notary = notary;
    }

    function setTierTimes (uint256 tier1, uint256 tier2, uint256 tier3) public onlyOwner {
        require (_tier1 == 0, "CXIP: tier times already set");
        _tier1 = tier1;
        _tier2 = tier2;
        _tier3 = tier3;
    }

    function getTierTimes () public view returns (uint256 tier1, uint256 tier2, uint256 tier3) {
        tier1 = _tier1;
        tier2 = _tier2;
        tier3 = _tier3;
    }

    function setReservedTokens (address[] calldata wallets, uint256[][] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            _reservedTokens[wallets[i]] = tokens[i];
        }
    }

    function setOpenTokens (uint256[] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            _addTokenToEnumeration(tokens[i]);
        }
    }

    function getPrice (uint256/* tokenId*/) public view returns (uint256) {
        return _tokenBasePrice;
    }

    /**
     * @dev This would get called for special reserved tokens. Message sender must be the approved wallet.
     */
    function claimAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier1, "CXIP: too early to claim");
        require(block.timestamp < _tier2, "CXIP: too late to claim");
        require(msg.value >= _tokenBasePrice, "CXIP: payment amount is too low");
        require(!SNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        // need to write a code that will do something here with the funds
        uint256[] storage claimable = _reservedTokens[msg.sender];
        uint256 length = claimable.length;
        require(length > 0, "CXIP: no tokens to claim");
        uint256 index;
        uint256 lastIndex = length - 1;
        if (length == 1) {
            index = lastIndex;
            require(claimable[index] == tokenId, "CXIP: not your token");
        } else {
            bool found;
            for (uint256 i = 0; i < claimable.length; i++) {
                if (!found && claimable[i] == tokenId) {
                    found = true;
                    index = i;
                    break;
                }
            }
            require(found, "CXIP: token id not in list");
            if (index != lastIndex) {
                claimable[index] = claimable[lastIndex];
            }
        }
        delete claimable[lastIndex];
        claimable.pop();
        SNUFFY500(_tokenContract).mint(_owner, tokenId, tokenData, _owner, verification, msg.sender);
    }

    /**
     * @dev This would get called for when a proof of stake (token holder) is needed for a purchase.
     */
    function proofOfStakeAndMint (Verification calldata proof, uint256 tokens, uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier2, "CXIP: too early to stake");
        require(block.timestamp < _tier3, "CXIP: too late to stake");
        require(msg.value >= _tokenBasePrice, "CXIP: payment amount is too low");
        require(!SNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        // need to write a code that will do something here with the funds
        bytes memory encoded = abi.encodePacked(msg.sender, tokens);
        require(Signature.Valid(
            _notary,
            proof.r,
            proof.s,
            proof.v,
            encoded
        ), "CXIP: invalid signature");
        require(_purchasedTokens[msg.sender] < tokens, "CXIP: max allowance reached");
        SNUFFY500(_tokenContract).mint(_owner, tokenId, tokenData, _owner, verification, msg.sender);
        _purchasedTokens[msg.sender] = _purchasedTokens[msg.sender] + 1;
        _removeTokenFromAllTokensEnumeration(tokenId);
    }

    /**
     * @dev This would get called for all regular mint purchases.
     */
    function payAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier3, "CXIP: too early to buy");
        require(msg.value >= _tokenBasePrice, "CXIP: payment amount is too low");
        require(!SNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        // need to write a code that will do something here with the funds
        SNUFFY500(_tokenContract).mint(_owner, tokenId, tokenData, _owner, verification, msg.sender);
        _removeTokenFromAllTokensEnumeration(tokenId);
    }

    /**
     * @notice Can be used to bring logic from other smart contracts in (temporarily).
     * @dev Useful for fixing critical bugs, recovering lost tokens, and reversing accidental payments to contract.
     */
    function delegate (address target, bytes calldata payload) public onlyOwner {
        (bool success, bytes memory data) = target.delegatecall(payload);
        require(success, string(data));
    }

    /**
     * @notice Simple function to accept safe transfers.
     * @dev Token transfers that are related to the _tokenContract are automatically added to _allTokens.
     * @param _operator The address of the smart contract that operates the token.
     * @dev Since it's not being used, the _from variable is commented out to avoid compiler warnings.
     * @dev _tokenId Id of the token being transferred in.
     * @dev Since it's not being used, the _data variable is commented out to avoid compiler warnings.
     * @return bytes4 Returns the interfaceId of onERC721Received.
     */
    function onERC721Received(
        address payable _operator,
        address/* _from*/,
        uint256 _tokenId,
        bytes calldata /*_data*/
    ) public returns (bytes4) {
        if (_operator == _tokenContract) {
            if (SNUFFY500(_operator).ownerOf(_tokenId) == address(this)) {
                _addTokenToEnumeration (_tokenId);
            }
        }
        return 0x150b7a02;
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
     * @notice Transfers ownership of the collection.
     * @dev Can't be the zero address.
     * @param newOwner Address of new owner.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(!Address.isZero(newOwner), "CXIP: zero address");
        _owner = newOwner;
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
     * @notice Total amount of tokens available for sale.
     * @dev Does not specifically reserved tokens.
     * @return uint256 Returns the total number of active (not burned) tokens.
     */
    function totalSupply() public view returns (uint256) {
        return _allTokens.length;
    }

    /**
     * @dev Add a newly added token into managed list of tokens.
     * @param tokenId Id of token to add.
     */
    function _addTokenToEnumeration(uint256 tokenId) private {
        _allTokensIndex[tokenId] = _allTokens.length;
        _allTokens.push(tokenId);
    }

    /**
     * @notice Checks if the token is in our possession.
     * @dev To avoid the possible as unset value issue, we check that returned value actually matches the tokenId.
     * @param tokenId The affected token.
     * @return bool True if it exists.
     */
    function _exists(uint256 tokenId) private view returns (bool) {
        return _allTokens[_allTokensIndex[tokenId]] == tokenId;
    }

    /**
     * @dev Remove a token from managed list of tokens.
     * @param tokenId Id of token to remove.
     */
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

}
