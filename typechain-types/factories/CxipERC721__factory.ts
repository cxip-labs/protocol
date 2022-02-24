/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CxipERC721, CxipERC721Interface } from "../CxipERC721";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "wallet",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "uri",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "PermanentURI",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    stateMutability: "nonpayable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "arweaveURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "creator",
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
    ],
    name: "cxipMint",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
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
    inputs: [],
    name: "getIdentity",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "httpURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
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
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ipfsURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
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
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
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
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "payloadHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "payloadSignature",
    outputs: [
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
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "payloadSigner",
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
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "newName",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "newName2",
        type: "bytes32",
      },
    ],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "newSymbol",
        type: "bytes32",
      },
    ],
    name: "setSymbol",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "payload",
        type: "bytes",
      },
    ],
    name: "verifySHA256",
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
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506120e1806100206000396000f3fe6080604052600436106101bd5760003560e01c8063510b5158116100ed578063a546993e11610090578063a546993e1461056f578063ab67aa581461058f578063b0cacd43146105a2578063b88d4fde1461058f578063c87b56dd1461056f578063e8a3d485146105c2578063e985e9c5146105d7578063f2fde38b146105f7578063f95bb91e14610617576101cc565b8063510b51581461021657806351e32024146104b25780636352211e146104d25780636c0360eb146104f25780638da5cb5b146105075780638f32d59b1461052557806395d89b411461053a578063a22cb4651461054f576101cc565b80631a5c7f92116101605780631a5c7f921461034c57806323b872dd1461036c5780632c2dadbc1461037f57806336afc6fa1461041057806342842e0e1461036c57806342966c6814610425578063475a80351461044557806349e65440146104725780634f8baacc14610492576101cc565b806301ffc9a7146101e157806306ce0db81461021657806306fdde031461025c578063081812fc1461027e578063095ea7b3146102b4578063128bfa25146102d4578063150b7a02146102f457806318160ddd1461032d576101cc565b366101cc576101ca610637565b005b3480156101d857600080fd5b506101ca610637565b3480156101ed57600080fd5b506102016101fc3660046117b9565b6106da565b60405190151581526020015b60405180910390f35b34801561022257600080fd5b5061024f6102313660046117e3565b6000908152600c60205260409020600401546001600160a01b031690565b60405161020d91906117fc565b34801561026857600080fd5b50610271610859565b60405161020d919061183c565b34801561028a57600080fd5b5061024f6102993660046117e3565b6000908152600860205260409020546001600160a01b031690565b3480156102c057600080fd5b506101ca6102cf366004611884565b610899565b3480156102e057600080fd5b506101ca6102ef3660046118b0565b61092b565b34801561030057600080fd5b5061032061030f36600461193a565b630a85bd0160e11b95945050505050565b60405161020d91906119ad565b34801561033957600080fd5b50600f545b60405190815260200161020d565b34801561035857600080fd5b506102716103673660046117e3565b610a78565b6101ca61037a3660046119c2565b610af5565b34801561038b57600080fd5b506103eb61039a3660046117e3565b604080516060808201835260008083526020808401829052928401819052938452600c82529282902082519384018352600181015484526002810154918401919091526003015460ff169082015290565b6040805182518152602080840151908201529181015160ff169082015260600161020d565b34801561041c57600080fd5b5061024f610b10565b34801561043157600080fd5b506101ca6104403660046117e3565b610bff565b34801561045157600080fd5b5061033e6104603660046117e3565b6000908152600c602052604090205490565b34801561047e57600080fd5b506101ca61048d3660046117e3565b610d11565b34801561049e57600080fd5b5061033e6104ad366004611a03565b610d3a565b3480156104be57600080fd5b506102716104cd3660046117e3565b610e2a565b3480156104de57600080fd5b5061024f6104ed3660046117e3565b610e4e565b3480156104fe57600080fd5b50610271610ec2565b34801561051357600080fd5b50600e546001600160a01b031661024f565b34801561053157600080fd5b50610201610edd565b34801561054657600080fd5b50610271610f12565b34801561055b57600080fd5b506101ca61056a366004611a3d565b610f22565b34801561057b57600080fd5b5061027161058a3660046117e3565b610faa565b6101ca61059d366004611a8c565b610fdd565b3480156105ae57600080fd5b506102016105bd366004611b6c565b610ffd565b3480156105ce57600080fd5b5061027161105d565b3480156105e357600080fd5b506102016105f2366004611bb8565b611078565b34801561060357600080fd5b506101ca610612366004611be6565b611165565b34801561062357600080fd5b506101ca610632366004611c03565b6111b6565b600073dfbb74177c45c82ac06327c204bb5ef2daec57b86001600160a01b03166381d1779c6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561068b573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106af9190611c25565b90503660008037600080366000845af43d6000803e8080156106d0573d6000f35b3d6000fd5b505050565b60006301ffc9a760e01b6001600160e01b03198316148061070b57506380ac58cd60e01b6001600160e01b03198316145b806107265750635b5e139f60e01b6001600160e01b03198316145b806107415750630a85bd0160e11b6001600160e01b03198316145b8061075c575063e8a3d48560e01b6001600160e01b03198316145b80610844575073dfbb74177c45c82ac06327c204bb5ef2daec57b86001600160a01b03166381d1779c6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156107b4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107d89190611c25565b6001600160a01b03166301ffc9a7836040518263ffffffff1660e01b815260040161080391906119ad565b602060405180830381865afa158015610820573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108449190611c42565b1561085157506001919050565b506000919050565b606061086860008001546111e5565b600154610874906111e5565b604051602001610885929190611c5f565b604051602081830303815290604052905090565b6000818152600760205260409020546001600160a01b0390811690831681148015906108ca57506108ca3383611249565b156106d55760008281526008602052604080822080546001600160a01b0319166001600160a01b0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b600d54610940906001600160a01b03166112b0565b61098d5760405162461bcd60e51b815260206004820152601960248201527810d612540e88185b1c9958591e481a5b9a5d1a585b1a5e9959603a1b60448201526064015b60405180910390fd5b600d80546001600160a01b03199081163317909155600e8054909116301790558060006109ba8282611cd0565b5030905063ea2299f860006109d56080850160608601611be6565b6109e560a0860160808701611d35565b6040516001600160e01b031960e086901b16815260048101939093526001600160a01b0390911660248301526001600160601b03166044820152606401600060405180830381600087803b158015610a3c57600080fd5b505af1158015610a50573d6000803e3d6000fd5b5050600e80546001600160a01b0319166001600160a01b039590951694909417909355505050565b6000818152600c602090815260409182902060078101546008909101549251606093610adf9360909190911b91017568747470733a2f2f697066732e637869702e6465762f60501b815260168101929092526001600160901b031916603682015260440190565b6040516020818303038152906040529050919050565b6106d583838360405180602001604052806000815250610fdd565b600073dfbb74177c45c82ac06327c204bb5ef2daec57b86001600160a01b031663b9da967d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b64573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b889190611c25565b600e546040516309633f5960e31b81526001600160a01b0392831692634b19fac892610bb9929116906004016117fc565b602060405180830381865afa158015610bd6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bfa9190611c25565b905090565b610c093382611249565b15610d0e576000818152600760205260409020546001600160a01b0316610c2f816112b0565b15610c3957600080fd5b610c42826112bd565b60008281526007602052604080822080546001600160a01b0319169055518391906001600160a01b0384169060008051602061208c833981519152908390a46001600f6000828254610c949190611d68565b9091555050506000818152600c60205260408120818155600181018290556002810182905560038101805460ff191690556004810180546001600160a01b0319169055600581018290556006810180546affffffffffffffffffffff19169055600781019190915560080180546001600160701b03191690555b50565b610d19610edd565b610d355760405162461bcd60e51b815260040161098490611d7f565b600255565b6000610d44610edd565b610d605760405162461bcd60e51b815260040161098490611d7f565b82610d8357600160046000828254610d789190611db2565b909155505060045492505b610d9c610d9660a0840160808501611be6565b846112db565b6000838152600c602052604090208290610db68282611e07565b508390507fa109ba539900bf1b633f956d63c96fc89b814c7287f7aa50a9216d0b5565720760a0840135610df060e0860160c08701611ecb565b604051602001610e01929190611ee8565b60408051601f1981840301815290829052610e1b9161183c565b60405180910390a25090919050565b6060610e34610ec2565b610e3d8361135f565b604051602001610adf929190611f24565b6000818152600760205260408120546001600160a01b0316610e6f816112b0565b15610ebc5760405162461bcd60e51b815260206004820152601c60248201527f4552433732313a20746f6b656e20646f6573206e6f74206578697374000000006044820152606401610984565b92915050565b6060610ecd306113b3565b6040516020016108859190611f60565b600e546000906001600160a01b0316331480610f035750600d546001600160a01b031633145b80610bfa5750610bfa336113c7565b6060610bfa6000600201546111e5565b6001600160a01b0382163314610f9e57336000818152600b602090815260408083206001600160a01b03871680855290835292819020805460ff191686151590811790915590519081529192917f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31910160405180910390a35050565b610fa6611f9d565b5050565b6000818152600c602090815260409182902060058101546006909101549251606093610adf9360a89190911b9101611ee8565b610fe73383611249565b15610ff757610ff7848484611458565b50505050565b60008060028484604051611012929190611fb3565b602060405180830381855afa15801561102f573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052508101906110529190611fc3565b909414949350505050565b6060611068306113b3565b6040516020016108859190611fdc565b6001600160a01b038083166000908152600b6020908152604080832093851683529290529081205460ff16806110ca57507372617269626c655472616e7366657250726f78796001600160a01b038316145b8061115e575060405163c455279160e01b81526001600160a01b03831690736f70656e5365615472616e7366657250726f78799063c4552791906111129087906004016117fc565b602060405180830381865afa15801561112f573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111539190611c25565b6001600160a01b0316145b9392505050565b61116d610edd565b6111895760405162461bcd60e51b815260040161098490611d7f565b611192816112b0565b610d0e57600e80546001600160a01b0383166001600160a01b031990911617905550565b6111be610edd565b6111da5760405162461bcd60e51b815260040161098490611d7f565b600091909155600155565b60608160005b811561120a57806111fb81612024565b915050600882901c91506111eb565b6112418460405160200161122091815260200190565b60408051601f1981840301815291905261123b836020611d68565b836114e7565b949350505050565b6000611254826115f4565b61125d57600080fd5b6000828152600760205260409020546001600160a01b039081169084168114806112a057506000838152600860205260409020546001600160a01b038581169116145b8061124157506112418185611078565b6001600160a01b03161590565b600090815260086020526040902080546001600160a01b0319169055565b6112e4826112b0565b806112f357506112f3816115f4565b1561130057611300611f9d565b60008181526007602052604080822080546001600160a01b0319166001600160a01b038616908117909155905183929060008051602061208c833981519152908290a46001600f60008282546113569190611db2565b90915550505050565b6060816113865750506040805180820190915260048152630307830360e41b602082015290565b8160005b81156113a9578061139a81612024565b915050600882901c915061138a565b611241848261161d565b6060610ebc826001600160a01b031661135f565b6000806113d2610b10565b90506113dd816112b0565b156113eb5750600092915050565b604051637f247e4960e01b81526001600160a01b03821690637f247e49906114179086906004016117fc565b602060405180830381865afa158015611434573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061115e9190611c42565b6000818152600760205260409020546001600160a01b0384811691161480156114875750611485826112b0565b155b156114df57611495816112bd565b60008181526007602052604080822080546001600160a01b0319166001600160a01b03868116918217909255915184939187169160008051602061208c83398151915291a4505050565b6106d5611f9d565b6060816114f581601f611db2565b10156115345760405162461bcd60e51b815260206004820152600e60248201526d736c6963655f6f766572666c6f7760901b6044820152606401610984565b61153e8284611db2565b845110156115825760405162461bcd60e51b8152602060048201526011602482015270736c6963655f6f75744f66426f756e647360781b6044820152606401610984565b6060821580156115a157604051915060008252602082016040526115eb565b6040519150601f8416801560200281840101858101878315602002848b0101015b818310156115da5780518352602092830192016115c2565b5050858452601f01601f1916604052505b50949350505050565b6000818152600760205260408120546001600160a01b0316611615816112b0565b159392505050565b6060600061162c83600261203f565b611637906002611db2565b67ffffffffffffffff81111561164f5761164f611a76565b6040519080825280601f01601f191660200182016040528015611679576020820181803683370190505b509050600360fc1b816000815181106116945761169461205e565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106116c3576116c361205e565b60200101906001600160f81b031916908160001a90535060006116e784600261203f565b6116f2906001611db2565b90505b600181111561176a576f181899199a1a9b1b9c1cb0b131b232b360811b85600f16601081106117265761172661205e565b1a60f81b82828151811061173c5761173c61205e565b60200101906001600160f81b031916908160001a90535060049490941c9361176381612074565b90506116f5565b50831561115e5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610984565b6000602082840312156117cb57600080fd5b81356001600160e01b03198116811461115e57600080fd5b6000602082840312156117f557600080fd5b5035919050565b6001600160a01b0391909116815260200190565b60005b8381101561182b578181015183820152602001611813565b83811115610ff75750506000910152565b602081526000825180602084015261185b816040850160208701611810565b601f01601f19169190910160400192915050565b6001600160a01b0381168114610d0e57600080fd5b6000806040838503121561189757600080fd5b82356118a28161186f565b946020939093013593505050565b60008082840360c08112156118c457600080fd5b83356118cf8161186f565b925060a0601f19820112156118e357600080fd5b506020830190509250929050565b60008083601f84011261190357600080fd5b50813567ffffffffffffffff81111561191b57600080fd5b60208301915083602082850101111561193357600080fd5b9250929050565b60008060008060006080868803121561195257600080fd5b853561195d8161186f565b9450602086013561196d8161186f565b935060408601359250606086013567ffffffffffffffff81111561199057600080fd5b61199c888289016118f1565b969995985093965092949392505050565b6001600160e01b031991909116815260200190565b6000806000606084860312156119d757600080fd5b83356119e28161186f565b925060208401356119f28161186f565b929592945050506040919091013590565b600080828403610140811215611a1857600080fd5b83359250610120601f19820112156118e357600080fd5b8015158114610d0e57600080fd5b60008060408385031215611a5057600080fd5b8235611a5b8161186f565b91506020830135611a6b81611a2f565b809150509250929050565b634e487b7160e01b600052604160045260246000fd5b60008060008060808587031215611aa257600080fd5b8435611aad8161186f565b93506020850135611abd8161186f565b925060408501359150606085013567ffffffffffffffff80821115611ae157600080fd5b818701915087601f830112611af557600080fd5b813581811115611b0757611b07611a76565b604051601f8201601f19908116603f01168101908382118183101715611b2f57611b2f611a76565b816040528281528a6020848701011115611b4857600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b600080600060408486031215611b8157600080fd5b83359250602084013567ffffffffffffffff811115611b9f57600080fd5b611bab868287016118f1565b9497909650939450505050565b60008060408385031215611bcb57600080fd5b8235611bd68161186f565b91506020830135611a6b8161186f565b600060208284031215611bf857600080fd5b813561115e8161186f565b60008060408385031215611c1657600080fd5b50508035926020909101359150565b600060208284031215611c3757600080fd5b815161115e8161186f565b600060208284031215611c5457600080fd5b815161115e81611a2f565b60008351611c71818460208801611810565b835190830190611c85818360208801611810565b01949350505050565b60008135610ebc8161186f565b80546001600160a01b0319166001600160a01b0392909216919091179055565b6001600160601b0381168114610d0e57600080fd5b813581556020820135600182015560408201356002820155600381016060830135611cfa8161186f565b611d048183611c9b565b506080830135611d1381611cbb565b81546001600160a01b031660a09190911b6001600160a01b0319161790555050565b600060208284031215611d4757600080fd5b813561115e81611cbb565b634e487b7160e01b600052601160045260246000fd5b600082821015611d7a57611d7a611d52565b500390565b60208082526019908201527821ac24a81d1031b0b63632b9103737ba1030b71037bbb732b960391b604082015260600190565b60008219821115611dc557611dc5611d52565b500190565b6001600160a81b031981168114610d0e57600080fd5b60008135610ebc81611dca565b600081356001600160901b031981168114610ebc57600080fd5b81358155602082013560018201556040820135600282015560038101606083013560ff8116808214611e3857600080fd5b825460ff19161790915550611e5b611e5260808401611c8e565b60048301611c9b565b60a08201356005820155611e93611e7460c08401611de0565b600683018160a81c6affffffffffffffffffffff198254161781555050565b60e08201356007820155610fa6611ead6101008401611ded565b6008830180546001600160701b03191660909290921c919091179055565b600060208284031215611edd57600080fd5b813561115e81611dca565b7868747470733a2f2f617277656176652e637869702e6465762f60381b815260198101929092526001600160a81b031916603982015260440190565b60008351611f36818460208801611810565b602f60f81b9083019081528351611f54816001840160208801611810565b01600101949350505050565b7468747470733a2f2f637869702e6465762f6e66742f60581b815260008251611f90816015850160208701611810565b9190910160150192915050565b634e487b7160e01b600052600160045260246000fd5b8183823760009101908152919050565b600060208284031215611fd557600080fd5b5051919050565b7468747470733a2f2f6e66742e637869702e6465762f60581b81526000825161200c816015850160208701611810565b602f60f81b6015939091019283015250601601919050565b600060001982141561203857612038611d52565b5060010190565b600081600019048311821515161561205957612059611d52565b500290565b634e487b7160e01b600052603260045260246000fd5b60008161208357612083611d52565b50600019019056feddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3efa2646970667358221220178f01cfd436bcb36a965407db13eb986d29a7a374ef44ab1594978c691a7b0364736f6c634300080c0033";

type CxipERC721ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CxipERC721ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CxipERC721__factory extends ContractFactory {
  constructor(...args: CxipERC721ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "CxipERC721";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CxipERC721> {
    return super.deploy(overrides || {}) as Promise<CxipERC721>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CxipERC721 {
    return super.attach(address) as CxipERC721;
  }
  connect(signer: Signer): CxipERC721__factory {
    return super.connect(signer) as CxipERC721__factory;
  }
  static readonly contractName: "CxipERC721";
  public readonly contractName: "CxipERC721";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CxipERC721Interface {
    return new utils.Interface(_abi) as CxipERC721Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CxipERC721 {
    return new Contract(address, _abi, signerOrProvider) as CxipERC721;
  }
}
