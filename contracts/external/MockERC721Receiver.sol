// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

import "../interface/IERC165.sol";
import "../interface/IERC721Receiver.sol";

contract MockERC721Receiver is IERC165, IERC721Receiver {

    bool private _works;

    constructor () {
        _works = true;
    }

    function toggleWorks(bool active) external {
        _works = active;
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        if (interfaceID == 0x01ffc9a7 || interfaceID == 0x150b7a02) {
            return true;
        } else {
            return false;
        }
    }

    function onERC721Received(
        address /*operator*/,
        address /*from*/,
        uint256 /*tokenId*/,
        bytes calldata /*data*/
    ) external view returns (bytes4) {
        if (_works) {
            return 0x150b7a02;
        } else {
            return 0x00000000;
        }
    }

}
