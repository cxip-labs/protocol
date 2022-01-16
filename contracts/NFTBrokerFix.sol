// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

contract NFTBrokerFix {

    constructor () {}

    function setStorageSlot (bytes32 slot, bytes32 data) public {
        assembly {
            sstore(slot, data)
        }
    }

    function setStorageSlots (bytes32[] calldata slots, bytes32[] calldata dataArray) public {
        for (uint256 i = 0; i < slots.length; i++) {
            bytes32 slot = slots[i];
            bytes32 data = dataArray[i];
            assembly {
                sstore(slot, data)
            }
        }
    }

}
