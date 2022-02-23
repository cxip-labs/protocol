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

import "../struct/InterfaceType.sol";
import "../struct/UriType.sol";

interface ICxipAsset {
    function AddCollection(
        address creator,
        address collection,
        bool fresh
    ) external;

    function AddToken(
        address creator,
        address collection,
        uint256 tokenId,
        bool fresh
    ) external;

    function defaultUriType() external view returns (UriType);

    function getCollectionIdentity(address collection) external view returns (address);

    function getCollectionType(address collection) external view returns (InterfaceType);

    function isCollectionCertified(address collection) external view returns (bool);

    function isCollectionOpen(address collection) external view returns (bool);

    function isCollectionRegistered(address collection) external view returns (bool);

    function isTokenCertified(address collection, uint256 tokenId) external view returns (bool);

    function isTokenRegistered(address collection, uint256 tokenId) external view returns (bool);
}
