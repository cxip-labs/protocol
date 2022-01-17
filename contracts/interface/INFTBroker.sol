// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

/*

            O
            _
     ---\ _|.|_ /---
      ---|  |  |---
         |_/ \_|
          |   |
          |   |
          |___|
           | |
           / \

       SNUFFY 500

*/

import "../struct/TokenData.sol";
import "../struct/Verification.sol";

interface INFTBroker {

    function buyToken (uint256 tokenId) external payable;

    function claimAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) external;

    function delegateApproved (address target, bytes4 functionHash, bytes calldata payload) external payable;

    function payAndMint (uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) external payable;

    function proofOfStakeAndMint (Verification calldata proof, uint256 tokens, uint256 tokenId, TokenData[] calldata tokenData, Verification calldata verification) external payable;

    function clearReservedTokens (address[] calldata wallets) external;

    function delegate (address target, bytes calldata payload) external;

    function liftPurchaseLimits () external;

    function removeOpenTokens (uint256[] calldata tokens) external;

    function removeReservedTokens (address[] calldata wallets) external;

    function setApprovedFunction (address target, bytes4 functionHash, bool value) external;

    function setNotary (address notary) external;

    function setOpenTokens (uint256[] calldata tokens) external;

    function setPrices (uint256 basePrice, uint256 claimPrice, uint256 stakePrice) external;

    function setPurchaseLimit (uint256 limit) external;

    function setPurchasedTokensAmount (address[] calldata wallets, uint256[] calldata amounts) external;

    function setReservedTokenAmounts (address[] calldata wallets, uint256[] calldata amounts) external;

    function setReservedTokens (address[] calldata wallets, uint256[] calldata tokens) external;

    function setReservedTokensArrays (address[] calldata wallets, uint256[][] calldata tokens) external;

    function setTierTimes (uint256 tier1, uint256 tier2, uint256 tier3) external;

    function setVIPs (address[] calldata wallets) external;

    function transferOwnership(address newOwner) external;

    function withdrawEth () external;

    function delegateApprovedCall (address target, bytes4 functionHash, bytes calldata payload) external returns (bytes memory);

    function onERC721Received(address payable _operator, address _from, uint256 _tokenId, bytes calldata _data) external returns (bytes4);

    function arePurchasesLimited () external view returns (bool);

    function getNotary () external view returns (address);

    function getPrices () external view returns (uint256 basePrice, uint256 claimPrice, uint256 stakePrice);

    function getPurchaseLimit() external view returns (uint256);

    function getPurchasedTokensAmount (address wallet) external view returns (uint256);

    function getReservedTokenAmounts(address wallet) external view returns (uint256);

    function getReservedTokens(address wallet) external view returns (uint256[] memory);

    function getTierTimes () external view returns (uint256 tier1, uint256 tier2, uint256 tier3);

    function isOwner() external view returns (bool);

    function isVIP (address wallet) external view returns (bool);

    function owner() external view returns (address);

    function tokenByIndex(uint256 index) external view returns (uint256);

    function tokensByChunk(uint256 start, uint256 length) external view returns (uint256[] memory tokens);

    function totalSupply() external view returns (uint256);

    function supportsInterface(bytes4 interfaceId) external pure returns (bool);

}
