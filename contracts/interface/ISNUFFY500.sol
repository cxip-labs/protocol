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

interface ISNUFFY500 {

    function mint(uint256 state, uint256 tokenId, TokenData[] memory tokenData, address signer, Verification memory verification, address recipient) external;

    function safeTransferFrom(address from, address to, uint256 tokenId) external;

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) external;

    function balanceOf(address wallet) external view returns (uint256);

    function exists(uint256 tokenId) external view returns (bool);

    function getIdentity() external view returns (address);

    function ownerOf(uint256 tokenId) external view returns (address);

}
