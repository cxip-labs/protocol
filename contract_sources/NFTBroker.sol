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

import "./interface/ISNUFFY500.sol";
import "./library/Address.sol";
import "./library/Signature.sol";
import "./struct/TokenData.sol";
import "./struct/Verification.sol";

/**
 * @title NFT Broker
 * @author CXIP-Labs
 * @notice A simple smart contract for selling NFTs from a private storefront.
 * @dev The entire logic and functionality of the smart contract is self-contained.
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
     * @dev List of all wallets that are tier1.
     */
    mapping(address => bool) private _tier1wallets;

    /**
     * @dev Specific map of what tokenId is allowed to mint for a specific wallet.
     */
    mapping(address => uint256[]) private _reservedTokens;

    /**
     * @dev Specific map of what tokenId is allowed to mint for a specific wallet.
     */
    mapping(address => uint256) private _reservedTokenAmounts;

    /**
     * @dev A map keeping tally of total numer of tokens purchased by a wallet. Used on drop to enforce tier purchase limits.
     */
    mapping(address => uint256) private _purchasedTokens;

    /**
     * @dev Base purchase price of token in wei.
     */
    uint256 private _tokenBasePrice;

    /**
     * @dev Stake purchase price of token in wei.
     */
    uint256 private _tokenStakePrice;

    /**
     * @dev Claim purchase price of token in wei.
     */
    uint256 private _tokenClaimPrice;

    /**
     * @dev Array of all tokenIds available for minting/purchasing.
     */
    uint256[] private _allTokens;

    /**
     * @dev Mapping from token id to position in the allTokens array.
     */
    mapping(uint256 => uint256) private _allTokensIndex;

    bool private _autoWithdraw;

    uint256 private _maxPurchases;

    bool private _reserveLifted;

    mapping(address => mapping(bytes4 => bool)) private _approvedFunctions;

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

    constructor (address tokenContract, address notary, bool autoWithdraw, uint256 maxPurchases, address newOwner) {
        _admin = tx.origin;
        _owner = newOwner;
        _tokenContract = payable(tokenContract);
        _notary = notary;
        _autoWithdraw = autoWithdraw;
        _maxPurchases = maxPurchases;
    }

    function setApprovedFunction (address target, bytes4 functionHash, bool value) public onlyOwner {
        _approvedFunctions[target][functionHash] = value;
    }

    function setNotary (address notary) public onlyOwner {
        _notary = notary;
    }

    function getNotary () public view returns (address) {
        return _notary;
    }

    function setTierTimes (uint256 tier1, uint256 tier2, uint256 tier3) public onlyOwner {
        _tier1 = tier1;
        _tier2 = tier2;
        _tier3 = tier3;
    }

    function getTierTimes () public view returns (uint256 tier1, uint256 tier2, uint256 tier3) {
        tier1 = _tier1;
        tier2 = _tier2;
        tier3 = _tier3;
    }

    function setReservedTokens (address[] calldata wallets, uint256[] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            _reservedTokens[wallets[i]].push (tokens[i]);
        }
    }

    function setReservedTokenAmounts (address[] calldata wallets, uint256[] calldata amounts) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            _reservedTokenAmounts[wallets[i]] = amounts[i];
        }
    }

    function setReservedTokensArrays (address[] calldata wallets, uint256[][] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            _reservedTokens[wallets[i]] = tokens[i];
        }
    }

    function removeReservedTokens (address[] calldata wallets) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            delete _reservedTokens[wallets[i]];
        }
    }

    function liftPurchaseLimits () public onlyOwner {
        _reserveLifted = true;
    }

    function arePurchasesLimited () public view returns (bool) {
        return !_reserveLifted;
    }

    function clearReservedTokens (address[] calldata wallets) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            _reservedTokens[wallets[i]] = new uint256[](0);
        }
    }

    function setOpenTokens (uint256[] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            _addTokenToEnumeration(tokens[i]);
        }
    }

    function removeOpenTokens (uint256[] calldata tokens) public onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            _removeTokenFromAllTokensEnumeration(tokens[i]);
        }
    }

    function withdrawEth () public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getPrices () public view returns (uint256 basePrice, uint256 claimPrice, uint256 stakePrice) {
        basePrice = _tokenBasePrice;
        claimPrice = _tokenClaimPrice;
        stakePrice = _tokenStakePrice;
    }

    function setPrices (uint256 basePrice, uint256 claimPrice, uint256 stakePrice) public onlyOwner {
        _tokenBasePrice = basePrice;
        _tokenClaimPrice = claimPrice;
        _tokenStakePrice = stakePrice;
    }

    function isVIP (address wallet) public view returns (bool) {
        return _tier1wallets[wallet];
    }

    function setVIPs (address[] calldata wallets) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            _tier1wallets[wallets[i]] = true;
        }
    }

    /**
     * @dev This would get called for special reserved tokens. Message sender must be the approved wallet.
     * @dev Important this if claimant is eligible for multiple tokens, start with last one from array.
     */
    function claimAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public {
        require(block.timestamp >= _tier1, "CXIP: too early to claim");
        require(!ISNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        if (_reservedTokenAmounts[msg.sender] > 0) {
            require(_exists(tokenId), "CXIP: token not for sale");
            ISNUFFY500(_tokenContract).mint(0, tokenId, tokenData, _admin, verification, msg.sender);
            _reservedTokenAmounts[msg.sender] = _reservedTokenAmounts[msg.sender] - 1;
            _removeTokenFromAllTokensEnumeration(tokenId);
        } else {
            uint256 length = _reservedTokens[msg.sender].length;
            require(length > 0, "CXIP: no tokens to claim");
            uint256 index = length - 1;
            require(_reservedTokens[msg.sender][index] == tokenId, "CXIP: not your token");
            delete _reservedTokens[msg.sender][index];
            _reservedTokens[msg.sender].pop();
            ISNUFFY500(_tokenContract).mint(1, tokenId, tokenData, _admin, verification, msg.sender);
        }
        if (!_tier1wallets[msg.sender]) {
            _tier1wallets[msg.sender] = true;
        }
        if (_autoWithdraw) {
            _moveEth();
        }
    }

    /**
     * @dev This would get called for when a proof of stake (token holder) is needed for a purchase.
     */
    function proofOfStakeAndMint (Verification calldata proof, uint256 tokens, uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier2, "CXIP: too early to stake");
        if (_purchasedTokens[msg.sender] > 0) {
            require(msg.value >= _tokenStakePrice, "CXIP: payment amount is too low");
        }
        require(!ISNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        require(_exists(tokenId), "CXIP: token not for sale");
        bytes memory encoded = abi.encodePacked(msg.sender, tokens);
        require(Signature.Valid(
            _notary,
            proof.r,
            proof.s,
            proof.v,
            encoded
        ), "CXIP: invalid signature");
        if (!_reserveLifted) {
            require(_purchasedTokens[msg.sender] < _maxPurchases, "CXIP: max allowance reached");
        }
        _purchasedTokens[msg.sender] = _purchasedTokens[msg.sender] + 1;
        ISNUFFY500(_tokenContract).mint(0, tokenId, tokenData, _admin, verification, msg.sender);
        _removeTokenFromAllTokensEnumeration(tokenId);
        if (_autoWithdraw) {
            _moveEth();
        }
    }

    /**
     * @dev This would get called for all regular mint purchases.
     */
    function payAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) public payable {
        require(block.timestamp >= _tier3 || _tier1wallets[msg.sender], "CXIP: too early to buy");
        require(!ISNUFFY500(_tokenContract).exists(tokenId), "CXIP: token snatched");
        require(_exists(tokenId), "CXIP: token not for sale");
        if (_tier1wallets[msg.sender]) {
            if (_purchasedTokens[msg.sender] > 0) {
                require(msg.value >= _tokenClaimPrice, "CXIP: payment amount is too low");
            }
        } else {
            require(msg.value >= _tokenBasePrice, "CXIP: payment amount is too low");
        }
        if (!_reserveLifted) {
            require(_purchasedTokens[msg.sender] < _maxPurchases, "CXIP: max allowance reached");
        }
        _purchasedTokens[msg.sender] = _purchasedTokens[msg.sender] + 1;
        ISNUFFY500(_tokenContract).mint(0, tokenId, tokenData, _admin, verification, msg.sender);
        _removeTokenFromAllTokensEnumeration(tokenId);
        if (_autoWithdraw) {
            _moveEth();
        }
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
     * @notice Can be used to bring logic from other smart contracts in.
     * @dev Requires that the function hash and contract address is pre-approved.
     */
    function delegateApproved (address target, bytes4 functionHash, bytes calldata payload) public payable {
        require(_approvedFunctions[target][functionHash], "CXIP: not approved delegate call");
        (bool success, bytes memory data) = target.delegatecall(abi.encodePacked(functionHash, payload));
        require(success, string(data));
    }

    /**
     * @notice Can be used to bring logic from other smart contracts in.
     * @dev Requires that the function hash and contract address is pre-approved.
     */
    function delegateApprovedCall (address target, bytes4 functionHash, bytes calldata payload) public returns (bytes memory) {
        require(_approvedFunctions[target][functionHash], "CXIP: not approved delegate call");
        (bool success, bytes memory data) = target.delegatecall(abi.encodePacked(functionHash, payload));
        require(success, string(data));
        return data;
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
            if (ISNUFFY500(_operator).ownerOf(_tokenId) == address(this)) {
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

    function getPurchasedTokensAmount (address wallet) public view returns (uint256) {
        return _purchasedTokens[wallet];
    }

    function setPurchasedTokensAmount (address[] calldata wallets, uint256[] calldata amounts) public onlyOwner {
        for (uint256 i = 0; i < wallets.length; i++) {
            _purchasedTokens[wallets[i]] = amounts[i];
        }
    }

    function setPurchaseLimit (uint256 limit) public onlyOwner {
        _maxPurchases = limit;
    }

    function getPurchaseLimit() public view returns (uint256) {
        return _maxPurchases;
    }

    /**
     * @notice Check if there are any tokens specifically reserved for someone.
     * @dev Wallet address can be any wallet.
     * @param wallet Address of the wallet to check.
     */
    function getReservedTokens(address wallet) public view returns (uint256[] memory) {
        return _reservedTokens[wallet];
    }

    function getReservedTokenAmounts(address wallet) public view returns (uint256) {
        return _reservedTokenAmounts[wallet];
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

    function tokensByChunk(uint256 start, uint256 length) public view returns (uint256[] memory tokens) {
        if (start + length > totalSupply()) {
            length = totalSupply() - start;
        }
        tokens = new uint256[](length - start);
        for (uint256 i = 0; i < length; i++) {
            tokens[i] = _allTokens[start + i];
        }
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
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _allTokens[_allTokensIndex[tokenId]] == tokenId;
    }

    function _moveEth() internal {
        uint256 amount = address(this).balance;
        payable(ISNUFFY500(_tokenContract).getIdentity()).transfer(amount);
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
