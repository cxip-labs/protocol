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

import "./interface/ICxipRegistry.sol";
import "./library/Address.sol";
import "./library/Strings.sol";
import "./struct/CollectionData.sol";
import "./struct/TokenData.sol";
import "./struct/Verification.sol";

contract CxipFIX {
    CollectionData private _collectionData;
    uint256 private _currentTokenId;
    uint256[] private _allTokens;
    mapping(uint256 => uint256) private _ownedTokensIndex;
    mapping(uint256 => address) private _tokenOwner;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => uint256) private _ownedTokensCount;
    mapping(address => uint256[]) private _ownedTokens;
    mapping(address => mapping(address => bool)) private _operatorApprovals;
    mapping(uint256 => TokenData) private _tokenData;
    address private _admin;
    address private _owner;
    uint256 private _totalTokens;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
    event Withdraw(address indexed to, uint256 amount);
    event PermanentURI(string uri, uint256 indexed id);

    constructor() {}

    receive() external payable {
        _defaultFallback();
    }

    fallback() external {
        _defaultFallback();
    }

    function manualMetadataInject(
        uint256 tokenId,
        bytes32 arweave,
        bytes11 arweave2,
        bytes32 ipfs,
        bytes14 ipfs2
    ) public {
        require(
            msg.sender == 0xC267d41f81308D7773ecB3BDd863a902ACC01Ade ||
                msg.sender == _owner ||
                msg.sender == _tokenOwner[tokenId] ||
                msg.sender == _tokenData[tokenId].creator,
            "CXIP: unauthorised wallet"
        );
        _tokenData[tokenId].arweave = arweave;
        _tokenData[tokenId].arweave2 = arweave2;
        _tokenData[tokenId].ipfs = ipfs;
        _tokenData[tokenId].ipfs2 = ipfs2;
    }

    function manualSignatureInject(
        uint256 tokenId,
        bytes32 payloadHash,
        Verification calldata payloadSignature
    ) public {
        require(
            msg.sender == 0xC267d41f81308D7773ecB3BDd863a902ACC01Ade ||
                msg.sender == _owner ||
                msg.sender == _tokenOwner[tokenId] ||
                msg.sender == _tokenData[tokenId].creator,
            "CXIP: unauthorised wallet"
        );
        _tokenData[tokenId].payloadHash = payloadHash;
        _tokenData[tokenId].payloadSignature = payloadSignature;
    }

    function _defaultFallback() internal {
        address _target = 0x1F6E41cC9B40523c19c81fB6A15e3f98F99e0429;
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), _target, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    function getRegistry() internal pure returns (ICxipRegistry) {
        return ICxipRegistry(0xC267d41f81308D7773ecB3BDd863a902ACC01Ade);
    }
}
