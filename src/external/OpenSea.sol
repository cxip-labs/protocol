// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

contract OpenSeaOwnableDelegateProxy {}

contract OpenSeaProxyRegistry {
    mapping(address => OpenSeaOwnableDelegateProxy) public proxies;
}
