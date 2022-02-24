/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { CxipRegistry, CxipRegistryInterface } from "../CxipRegistry";

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
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "assetProxy",
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
    name: "assetSigner",
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
    name: "assetSource",
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
    name: "copyrightProxy",
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
    name: "copyrightSource",
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
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "customSources",
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
    name: "erc1155CollectionSource",
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
    name: "erc721CollectionSource",
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
    name: "getAsset",
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
    name: "getAssetSigner",
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
    name: "getAssetSource",
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
    name: "getCopyright",
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
    name: "getCopyrightSource",
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
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
    ],
    name: "getCustomSource",
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
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "getCustomSourceFromString",
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
    name: "getERC1155CollectionSource",
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
    name: "getERC721CollectionSource",
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
    name: "getIdentitySource",
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
    name: "getPA1D",
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
    name: "getPA1DSource",
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
    name: "getProvenance",
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
    name: "getProvenanceSource",
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
    name: "identitySource",
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
    inputs: [],
    name: "pa1dProxy",
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
    name: "pa1dSource",
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
    name: "provenanceProxy",
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
    name: "provenanceSource",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "setAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setAssetSigner",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setAssetSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "setCopyright",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setCopyrightSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setCustomSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setERC1155CollectionSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setERC721CollectionSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setIdentitySource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "setPA1D",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setPA1DSource",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "proxy",
        type: "address",
      },
    ],
    name: "setProvenance",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "source",
        type: "address",
      },
    ],
    name: "setProvenanceSource",
    outputs: [],
    stateMutability: "nonpayable",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3261001f565b610071565b600d80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b610e8b806100806000396000f3fe608060405234801561001057600080fd5b50600436106102695760003560e01c8063a4f0d51d11610151578063d5d644ad116100c3578063ee46699611610087578063ee4669961461054b578063f2673a191461055e578063f2fde38b1461056f578063f58e8f0914610582578063f7f052b914610595578063f88a684c146105a857600080fd5b8063d5d644ad146104f2578063daded79f14610503578063e5add0e014610514578063e60acf2914610527578063edcb13dd1461053857600080fd5b8063b7f2d65e11610115578063b7f2d65e14610482578063b9da967d14610495578063bee1ad4c146104a6578063c028be7d146104b9578063c3b929f7146104cc578063d0d552dd146104df57600080fd5b8063a4f0d51d1461040f578063a64589d114610422578063b305cff914610435578063b3641c481461045e578063b40744181461047157600080fd5b80635b70123c116101ea57806367892b2f116101ae57806367892b2f146103a1578063715018a6146103ca57806381d1779c146103d257806384b6c23b146103e35780638da5cb5b146103f657806390658910146103fe57600080fd5b80635b70123c146103465780635c222bad146103595780635d6bac3a1461036a57806363c430da1461037d57806366d576791461038e57600080fd5b80634b080181116102315780634b080181146102e95780634e67ddf4146102fc5780634edcc1901461030f578063509d33861461032257806358bfd9961461033557600080fd5b80630b1350cf1461026e5780630b3ae6cb1461029d57806338cdbf6e146102b257806338dc9c68146102c557806340fb31d0146102d6575b600080fd5b600254610281906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b6102b06102ab366004610c52565b6105bb565b005b600054610281906001600160a01b031681565b6008546001600160a01b0316610281565b600554610281906001600160a01b031681565b600954610281906001600160a01b031681565b600354610281906001600160a01b031681565b6102b061031d366004610c52565b610615565b600b54610281906001600160a01b031681565b6009546001600160a01b0316610281565b6102b0610354366004610c52565b610666565b6002546001600160a01b0316610281565b6102b0610378366004610c52565b6106b7565b6003546001600160a01b0316610281565b61028161039c366004610d17565b610708565b6102816103af366004610d54565b600c602052600090815260409020546001600160a01b031681565b6102b061079b565b6000546001600160a01b0316610281565b600154610281906001600160a01b031681565b6102816107d6565b6004546001600160a01b0316610281565b600754610281906001600160a01b031681565b6102b0610430366004610c52565b6107e5565b610281610443366004610d54565b6000908152600c60205260409020546001600160a01b031690565b6102b061046c366004610c52565b610836565b600a546001600160a01b0316610281565b6102b0610490366004610d6d565b610887565b6006546001600160a01b0316610281565b6102b06104b4366004610c52565b61095e565b600654610281906001600160a01b031681565b6102b06104da366004610c52565b6109af565b6102b06104ed366004610c52565b610a00565b600b546001600160a01b0316610281565b6005546001600160a01b0316610281565b600854610281906001600160a01b031681565b6007546001600160a01b0316610281565b600a54610281906001600160a01b031681565b6102b0610559366004610c52565b610a51565b6001546001600160a01b0316610281565b6102b061057d366004610c52565b610aa2565b600454610281906001600160a01b031681565b6102b06105a3366004610c52565b610b42565b6102b06105b6366004610c52565b610b93565b336105c46107d6565b6001600160a01b0316146105f35760405162461bcd60e51b81526004016105ea90610dbb565b60405180910390fd5b600880546001600160a01b0319166001600160a01b0392909216919091179055565b3361061e6107d6565b6001600160a01b0316146106445760405162461bcd60e51b81526004016105ea90610dbb565b600a80546001600160a01b0319166001600160a01b0392909216919091179055565b3361066f6107d6565b6001600160a01b0316146106955760405162461bcd60e51b81526004016105ea90610dbb565b600580546001600160a01b0319166001600160a01b0392909216919091179055565b336106c06107d6565b6001600160a01b0316146106e65760405162461bcd60e51b81526004016105ea90610dbb565b600780546001600160a01b0319166001600160a01b0392909216919091179055565b6000600c60006002846040516020016107219190610e20565b60408051601f198184030181529082905261073b91610e20565b602060405180830381855afa158015610758573d6000803e3d6000fd5b5050506040513d601f19601f8201168201806040525081019061077b9190610e3c565b81526020810191909152604001600020546001600160a01b031692915050565b336107a46107d6565b6001600160a01b0316146107ca5760405162461bcd60e51b81526004016105ea90610dbb565b6107d46000610be4565b565b600d546001600160a01b031690565b336107ee6107d6565b6001600160a01b0316146108145760405162461bcd60e51b81526004016105ea90610dbb565b600080546001600160a01b0319166001600160a01b0392909216919091179055565b3361083f6107d6565b6001600160a01b0316146108655760405162461bcd60e51b81526004016105ea90610dbb565b600b80546001600160a01b0319166001600160a01b0392909216919091179055565b336108906107d6565b6001600160a01b0316146108b65760405162461bcd60e51b81526004016105ea90610dbb565b80600c60006002856040516020016108ce9190610e20565b60408051601f19818403018152908290526108e891610e20565b602060405180830381855afa158015610905573d6000803e3d6000fd5b5050506040513d601f19601f820116820180604052508101906109289190610e3c565b815260200190815260200160002060006101000a8154816001600160a01b0302191690836001600160a01b031602179055505050565b336109676107d6565b6001600160a01b03161461098d5760405162461bcd60e51b81526004016105ea90610dbb565b600980546001600160a01b0319166001600160a01b0392909216919091179055565b336109b86107d6565b6001600160a01b0316146109de5760405162461bcd60e51b81526004016105ea90610dbb565b600480546001600160a01b0319166001600160a01b0392909216919091179055565b33610a096107d6565b6001600160a01b031614610a2f5760405162461bcd60e51b81526004016105ea90610dbb565b600280546001600160a01b0319166001600160a01b0392909216919091179055565b33610a5a6107d6565b6001600160a01b031614610a805760405162461bcd60e51b81526004016105ea90610dbb565b600680546001600160a01b0319166001600160a01b0392909216919091179055565b33610aab6107d6565b6001600160a01b031614610ad15760405162461bcd60e51b81526004016105ea90610dbb565b6001600160a01b038116610b365760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b60648201526084016105ea565b610b3f81610be4565b50565b33610b4b6107d6565b6001600160a01b031614610b715760405162461bcd60e51b81526004016105ea90610dbb565b600180546001600160a01b0319166001600160a01b0392909216919091179055565b33610b9c6107d6565b6001600160a01b031614610bc25760405162461bcd60e51b81526004016105ea90610dbb565b600380546001600160a01b0319166001600160a01b0392909216919091179055565b600d80546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b80356001600160a01b0381168114610c4d57600080fd5b919050565b600060208284031215610c6457600080fd5b610c6d82610c36565b9392505050565b634e487b7160e01b600052604160045260246000fd5b600082601f830112610c9b57600080fd5b813567ffffffffffffffff80821115610cb657610cb6610c74565b604051601f8301601f19908116603f01168101908282118183101715610cde57610cde610c74565b81604052838152866020858801011115610cf757600080fd5b836020870160208301376000602085830101528094505050505092915050565b600060208284031215610d2957600080fd5b813567ffffffffffffffff811115610d4057600080fd5b610d4c84828501610c8a565b949350505050565b600060208284031215610d6657600080fd5b5035919050565b60008060408385031215610d8057600080fd5b823567ffffffffffffffff811115610d9757600080fd5b610da385828601610c8a565b925050610db260208401610c36565b90509250929050565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60005b83811015610e0b578181015183820152602001610df3565b83811115610e1a576000848401525b50505050565b60008251610e32818460208701610df0565b9190910192915050565b600060208284031215610e4e57600080fd5b505191905056fea264697066735822122030ddb033f2babe0d19f8c9c7b83cd4e38767e4afb088d4b28dece946bb67331d64736f6c634300080c0033";

type CxipRegistryConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CxipRegistryConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CxipRegistry__factory extends ContractFactory {
  constructor(...args: CxipRegistryConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "CxipRegistry";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<CxipRegistry> {
    return super.deploy(overrides || {}) as Promise<CxipRegistry>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): CxipRegistry {
    return super.attach(address) as CxipRegistry;
  }
  connect(signer: Signer): CxipRegistry__factory {
    return super.connect(signer) as CxipRegistry__factory;
  }
  static readonly contractName: "CxipRegistry";
  public readonly contractName: "CxipRegistry";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CxipRegistryInterface {
    return new utils.Interface(_abi) as CxipRegistryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): CxipRegistry {
    return new Contract(address, _abi, signerOrProvider) as CxipRegistry;
  }
}
