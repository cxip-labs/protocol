// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.4;

/*______/\\\\\\\\\__/\\\_______/\\\__/\\\\\\\\\\\__/\\\\\\\\\\\\\___
 _____/\\\////////__\///\\\___/\\\/__\/////\\\///__\/\\\/////////\\\_
  ___/\\\/_____________\///\\\\\\/________\/\\\_____\/\\\_______\/\\\_
   __/\\\_________________\//\\\\__________\/\\\_____\/\\\\\\\\\\\\\/__
    _\/\\\__________________\/\\\\__________\/\\\_____\/\\\/////////____
     _\//\\\_________________/\\\\\\_________\/\\\_____\/\\\_____________
      __\///\\\_____________/\\\////\\\_______\/\\\_____\/\\\_____________
       ____\////\\\\\\\\\__/\\\/___\///\\\__/\\\\\\\\\\\_\/\\\_____________
        _______\/////////__\///_______\///__\///////////__\///____________*/

library SnuffyToken {


/*

    // current hard cap for the states and amount of mutations possible
        uint256 statesLimit = 6;

    // hardware limit of maximum number of mutations possible
        uint256 maxStates = 16;

*/

    /**
     * @dev Gets the configuration for rotation calculations from storage slot.
     * @return interval The number of seconds each rotation is shown for.
     * @return steps Total number of steps for complete rotation. Reverse rotation including.
     * @return halfwayPoint Step at which to reverse the rotation backwards. Must be exactly in the middle.
     */
    function getStatesConfig() internal view returns (uint256 max, uint256 limit, uint256 halfwayPoint) {
        uint48 unpacked;
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.statesConfig')) - 1);
        assembly {
            unpacked := sload(
                /* slot */
                0x320f7df63ad3c1fb03163fc8f47010f96d0a4b028d5ed2c9bdbc6b577caddacf
            )
        }
        interval = uint256(uint16(unpacked >> 32));
        steps = uint256(uint16(unpacked >> 16));
        halfwayPoint = uint256(uint16(unpacked));
    }

    /**
     * @dev Sets the configuration for rotation calculations to storage slot.
     * @param interval The number of seconds each rotation is shown for.
     * @param steps Total number of steps for complete rotation. Reverse rotation including.
     * @param halfwayPoint Step at which to reverse the rotation backwards. Must be exactly in the middle.
     */
    function setRotationConfig(uint256 interval, uint256 steps, uint256 halfwayPoint) internal {
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.statesConfig')) - 1);
        uint256 packed = uint256(interval << 32 | steps << 16 | halfwayPoint);
        assembly {
            sstore(
                /* slot */
                0x320f7df63ad3c1fb03163fc8f47010f96d0a4b028d5ed2c9bdbc6b577caddacf,
                packed
            )
        }
    }

    /**
     * @dev Gets the timestamps for duration of each state from storage slot.
     * @return _timestamps UNIX timestamps for controlling each state's maximum duration.
     */
    function getStateTimestamps() internal view returns (uint256[16] memory _timestamps) {
        uint256 data;
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.stateTimestamps')) - 1);
        assembly {
            data := sload(
                /* slot */
                0xb3272806717bb124fff9d338a5d6ec1182c08fc56784769d91b37c01055db8e2
            )
        }
        for (uint256 i = 0; i < 16; i++) {
            _timestamps[i] = uint256(uint16(data >> (16 * i)));
        }
    }

    /**
     * @dev Sets the timestamps for duration of each state to storage slot.
     * @param _timestamps timestamps for controlling each state's maximum duration.
     */
    function setStateTimestamps(uint256[16] memory _timestamps) internal {
        uint256 packed;
        for (uint256 i = 0; i < 16; i++) {
            packed = packed | _timestamps[i] << (16 * i);
        }
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.stateTimestamps')) - 1);
        assembly {
            sstore(
                /* slot */
                0xb3272806717bb124fff9d338a5d6ec1182c08fc56784769d91b37c01055db8e2,
                packed
            )
        }
    }

    /**
     * @dev Gets the number of tokens needed for a forced mutation from storage slot.
     * @return _limits An array of number of tokens required for a forced mutation.
     */
    function getMutationRequirements() internal view returns (uint256[16] memory _limits) {
        uint256 data;
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.mutationRequirements')) - 1);
        assembly {
            data := sload(
                /* slot */
                0x6ab8a5e4f8314f5c905e9eb234db45800102f76ee29724ea1039076fe1c57441
            )
        }
        for (uint256 i = 0; i < 16; i++) {
            _limits[i] = uint256(uint16(data >> (16 * i)));
        }
    }

    /**
     * @dev Sets the number of tokens needed for a forced mutation to storage slot.
     * @param _limits An array of number of tokens required for a forced mutation.
     */
    function setMutationRequirements(uint256[16] memory _limits) internal {
        uint256 packed;
        for (uint256 i = 0; i < 16; i++) {
            packed = packed | _limits[i] << (16 * i);
        }
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.mutationRequirements')) - 1);
        assembly {
            sstore(
                /* slot */
                0x6ab8a5e4f8314f5c905e9eb234db45800102f76ee29724ea1039076fe1c57441,
                packed
            )
        }
    }

    /**
     * @dev Gets the configuration/mapping for tokenId to stencilid from storage slot.
     * @return state The latest permanent state that the token was transferred with.
     * @return timestamp The UNIX timestamp of when last transfer occurred.
     * @return stencilId Mapping for which stencil the token id was assigned.
     */
    function getTokenData(uint256 tokenId) internal view returns (uint256 state, uint256 timestamp, uint256 stencilId) {
        uint48 unpacked;
        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked("eip1967.CXIP.SnuffyToken.tokenData.", tokenId))) - 1);
        assembly {
            unpacked := sload(slot)
        }
        state = uint256(uint16(unpacked >> 32));
        timestamp = uint256(uint16(unpacked >> 16));
        stencilId = uint256(uint16(unpacked));
    }

    /**
     * @dev Sets the configuration/mapping for tokenId to stencilid to storage slot.
     * @param state The latest permanent state that the token was transferred with.
     * @param timestamp The UNIX timestamp of when last transfer occurred.
     * @param stencilId Mapping for which stencil the token id was assigned.
     */
    function setTokenData(uint256 tokenId, uint256 state, uint256 timestamp, uint256 stencilId) internal {
        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked("eip1967.CXIP.SnuffyToken.tokenData.", tokenId))) - 1);
        uint256 packed = uint256(state << 32 | timestamp << 16 | stencilId);
        assembly {
            sstore(slot, packed)
        }
    }





    /**
     * @dev Gets the timestamp for rotation calculations from storage slot.
     * @return _timestamp UNIX timestamp from which to calculate rotations.
     */
    function getStartTimestamp() internal view returns (uint256 _timestamp) {
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.startTimestamp')) - 1);
        assembly {
            _timestamp := sload(
                /* slot */
                0x38fa0648fc40600e921e87d7da5d00ef6f0ef7324da1460be4f71ea9c20281e8
            )
        }
    }

    /**
     * @dev Sets the timestamp for rotation calculations to storage slot.
     * @param _timestamp UNIX timestamp from which to calculate rotations.
     */
    function setStartTimestamp(uint256 _timestamp) internal {
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.startTimestamp')) - 1);
        assembly {
            sstore(
                /* slot */
                0x38fa0648fc40600e921e87d7da5d00ef6f0ef7324da1460be4f71ea9c20281e8,
                _timestamp
            )
        }
    }

    /**
     * @dev Gets the configuration for rotation calculations from storage slot.
     * @return interval The number of seconds each rotation is shown for.
     * @return steps Total number of steps for complete rotation. Reverse rotation including.
     * @return halfwayPoint Step at which to reverse the rotation backwards. Must be exactly in the middle.
     */
    function getRotationConfig() internal view returns (uint256 interval, uint256 steps, uint256 halfwayPoint) {
        uint48 unpacked;
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.rotationConfig')) - 1);
        assembly {
            unpacked := sload(
                /* slot */
                0x160a343c5d37c6f7a98898ab4dfa8a16ea4ae7d0f75bda8697a9bedd96b49786
            )
        }
        interval = uint256(uint16(unpacked >> 32));
        steps = uint256(uint16(unpacked >> 16));
        halfwayPoint = uint256(uint16(unpacked));
    }
    function getRotationConfig(uint256 index) internal view returns (uint256 interval, uint256 steps, uint256 halfwayPoint) {
        uint48 unpacked;
        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked("eip1967.CXIP.SnuffyToken.rotationConfig.", index))) - 1);
        assembly {
            unpacked := sload(slot)
        }
        interval = uint256(uint16(unpacked >> 32));
        steps = uint256(uint16(unpacked >> 16));
        halfwayPoint = uint256(uint16(unpacked));
    }

    /**
     * @dev Sets the configuration for rotation calculations to storage slot.
     * @param interval The number of seconds each rotation is shown for.
     * @param steps Total number of steps for complete rotation. Reverse rotation including.
     * @param halfwayPoint Step at which to reverse the rotation backwards. Must be exactly in the middle.
     */
    function setRotationConfig(uint256 interval, uint256 steps, uint256 halfwayPoint) internal {
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.rotationConfig')) - 1);
        uint256 packed = uint256(interval << 32 | steps << 16 | halfwayPoint);
        assembly {
            sstore(
                /* slot */
                0x160a343c5d37c6f7a98898ab4dfa8a16ea4ae7d0f75bda8697a9bedd96b49786,
                packed
            )
        }
    }
    function setRotationConfig(uint256 index, uint256 interval, uint256 steps, uint256 halfwayPoint) internal {
        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked("eip1967.CXIP.SnuffyToken.rotationConfig.", index))) - 1);
        uint256 packed = uint256(interval << 32 | steps << 16 | halfwayPoint);
        assembly {
            sstore(slot, packed)
        }
    }

    function calculateRotation(uint256 tokenId, uint256 tokenSeparator) internal view returns (uint256 rotationIndex) {
        uint256 configIndex = (tokenId / tokenSeparator);
        (uint256 interval, uint256 steps, uint256 halfwayPoint) = getRotationConfig(configIndex);
        rotationIndex = ((block.timestamp - getStartTimestamp()) % (interval * steps)) / interval;
        if (rotationIndex > halfwayPoint) {
            rotationIndex = steps - rotationIndex;
        }
       rotationIndex = rotationIndex + ((halfwayPoint + 1) * configIndex);
    }

}
