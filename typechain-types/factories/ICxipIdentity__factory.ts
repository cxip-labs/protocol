/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ICxipIdentity, ICxipIdentityInterface } from "../ICxipIdentity";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "newWallet",
        type: "address",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "addSignedWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newWallet",
        type: "address",
      },
    ],
    name: "addWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "connectWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "saltHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "collectionCreator",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8",
          },
        ],
        internalType: "struct Verification",
        name: "verification",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "name2",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "symbol",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "royalties",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "bps",
            type: "uint96",
          },
        ],
        internalType: "struct CollectionData",
        name: "collectionData",
        type: "tuple",
      },
      {
        internalType: "bytes32",
        name: "slot",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "bytecode",
        type: "bytes",
      },
    ],
    name: "createCustomERC721Collection",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "saltHash",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "collectionCreator",
        type: "address",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8",
          },
        ],
        internalType: "struct Verification",
        name: "verification",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "name",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "name2",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "symbol",
            type: "bytes32",
          },
          {
            internalType: "address",
            name: "royalties",
            type: "address",
          },
          {
            internalType: "uint96",
            name: "bps",
            type: "uint96",
          },
        ],
        internalType: "struct CollectionData",
        name: "collectionData",
        type: "tuple",
      },
    ],
    name: "createERC721Collection",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "payloadHash",
            type: "bytes32",
          },
          {
            components: [
              {
                internalType: "bytes32",
                name: "r",
                type: "bytes32",
              },
              {
                internalType: "bytes32",
                name: "s",
                type: "bytes32",
              },
              {
                internalType: "uint8",
                name: "v",
                type: "uint8",
              },
            ],
            internalType: "struct Verification",
            name: "payloadSignature",
            type: "tuple",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
          {
            internalType: "bytes32",
            name: "arweave",
            type: "bytes32",
          },
          {
            internalType: "bytes11",
            name: "arweave2",
            type: "bytes11",
          },
          {
            internalType: "bytes32",
            name: "ipfs",
            type: "bytes32",
          },
          {
            internalType: "bytes14",
            name: "ipfs2",
            type: "bytes14",
          },
        ],
        internalType: "struct TokenData",
        name: "tokenData",
        type: "tuple",
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "r",
            type: "bytes32",
          },
          {
            internalType: "bytes32",
            name: "s",
            type: "bytes32",
          },
          {
            internalType: "uint8",
            name: "v",
            type: "uint8",
          },
        ],
        internalType: "struct Verification",
        name: "verification",
        type: "tuple",
      },
    ],
    name: "createERC721Token",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "getAuthorizer",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getCollectionById",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
    ],
    name: "getCollectionType",
    outputs: [
      {
        internalType: "enum InterfaceType",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getWallets",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        internalType: "address",
        name: "secondaryWallet",
        type: "address",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
    ],
    name: "isCollectionCertified",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
    ],
    name: "isCollectionOpen",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
    ],
    name: "isCollectionRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isNew",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isOwner",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isTokenCertified",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "isTokenRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "isWalletRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "length",
        type: "uint256",
      },
    ],
    name: "listCollections",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "wallet",
        type: "address",
      },
    ],
    name: "nextNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCollections",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ICxipIdentity__factory {
  static readonly abi = _abi;
  static createInterface(): ICxipIdentityInterface {
    return new utils.Interface(_abi) as ICxipIdentityInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICxipIdentity {
    return new Contract(address, _abi, signerOrProvider) as ICxipIdentity;
  }
}