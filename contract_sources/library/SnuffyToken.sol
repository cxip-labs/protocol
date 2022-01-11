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
        uint256 maxStates = 8;

*/

    /**
     * @notice Gets the configs for each state.
     * @dev Currently only max and limit are being utilised. Four more future values are reserved for later use.
     * @return max maximum number of token states ever possible.
     * @return limit currently imposed hardcap/limit of token states.
     * @return future0 reserved for a future value.
     * @return future1 reserved for a future value.
     * @return future2 reserved for a future value.
     * @return future3 reserved for a future value.
     */
    function getStatesConfig() internal view returns (uint256 max, uint256 limit, uint256 future0, uint256 future1, uint256 future2, uint256 future3) {
        uint256 unpacked;
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.statesConfig')) - 1);
        assembly {
            unpacked := sload(
                /* slot */
                0x320f7df63ad3c1fb03163fc8f47010f96d0a4b028d5ed2c9bdbc6b577caddacf
            )
        }
        max = uint256(uint32(unpacked >> 0));
        limit = uint256(uint32(unpacked >> 32));
        future0 = uint256(uint32(unpacked >> 64));
        future1 = uint256(uint32(unpacked >> 96));
        future2 = uint256(uint32(unpacked >> 128));
        future3 = uint256(uint32(unpacked >> 160));
    }

    /**
     * @notice Sets the configs for each state.
     * @dev Currently only max and limit are being utilised. Four more future values are reserved for later use.
     * @param max maximum number of token states ever possible.
     * @param limit currently imposed hardcap/limit of token states.
     * @param future0 reserved for a future value.
     * @param future1 reserved for a future value.
     * @param future2 reserved for a future value.
     * @param future3 reserved for a future value.
     */
    function setStatesConfig(uint256 max, uint256 limit, uint256 future0, uint256 future1, uint256 future2, uint256 future3) internal {
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.statesConfig')) - 1);
        uint256 packed;
        packed = packed | max << 0;
        packed = packed | limit << 32;
        packed = packed | future0 << 64;
        packed = packed | future1 << 96;
        packed = packed | future2 << 128;
        packed = packed | future3 << 160;
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
    function getStateTimestamps() internal view returns (uint256[8] memory _timestamps) {
        uint256 data;
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.stateTimestamps')) - 1);
        assembly {
            data := sload(
                /* slot */
                0xb3272806717bb124fff9d338a5d6ec1182c08fc56784769d91b37c01055db8e2
            )
        }
        for (uint256 i = 0; i < 8; i++) {
            _timestamps[i] = uint256(uint32(data >> (32 * i)));
        }
    }

    /**
     * @dev Sets the timestamps for duration of each state to storage slot.
     * @param _timestamps timestamps for controlling each state's maximum duration.
     */
    function setStateTimestamps(uint256[8] memory _timestamps) internal {
        uint256 packed;
        for (uint256 i = 0; i < 8; i++) {
            packed = packed | _timestamps[i] << (32 * i);
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
    function getMutationRequirements() internal view returns (uint256[8] memory _limits) {
        uint256 data;
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.mutationRequirements')) - 1);
        assembly {
            data := sload(
                /* slot */
                0x6ab8a5e4f8314f5c905e9eb234db45800102f76ee29724ea1039076fe1c57441
            )
        }
        for (uint256 i = 0; i < 8; i++) {
            _limits[i] = uint256(uint32(data >> (32 * i)));
        }
    }

    /**
     * @dev Sets the number of tokens needed for a forced mutation to storage slot.
     * @param _limits An array of number of tokens required for a forced mutation.
     */
    function setMutationRequirements(uint256[8] memory _limits) internal {
        uint256 packed;
        for (uint256 i = 0; i < 8; i++) {
            packed = packed | _limits[i] << (32 * i);
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
     * @dev Gets the authorised broker from storage slot.
     * @return broker Address of authorised broker.
     */
    function getBroker() internal view returns (address broker) {
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.broker')) - 1);
        assembly {
            broker := sload(
                /* slot */
                0x71ad4b54125645bc093479b790dba1d002be6ff1fc59f46b726e598257e1e3c1
            )
        }
    }

    /**
     * @dev Sets authorised broker to storage slot.
     * @param broker Address of authorised broker.
     */
    function setBroker(address broker) internal {
        // The slot hash has been precomputed for gas optimizaion
        // bytes32 slot = bytes32(uint256(keccak256('eip1967.CXIP.SnuffyToken.broker')) - 1);
        assembly {
            sstore(
                /* slot */
                0x71ad4b54125645bc093479b790dba1d002be6ff1fc59f46b726e598257e1e3c1,
                broker
            )
        }
    }

    /**
     * @dev Gets the configuration/mapping for tokenId to stencilId from storage slot.
     * @return state The latest permanent state that the token was transferred with.
     * @return timestamp The UNIX timestamp of when last transfer occurred.
     * @return stencilId Mapping for which stencil the token id was assigned.
     */
    function getTokenData(uint256 tokenId) internal view returns (uint256 state, uint256 timestamp, uint256 stencilId) {
        uint256 unpacked;
        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked("eip1967.CXIP.SnuffyToken.tokenData.", tokenId))) - 1);
        assembly {
            unpacked := sload(slot)
        }
        state = uint256(uint32(unpacked >> 0));
        timestamp = uint256(uint32(unpacked >> 32));
        stencilId = uint256(uint32(unpacked >> 64));
    }

    /**
     * @dev Sets the configuration/mapping for tokenId to stencilId to storage slot.
     * @param state The latest permanent state that the token was transferred with.
     * @param timestamp The UNIX timestamp of when last transfer occurred.
     * @param stencilId Mapping for which stencil the token id was assigned.
     */
    function setTokenData(uint256 tokenId, uint256 state, uint256 timestamp, uint256 stencilId) internal {
        bytes32 slot = bytes32(uint256(keccak256(abi.encodePacked("eip1967.CXIP.SnuffyToken.tokenData.", tokenId))) - 1);
        uint256 packed;
        packed = packed | state << 0;
        packed = packed | timestamp << 32;
        packed = packed | stencilId << 64;
        assembly {
            sstore(slot, packed)
        }
    }

    function calculateState(uint256 tokenId) internal view returns (uint256 dataIndex) {
        (uint256 max,/* uint256 limit*/,/* uint256 future0*/,/* uint256 future1*/,/* uint256 future2*/,/* uint256 future3*/) = getStatesConfig();
        (/*uint256 state*/,/* uint256 timestamp*/, uint256 stencilId) = getTokenData(tokenId);
        dataIndex = max * stencilId;
        return dataIndex + getTokenState(tokenId);
    }

    function getTokenState(uint256 tokenId) internal view returns (uint256 dataIndex) {
        (/*uint256 max*/, uint256 limit,/* uint256 future0*/,/* uint256 future1*/,/* uint256 future2*/,/* uint256 future3*/) = getStatesConfig();
        (uint256[8] memory _timestamps) = getStateTimestamps();
        (uint256 state, uint256 timestamp,/* uint256 stencilId*/) = getTokenData(tokenId);
        uint256 duration = block.timestamp - timestamp;
        for (uint256 i = state; i < limit; i++) {
            if (duration < _timestamps[i]) {
                return i;
            }
            duration -= _timestamps[i];
        }
        return limit - 1;
    }
//
//     function calculateRotation(uint256 tokenId, uint256 tokenSeparator) internal view returns (uint256 rotationIndex) {
//         uint256 configIndex = (tokenId / tokenSeparator);
//         (uint256 interval, uint256 steps, uint256 halfwayPoint) = getRotationConfig(configIndex);
//         rotationIndex = ((block.timestamp - getStartTimestamp()) % (interval * steps)) / interval;
//         if (rotationIndex > halfwayPoint) {
//             rotationIndex = steps - rotationIndex;
//         }
//        rotationIndex = rotationIndex + ((halfwayPoint + 1) * configIndex);
//     }

}
