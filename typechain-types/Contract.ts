/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface ContractInterface extends utils.Interface {
  contractName: "Contract";
  functions: {
    "Function(uint256,address)": FunctionFragment;
    "publicStateVariable()": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "Function",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "publicStateVariable",
    values?: undefined
  ): string;

  decodeFunctionResult(functionFragment: "Function", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "publicStateVariable",
    data: BytesLike
  ): Result;

  events: {
    "Event(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Event"): EventFragment;
}

export type EventEvent = TypedEvent<
  [string, string],
  { param1: string; param2: string }
>;

export type EventEventFilter = TypedEventFilter<EventEvent>;

export interface Contract extends BaseContract {
  contractName: "Contract";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: ContractInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    Function(
      id: BigNumberish,
      wallet: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string]>;

    publicStateVariable(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  Function(
    id: BigNumberish,
    wallet: string,
    overrides?: CallOverrides
  ): Promise<[BigNumber, string]>;

  publicStateVariable(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    Function(
      id: BigNumberish,
      wallet: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber, string]>;

    publicStateVariable(overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {
    "Event(address,address)"(
      param1?: string | null,
      param2?: string | null
    ): EventEventFilter;
    Event(param1?: string | null, param2?: string | null): EventEventFilter;
  };

  estimateGas: {
    Function(
      id: BigNumberish,
      wallet: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    publicStateVariable(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    Function(
      id: BigNumberish,
      wallet: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    publicStateVariable(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}