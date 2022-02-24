/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PA1DProxy, PA1DProxyInterface } from "../PA1DProxy";

const _abi = [
  {
    stateMutability: "payable",
    type: "fallback",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060f68061001f6000396000f3fe6080604081905263f2673a1960e01b815260009073dfbb74177c45c82ac06327c204bb5ef2daec57b89063f2673a1990608490602090600481865afa158015604b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190606d91906092565b90503660008037600080366000845af43d6000803e808015608d573d6000f35b3d6000fd5b60006020828403121560a357600080fd5b81516001600160a01b038116811460b957600080fd5b939250505056fea26469706673582212201219f694e2240f967881e20bdf21daef874feb3a5a5cbe8277de842f35ffaa6864736f6c634300080c0033";

type PA1DProxyConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PA1DProxyConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PA1DProxy__factory extends ContractFactory {
  constructor(...args: PA1DProxyConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "PA1DProxy";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PA1DProxy> {
    return super.deploy(overrides || {}) as Promise<PA1DProxy>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): PA1DProxy {
    return super.attach(address) as PA1DProxy;
  }
  connect(signer: Signer): PA1DProxy__factory {
    return super.connect(signer) as PA1DProxy__factory;
  }
  static readonly contractName: "PA1DProxy";
  public readonly contractName: "PA1DProxy";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PA1DProxyInterface {
    return new utils.Interface(_abi) as PA1DProxyInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PA1DProxy {
    return new Contract(address, _abi, signerOrProvider) as PA1DProxy;
  }
}
