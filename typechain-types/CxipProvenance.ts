/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result, EventFragment } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export type VerificationStruct = {
  r: BytesLike;
  s: BytesLike;
  v: BigNumberish;
};

export type VerificationStructOutput = [string, string, number] & {
  r: string;
  s: string;
  v: number;
};

export interface CxipProvenanceInterface extends utils.Interface {
  contractName: "CxipProvenance";
  functions: {
    "createIdentity(bytes32,address,(bytes32,bytes32,uint8))": FunctionFragment;
    "getIdentity()": FunctionFragment;
    "getWalletIdentity(address)": FunctionFragment;
    "informAboutNewWallet(address)": FunctionFragment;
    "isIdentityBlacklisted(address)": FunctionFragment;
    "isIdentityValid(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createIdentity",
    values: [BytesLike, string, VerificationStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "getIdentity",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getWalletIdentity",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "informAboutNewWallet",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isIdentityBlacklisted",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isIdentityValid",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "createIdentity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getIdentity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWalletIdentity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "informAboutNewWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isIdentityBlacklisted",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isIdentityValid",
    data: BytesLike
  ): Result;

  events: {
    "IdentityBlacklisted(address,string)": EventFragment;
    "IdentityCreated(address)": EventFragment;
    "IdentityWalletAdded(address,address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "IdentityBlacklisted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IdentityCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "IdentityWalletAdded"): EventFragment;
}

export type IdentityBlacklistedEvent = TypedEvent<
  [string, string],
  { identityAddress: string; reason: string }
>;

export type IdentityBlacklistedEventFilter =
  TypedEventFilter<IdentityBlacklistedEvent>;

export type IdentityCreatedEvent = TypedEvent<
  [string],
  { identityAddress: string }
>;

export type IdentityCreatedEventFilter = TypedEventFilter<IdentityCreatedEvent>;

export type IdentityWalletAddedEvent = TypedEvent<
  [string, string, string],
  { identityAddress: string; initiatingWallet: string; newWallet: string }
>;

export type IdentityWalletAddedEventFilter =
  TypedEventFilter<IdentityWalletAddedEvent>;

export interface CxipProvenance extends BaseContract {
  contractName: "CxipProvenance";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: CxipProvenanceInterface;

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
    createIdentity(
      saltHash: BytesLike,
      secondaryWallet: string,
      verification: VerificationStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getIdentity(overrides?: CallOverrides): Promise<[string]>;

    getWalletIdentity(
      wallet: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    informAboutNewWallet(
      newWallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    isIdentityBlacklisted(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    isIdentityValid(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;
  };

  createIdentity(
    saltHash: BytesLike,
    secondaryWallet: string,
    verification: VerificationStruct,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getIdentity(overrides?: CallOverrides): Promise<string>;

  getWalletIdentity(wallet: string, overrides?: CallOverrides): Promise<string>;

  informAboutNewWallet(
    newWallet: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  isIdentityBlacklisted(
    identityAddress: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  isIdentityValid(
    identityAddress: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  callStatic: {
    createIdentity(
      saltHash: BytesLike,
      secondaryWallet: string,
      verification: VerificationStruct,
      overrides?: CallOverrides
    ): Promise<void>;

    getIdentity(overrides?: CallOverrides): Promise<string>;

    getWalletIdentity(
      wallet: string,
      overrides?: CallOverrides
    ): Promise<string>;

    informAboutNewWallet(
      newWallet: string,
      overrides?: CallOverrides
    ): Promise<void>;

    isIdentityBlacklisted(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    isIdentityValid(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<boolean>;
  };

  filters: {
    "IdentityBlacklisted(address,string)"(
      identityAddress?: string | null,
      reason?: null
    ): IdentityBlacklistedEventFilter;
    IdentityBlacklisted(
      identityAddress?: string | null,
      reason?: null
    ): IdentityBlacklistedEventFilter;

    "IdentityCreated(address)"(
      identityAddress?: string | null
    ): IdentityCreatedEventFilter;
    IdentityCreated(
      identityAddress?: string | null
    ): IdentityCreatedEventFilter;

    "IdentityWalletAdded(address,address,address)"(
      identityAddress?: string | null,
      initiatingWallet?: string | null,
      newWallet?: string | null
    ): IdentityWalletAddedEventFilter;
    IdentityWalletAdded(
      identityAddress?: string | null,
      initiatingWallet?: string | null,
      newWallet?: string | null
    ): IdentityWalletAddedEventFilter;
  };

  estimateGas: {
    createIdentity(
      saltHash: BytesLike,
      secondaryWallet: string,
      verification: VerificationStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getIdentity(overrides?: CallOverrides): Promise<BigNumber>;

    getWalletIdentity(
      wallet: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    informAboutNewWallet(
      newWallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    isIdentityBlacklisted(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isIdentityValid(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createIdentity(
      saltHash: BytesLike,
      secondaryWallet: string,
      verification: VerificationStruct,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getIdentity(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getWalletIdentity(
      wallet: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    informAboutNewWallet(
      newWallet: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    isIdentityBlacklisted(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isIdentityValid(
      identityAddress: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}