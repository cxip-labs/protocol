// SPDX-License-Identifier: MIT

pragma solidity 0.8.4;

/*

/**
 * @title A title that should describe the library
 * @author CXIP-Labs
 * @notice Explain to an end user what this does
 * @dev Explain to a developer any extra details
 */
library Library {

}

/**
 * @title A title that should describe the interface
 * @author CXIP-Labs
 * @notice Explain to an end user what this does
 * @dev Explain to a developer any extra details
 */
interface Interface {

}

/**
 * @title A title that should describe the contract
 * @author CXIP-Labs
 * @notice Explain to an end user what this does
 * @dev Explain to a developer any extra details
 */
contract Contract {
    /**
     * @notice Explain to an end user what this does
     * @dev Explain to a developer any extra details
     * @param param1 Documents a parameter just like in Doxygen(must be followed by parameter name)
     * @param param2 use one @param row for each parameter
     */
    event Event(address indexed param1, address indexed param2);

    /**
     * @dev Explain to a developer any extra details
     */
    uint256 private stateVariable;

    /**
     * @notice Explain to an end user what this does
     * @dev Explain to a developer any extra details
     * @return Documents the return variables of a contract’s function
     */
    uint256 public publicStateVariable;

    /**
     * @notice Explain to an end user what this does
     * @dev Explain to a developer any extra details
     * @param id Documents a parameter just like in Doxygen(must be followed by parameter name)
     * @param wallet use one @param row for each parameter
     * @return Documents the return variables of a contract’s function
     */
    function Function(uint256 id, address wallet) public pure returns (uint256, address) {
        return (id, wallet);
    }
}
