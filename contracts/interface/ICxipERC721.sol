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

import "../struct/CollectionData.sol";
import "../struct/TokenData.sol";
import "../struct/Verification.sol";

interface ICxipERC721 {
    function arweaveURI(uint256 tokenId) external view returns (string memory);

    function contractURI() external view returns (string memory);

    function creator(uint256 tokenId) external view returns (address);

    function httpURI(uint256 tokenId) external view returns (string memory);

    function ipfsURI(uint256 tokenId) external view returns (string memory);

    function name() external view returns (string memory);

    function payloadHash(uint256 tokenId) external view returns (bytes32);

    function payloadSignature(uint256 tokenId) external view returns (Verification memory);

    function payloadSigner(uint256 tokenId) external view returns (address);

    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function symbol() external view returns (string memory);

    function tokenURI(uint256 tokenId) external view returns (string memory);

    function tokensOfOwner(address wallet) external view returns (uint256[] memory);

    function verifySHA256(bytes32 hash, bytes calldata payload) external pure returns (bool);

    function approve(address to, uint256 tokenId) external;

    function burn(uint256 tokenId) external;

    function init(address newOwner, CollectionData calldata collectionData) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external payable;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) external payable;

    function setApprovalForAll(address to, bool approved) external;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external payable;

    function transferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) external payable;

    function cxipMint(uint256 id, TokenData calldata tokenData) external returns (uint256);

    function setApprovalForAll(
        address from,
        address to,
        bool approved
    ) external;

    function setName(bytes32 newName, bytes32 newName2) external;

    function setSymbol(bytes32 newSymbol) external;

    function transferOwnership(address newOwner) external;

    function balanceOf(address wallet) external view returns (uint256);

    function baseURI() external view returns (string memory);

    function getApproved(uint256 tokenId) external view returns (address);

    function isApprovedForAll(address wallet, address operator) external view returns (bool);

    function isOwner() external view returns (bool);

    function isOwner(address wallet) external view returns (bool);

    function owner() external view returns (address);

    function ownerOf(uint256 tokenId) external view returns (address);

    function tokenByIndex(uint256 index) external view returns (uint256);

    function tokenOfOwnerByIndex(address wallet, uint256 index) external view returns (uint256);

    function totalSupply() external view returns (uint256);

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4);
}
