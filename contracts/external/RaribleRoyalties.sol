// SPDX-License-Identifier: MIT

pragma solidity 0.8.12;

import "../interface/IOwnable.sol";

contract RaribleRoyalties {
    address private _owner;
    mapping(address => address) public royaltiesProviders;

    constructor() {
        _owner = _msgSender();
    }

    function setProviderByToken(address token, address provider) public {
        royaltiesProviders[token] = provider;
    }

    function owner() public view returns (address) {
        return _owner;
    }

    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    function checkOwner(address token) internal view {
        if ((owner() != _msgSender()) && (IOwnable(token).owner() != _msgSender())) {
            revert("Token owner not detected");
        }
    }
}
