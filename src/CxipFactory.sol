// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

/*______/\\\\\\\\\__/\\\_______/\\\__/\\\\\\\\\\\__/\\\\\\\\\\\\\___
 _____/\\\////////__\///\\\___/\\\/__\/////\\\///__\/\\\/////////\\\_
  ___/\\\/_____________\///\\\\\\/________\/\\\_____\/\\\_______\/\\\_
   __/\\\_________________\//\\\\__________\/\\\_____\/\\\\\\\\\\\\\/__
    _\/\\\__________________\/\\\\__________\/\\\_____\/\\\/////////____
     _\//\\\_________________/\\\\\\_________\/\\\_____\/\\\_____________
      __\///\\\_____________/\\\////\\\_______\/\\\_____\/\\\_____________
       ____\////\\\\\\\\\__/\\\/___\///\\\__/\\\\\\\\\\\_\/\\\_____________
        _______\/////////__\///_______\///__\///////////__\///____________*/

/**
 * @title CXIP Factory
 * @author CXIP-Labs
 * @notice Smart contract for deploying CXIP specific contracts.
 * @dev Custom smart contract to achieve target deployment addresses via salt and create2.
 */
contract CxipFactory {
    /**
     * @dev Address of contract owner. This address can run all onlyOwner functions.
     */
    address private _owner;

    /**
     * @notice Event emitted when a smart contract is deployed.
     * @dev Event used for transparent auditing of all smart contracts deployed for CXIP.
     * @param contractAddress Address of the deployed smart contract.
     * @param salt Salt/hash that was used in conjunction with bytecode for create2.
     */
    event Deployed(address indexed contractAddress, uint256 indexed salt);
    /**
     * @notice Event emitted when contract ownership is transfered to another address.
     * @dev Event used for transparent auditing when another address takes ownership of the contract.
     * @param previousOwner Address of the previous contract owner.
     * @param newOwner Address of the new contract owner.
     */
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @notice Constructor is empty and not utilised.
     * @dev No variables are passed in, owner is set to that of transaction creator.
     */
    constructor() {
        _setOwner(tx.origin);
    }

    /**
     * @notice Get current owner of smart contract.
     * @return address Returns the address of the current contract owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Special modifier to only allow an owner to run a function.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @notice Create a smart contract from the bytecode and salt.
     * @dev You can include constructor arguments at the end of your bytecode.
     * @param code The entire bytecode of the smart contract to create.
     * @param salt A salt/hash to use with create2 to deploy to a specific address.
     */
    function deploy(bytes memory code, uint256 salt) public onlyOwner {
        address addr;
        assembly {
            addr := create2(0, add(code, 0x20), mload(code), salt)
            if iszero(extcodesize(addr)) {
                revert(0, 0)
            }
        }
        emit Deployed(addr, salt);
    }

    /**
     * @notice Remove owner from smart contract.
     * @dev Avoid using this function, unless you will never need to use this smart contract again.
     */
    function renounceOwnership() public onlyOwner {
        _setOwner(address(0));
    }

    /**
     * @notice Transfer ownership of smart contract to another address.
     * @dev This is irreversible, so take great care who you transfer ownership to.
     * @param newOwner Address of the new owner for smart contract.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _setOwner(newOwner);
    }

    /**
     * @dev Internal short-hand function for getting address of caller.
     * @return address Returns the address of contract/wallet that is currently interacting with this smart contract.
     */
    function _msgSender() internal view returns (address) {
        return msg.sender;
    }

    /**
     * @dev Internal function that sets owner of the smart contract. Only used on initialisation.
     */
    function _setOwner(address newOwner) private {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
