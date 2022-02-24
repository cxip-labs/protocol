/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PA1D, PA1DInterface } from "../PA1D";

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
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "bps",
        type: "uint256[]",
      },
    ],
    name: "SecondarySaleFees",
    type: "event",
  },
  {
    stateMutability: "nonpayable",
    type: "fallback",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "bidSharesForToken",
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct Zora.Decimal",
            name: "prevOwner",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct Zora.Decimal",
            name: "creator",
            type: "tuple",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "value",
                type: "uint256",
              },
            ],
            internalType: "struct Zora.Decimal",
            name: "owner",
            type: "tuple",
          },
        ],
        internalType: "struct Zora.BidShares",
        name: "bidShares",
        type: "tuple",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "calculateRoyaltyFee",
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
        internalType: "address payable[]",
        name: "addresses",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "bps",
        type: "uint256[]",
      },
    ],
    name: "configurePayouts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getEthPayout",
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
    name: "getFeeBps",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
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
    name: "getFeeRecipients",
    outputs: [
      {
        internalType: "address payable[]",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getFees",
    outputs: [
      {
        internalType: "address payable[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPayoutInfo",
    outputs: [
      {
        internalType: "address payable[]",
        name: "addresses",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "bps",
        type: "uint256[]",
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
    name: "getRoyalties",
    outputs: [
      {
        internalType: "address payable[]",
        name: "",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "slot",
        type: "string",
      },
    ],
    name: "getStorageSlot",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
    ],
    name: "getTokenAddress",
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
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "getTokenPayout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "tokenName",
        type: "string",
      },
    ],
    name: "getTokenPayoutByName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokenAddresses",
        type: "address[]",
      },
    ],
    name: "getTokensPayout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "tokenNames",
        type: "string[]",
      },
    ],
    name: "getTokensPayoutByName",
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
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bp",
        type: "uint256",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "marketContract",
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
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "royaltyInfo",
    outputs: [
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
      {
        internalType: "address payable",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bp",
        type: "uint256",
      },
    ],
    name: "setRoyalties",
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
    stateMutability: "pure",
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
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenCreator",
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
    name: "tokenCreators",
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
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50612418806100206000396000f3fe6080604052600436106101395760003560e01c80639df0d22f116100ab578063c40912361161006f578063c409123614610396578063d5a06d4c14610376578063e0fd045f146103b6578063e2c7f338146103d6578063ea2299f8146103f6578063f9ce05821461041657610140565b80639df0d22f146102ed578063a1794bcd1461030d578063b85ed7e414610329578063b9c4d9fb14610349578063bb3bafd61461037657610140565b806320c60d2a116100fd57806320c60d2a1461020e5780632a55205a1461022e5780633328d2191461025c5780635b10d5361461027c578063860110f51461029c578063990803c3146102ca57610140565b806301ffc9a7146101575780630ebd4c7f1461018c57806312cb4738146101b95780631949ddf3146101ce5780631d03532e146101ee57610140565b3661014057005b34801561014c57600080fd5b5061015561045b565b005b34801561016357600080fd5b50610177610172366004611a31565b610591565b60405190151581526020015b60405180910390f35b34801561019857600080fd5b506101ac6101a7366004611a5b565b6106af565b6040516101839190611aaf565b3480156101c557600080fd5b5061015561074a565b3480156101da57600080fd5b506101556101e9366004611ad7565b61075c565b3480156101fa57600080fd5b50610155610209366004611ba9565b610770565b34801561021a57600080fd5b50610155610229366004611c08565b61089a565b34801561023a57600080fd5b5061024e610249366004611ca6565b6108ab565b604051610183929190611cc8565b34801561026857600080fd5b50610155610277366004611d47565b610915565b34801561028857600080fd5b50610155610297366004611e08565b610a72565b3480156102a857600080fd5b506102bc6102b7366004611eb8565b610c3a565b604051908152602001610183565b3480156102d657600080fd5b506102df610c90565b604051610183929190611f26565b3480156102f957600080fd5b506102bc610308366004611f54565b610cab565b34801561031957600080fd5b50305b6040516101839190611fc5565b34801561033557600080fd5b5061031c610344366004611fd9565b610ce5565b34801561035557600080fd5b50610369610364366004611a5b565b610d11565b6040516101839190612005565b34801561038257600080fd5b506102df610391366004611a5b565b610dd3565b3480156103a257600080fd5b5061031c6103b1366004611ba9565b610f0d565b3480156103c257600080fd5b5061031c6103d1366004611a5b565b610f18565b3480156103e257600080fd5b506101556103f1366004612018565b610f3c565b34801561040257600080fd5b50610155610411366004612018565b6110a3565b34801561042257600080fd5b50610436610431366004611a5b565b6110c7565b6040805182515181526020808401515190820152918101515190820152606001610183565b600073e7f1725e7734ce288f8367e1bb143e90bb3f05126001600160a01b031663b305cff960026040516020016104ad9074656970313936372e435849502e686f74666978657360581b815260150190565b60408051601f19818403018152908290526104c791612080565b602060405180830381855afa1580156104e4573d6000803e3d6000fd5b5050506040513d601f19601f82011682018060405250810190610507919061209c565b6040518263ffffffff1660e01b815260040161052591815260200190565b602060405180830381865afa158015610542573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061056691906120b5565b90503660008037600080366000845af43d6000803e808015610587573d6000f35b3d6000fd5b505050565b600063152a902d60e11b6001600160e01b0319831614806105c25750632dde656160e21b6001600160e01b03198316145b806105dd575063b9c4d9fb60e01b6001600160e01b03198316145b806105f85750635d9dd7eb60e11b6001600160e01b03198316145b8061061357506335681b5360e21b6001600160e01b03198316145b8061062e5750632e17b5f960e21b6001600160e01b03198316145b80610649575063860110f560e01b6001600160e01b03198316145b80610664575063a1794bcd60e01b6001600160e01b03198316145b8061067f575063e0fd045f60e01b6001600160e01b03198316145b8061069a5750637ce702c160e11b6001600160e01b03198316145b156106a757506001919050565b506000919050565b604080516001808252818301909252606091600091906020808301908036833701905050905060006106e084611148565b6001600160a01b0316141561071b576106f7611189565b8160008151811061070a5761070a6120d2565b602002602001018181525050610744565b610724836111ae565b81600081518110610737576107376120d2565b6020026020010181815250505b92915050565b6107526111c4565b61075a611286565b565b6107646111c4565b61076d816113d1565b50565b6107786111c4565b600073e7f1725e7734ce288f8367e1bb143e90bb3f05126001600160a01b03166381d1779c6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156107cc573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107f091906120b5565b6001600160a01b031663c4091236836040518263ffffffff1660e01b815260040161081b91906120e8565b602060405180830381865afa158015610838573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061085c91906120b5565b90506001600160a01b03811661088d5760405162461bcd60e51b81526004016108849061211b565b60405180910390fd5b610896816113d1565b5050565b6108a26111c4565b61076d81611584565b600080806108b885611148565b6001600160a01b031614156108f8576108cf611762565b612710846108db611189565b6108e59190612168565b6108ef9190612187565b9150915061090e565b61090184611148565b612710846108db876111ae565b9250929050565b61091d611787565b6109395760405162461bcd60e51b8152600401610884906121a9565b805182511461098a5760405162461bcd60e51b815260206004820152601f60248201527f504131443a206d6973736d617463686564206172726179206c656e67687473006044820152606401610884565b6000805b83518110156109d0578281815181106109a9576109a96120d2565b6020026020010151826109bc91906121dc565b9150806109c8816121f4565b91505061098e565b508061271014610a225760405162461bcd60e51b815260206004820152601c60248201527f504131443a2062707320646f776e277420657175616c203130303030000000006044820152606401610884565b610a4a837fda9d0b1bc91e594968e30b896be60318d483303fc3ba08af8ac989d483bdd7ca55565b61058c827f7862b872ab9e3483d8176282b22f4ac86ad99c9035b3f794a541d84a66004fa255565b610a7a6111c4565b80516000816001600160401b03811115610a9657610a96611af4565b604051908082528060200260200182016040528015610abf578160200160208202803683370190505b50905060005b82811015610c3057600073e7f1725e7734ce288f8367e1bb143e90bb3f05126001600160a01b03166381d1779c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b4591906120b5565b6001600160a01b031663c4091236868481518110610b6557610b656120d2565b60200260200101516040518263ffffffff1660e01b8152600401610b8991906120e8565b602060405180830381865afa158015610ba6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610bca91906120b5565b90506001600160a01b038116610bf25760405162461bcd60e51b81526004016108849061211b565b80838381518110610c0557610c056120d2565b6001600160a01b03909216602092830291909101909101525080610c28816121f4565b915050610ac5565b5061058c81611584565b600080610c4684611148565b6001600160a01b03161415610c7c5761271082610c61611189565b610c6b9190612168565b610c759190612187565b9050610c89565b61271082610c61856111ae565b9392505050565b606080610c9b6118f7565b9150610ca561191c565b90509091565b600060018383604051602001610cc292919061220f565b6040516020818303038152906040528051906020012060001c610c899190612238565b600080610cf183611148565b90506001600160a01b038116610c8957610d09611762565b915050610744565b60408051600180825281830190925260609160009190602080830190803683370190505090506000610d4284611148565b6001600160a01b03161415610d9157610d59611762565b81600081518110610d6c57610d6c6120d2565b60200260200101906001600160a01b031690816001600160a01b031681525050610744565b610d9a83611148565b81600081518110610dad57610dad6120d2565b60200260200101906001600160a01b031690816001600160a01b03168152505092915050565b60408051600180825281830190925260609182916000916020808301908036833750506040805160018082528183019092529293506000929150602080830190803683370190505090506000610e2886611148565b6001600160a01b03161415610e9e57610e3f611762565b82600081518110610e5257610e526120d2565b60200260200101906001600160a01b031690816001600160a01b031681525050610e7a611189565b81600081518110610e8d57610e8d6120d2565b602002602001018181525050610f03565b610ea785611148565b82600081518110610eba57610eba6120d2565b60200260200101906001600160a01b031690816001600160a01b031681525050610ee3856111ae565b81600081518110610ef657610ef66120d2565b6020026020010181815250505b9094909350915050565b600061074482611941565b600080610f2483611148565b90506001600160a01b03811661074457610c89611762565b610f44611787565b610f605760405162461bcd60e51b8152600401610884906121a9565b82610fba57610f8d827faee4e97c19ce50ea5345ba9751676d533a3a7b99c3568901208f92f9eea6a7f255565b610fb5817ffd198c3b406b2320ea9f4a413c7a69a7592dbfc4175b8c252fec24223e68b72055565b610fce565b610fc48383611957565b610fce8382611997565b604080516001808252818301909252600091602080830190803683370190505090508281600081518110611004576110046120d2565b6001600160a01b0392909216602092830291909101909101526040805160018082528183019092526000918160200160208202803683370190505090508281600081518110611055576110556120d2565b6020026020010181815250507f99aba1d63749cfd5ad1afda7c4663840924d54eb5f005bbbeadedc6ec13674b28583836040516110949392919061224f565b60405180910390a15050505050565b6110ab611787565b61058c5760405162461bcd60e51b8152600401610884906121a9565b6111046040805160808101825260006060820181815282528251602080820185528282528084019190915283519081018452908152909182015290565b8051600090819052604082015181905261111d83611148565b6001600160a01b0316141561113f57611134611189565b602082015152919050565b611134826111ae565b60008060018360405160200161115e91906122b9565b6040516020818303038152906040528051906020012060001c6111819190612238565b549392505050565b7ffd198c3b406b2320ea9f4a413c7a69a7592dbfc4175b8c252fec24223e68b7205490565b60008060018360405160200161115e91906122e2565b6111cc611787565b61075a576000806111db6118f7565b90503360005b825181101561123857816001600160a01b0316838281518110611206576112066120d2565b60200260200101516001600160a01b031614156112265760019350611238565b80611230816121f4565b9150506111e1565b508261058c5760405162461bcd60e51b815260206004820152601b60248201527f504131443a2073656e646572206e6f7420617574686f72697a656400000000006044820152606401610884565b60006112906118f7565b9050600061129c61191c565b82519091506000816112b081615b04612168565b6112ba91906121dc565b9050476127106112ca8383612238565b116113175760405162461bcd60e51b815260206004820181905260248201527f504131443a204e6f7420656e6f7567682045544820746f207472616e736665726044820152606401610884565b6113218282612238565b90506000805b848110156113c85761271083878381518110611345576113456120d2565b60200260200101516113579190612168565b6113619190612187565b9150868181518110611375576113756120d2565b60200260200101516001600160a01b03166108fc839081150290604051600060405180830381858888f193505050501580156113b5573d6000803e3d6000fd5b50806113c0816121f4565b915050611327565b50505050505050565b60006113db6118f7565b905060006113e761191c565b82516040516370a0823160e01b81529192509084906000906001600160a01b038316906370a082319061141e903090600401611fc5565b602060405180830381865afa15801561143b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061145f919061209c565b905061271081116114825760405162461bcd60e51b815260040161088490612305565b6000805b8481101561157a57612710838783815181106114a4576114a46120d2565b60200260200101516114b69190612168565b6114c09190612187565b9150836001600160a01b031663a9059cbb8883815181106114e3576114e36120d2565b6020026020010151846040518363ffffffff1660e01b8152600401611509929190611cc8565b6020604051808303816000875af1158015611528573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061154c9190612348565b6115685760405162461bcd60e51b81526004016108849061236a565b80611572816121f4565b915050611486565b5050505050505050565b600061158e6118f7565b9050600061159a61191c565b905060008080805b86518110156113c8578681815181106115bd576115bd6120d2565b60200260200101519350836001600160a01b03166370a08231306040518263ffffffff1660e01b81526004016115f39190611fc5565b602060405180830381865afa158015611610573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611634919061209c565b925061271083116116575760405162461bcd60e51b815260040161088490612305565b60005b865181101561174f5761271084878381518110611679576116796120d2565b602002602001015161168b9190612168565b6116959190612187565b9250846001600160a01b031663a9059cbb8883815181106116b8576116b86120d2565b6020026020010151856040518363ffffffff1660e01b81526004016116de929190611cc8565b6020604051808303816000875af11580156116fd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117219190612348565b61173d5760405162461bcd60e51b81526004016108849061236a565b80611747816121f4565b91505061165a565b508061175a816121f4565b9150506115a2565b7faee4e97c19ce50ea5345ba9751676d533a3a7b99c3568901208f92f9eea6a7f25490565b600080309050806001600160a01b0316638da5cb5b6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156117cb573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117ef91906120b5565b6001600160a01b0316336001600160a01b031614806118805750806001600160a01b031663f851a4406040518163ffffffff1660e01b8152600401602060405180830381865afa158015611847573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061186b91906120b5565b6001600160a01b0316336001600160a01b0316145b806118f157506118f1816001600160a01b03166336afc6fa6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156118c7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118eb91906120b5565b336119ac565b91505090565b7fda9d0b1bc91e594968e30b896be60318d483303fc3ba08af8ac989d483bdd7ca5490565b7f7862b872ab9e3483d8176282b22f4ac86ad99c9035b3f794a541d84a66004fa25490565b60008060018360405160200161115e91906123a1565b600060018360405160200161196c91906122b9565b6040516020818303038152906040528051906020012060001c61198f9190612238565b919091555050565b600060018360405160200161196c91906122e2565b60006001600160a01b0383166119c457506000610744565b604051637f247e4960e01b81526001600160a01b03841690637f247e49906119f0908590600401611fc5565b602060405180830381865afa158015611a0d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c899190612348565b600060208284031215611a4357600080fd5b81356001600160e01b031981168114610c8957600080fd5b600060208284031215611a6d57600080fd5b5035919050565b600081518084526020808501945080840160005b83811015611aa457815187529582019590820190600101611a88565b509495945050505050565b602081526000610c896020830184611a74565b6001600160a01b038116811461076d57600080fd5b600060208284031215611ae957600080fd5b8135610c8981611ac2565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f191681016001600160401b0381118282101715611b3257611b32611af4565b604052919050565b600082601f830112611b4b57600080fd5b81356001600160401b03811115611b6457611b64611af4565b611b77601f8201601f1916602001611b0a565b818152846020838601011115611b8c57600080fd5b816020850160208301376000918101602001919091529392505050565b600060208284031215611bbb57600080fd5b81356001600160401b03811115611bd157600080fd5b611bdd84828501611b3a565b949350505050565b60006001600160401b03821115611bfe57611bfe611af4565b5060051b60200190565b60006020808385031215611c1b57600080fd5b82356001600160401b03811115611c3157600080fd5b8301601f81018513611c4257600080fd5b8035611c55611c5082611be5565b611b0a565b81815260059190911b82018301908381019087831115611c7457600080fd5b928401925b82841015611c9b578335611c8c81611ac2565b82529284019290840190611c79565b979650505050505050565b60008060408385031215611cb957600080fd5b50508035926020909101359150565b6001600160a01b03929092168252602082015260400190565b600082601f830112611cf257600080fd5b81356020611d02611c5083611be5565b82815260059290921b84018101918181019086841115611d2157600080fd5b8286015b84811015611d3c5780358352918301918301611d25565b509695505050505050565b60008060408385031215611d5a57600080fd5b82356001600160401b0380821115611d7157600080fd5b818501915085601f830112611d8557600080fd5b81356020611d95611c5083611be5565b82815260059290921b84018101918181019089841115611db457600080fd5b948201945b83861015611ddb578535611dcc81611ac2565b82529482019490820190611db9565b96505086013592505080821115611df157600080fd5b50611dfe85828601611ce1565b9150509250929050565b60006020808385031215611e1b57600080fd5b82356001600160401b0380821115611e3257600080fd5b818501915085601f830112611e4657600080fd5b8135611e54611c5082611be5565b81815260059190911b83018401908481019088831115611e7357600080fd5b8585015b83811015611eab57803585811115611e8f5760008081fd5b611e9d8b89838a0101611b3a565b845250918601918601611e77565b5098975050505050505050565b600080600060608486031215611ecd57600080fd5b8335611ed881611ac2565b95602085013595506040909401359392505050565b600081518084526020808501945080840160005b83811015611aa45781516001600160a01b031687529582019590820190600101611f01565b604081526000611f396040830185611eed565b8281036020840152611f4b8185611a74565b95945050505050565b60008060208385031215611f6757600080fd5b82356001600160401b0380821115611f7e57600080fd5b818501915085601f830112611f9257600080fd5b813581811115611fa157600080fd5b866020828501011115611fb357600080fd5b60209290920196919550909350505050565b6001600160a01b0391909116815260200190565b60008060408385031215611fec57600080fd5b8235611ff781611ac2565b946020939093013593505050565b602081526000610c896020830184611eed565b60008060006060848603121561202d57600080fd5b83359250602084013561203f81611ac2565b929592945050506040919091013590565b60005b8381101561206b578181015183820152602001612053565b8381111561207a576000848401525b50505050565b60008251612092818460208701612050565b9190910192915050565b6000602082840312156120ae57600080fd5b5051919050565b6000602082840312156120c757600080fd5b8151610c8981611ac2565b634e487b7160e01b600052603260045260246000fd5b6020815260008251806020840152612107816040850160208701612050565b601f01601f19169190910160400192915050565b6020808252601d908201527f504131443a20546f6b656e2061646472657373206e6f7420666f756e64000000604082015260600190565b634e487b7160e01b600052601160045260246000fd5b600081600019048311821515161561218257612182612152565b500290565b6000826121a457634e487b7160e01b600052601260045260246000fd5b500490565b602080825260199082015278282098a21d1031b0b63632b9103737ba1030b71037bbb732b960391b604082015260600190565b600082198211156121ef576121ef612152565b500190565b600060001982141561220857612208612152565b5060010190565b6c32b4b8189c9b1b97282098a21760991b81528183600d83013760009101600d01908152919050565b60008282101561224a5761224a612152565b500390565b6000606082018583526020606081850152818651808452608086019150828801935060005b818110156122995784516001600160a01b031683529383019391830191600101612274565b505084810360408601526122ad8187611a74565b98975050505050505050565b7432b4b8189c9b1b97282098a2173932b1b2b4bb32b960591b8152601581019190915260350190565b6e0656970313936372e504131442e627608c1b8152600f810191909152602f0190565b60208082526023908201527f504131443a204e6f7420656e6f75676820746f6b656e7320746f207472616e736040820152623332b960e91b606082015260800190565b60006020828403121561235a57600080fd5b81518015158114610c8957600080fd5b6020808252601d908201527f504131443a20436f756c646e2774207472616e7366657220746f6b656e000000604082015260600190565b78656970313936372e504131442e746f6b656e4164647265737360381b8152600082516123d5816019850160208701612050565b919091016019019291505056fea2646970667358221220dcd467de4b409474f601d453a718548ece7a9506f5168208904fc0ec8c6aa47264736f6c634300080c0033";

type PA1DConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PA1DConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PA1D__factory extends ContractFactory {
  constructor(...args: PA1DConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "PA1D";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PA1D> {
    return super.deploy(overrides || {}) as Promise<PA1D>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PA1D {
    return super.attach(address) as PA1D;
  }
  connect(signer: Signer): PA1D__factory {
    return super.connect(signer) as PA1D__factory;
  }
  static readonly contractName: "PA1D";
  public readonly contractName: "PA1D";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PA1DInterface {
    return new utils.Interface(_abi) as PA1DInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): PA1D {
    return new Contract(address, _abi, signerOrProvider) as PA1D;
  }
}