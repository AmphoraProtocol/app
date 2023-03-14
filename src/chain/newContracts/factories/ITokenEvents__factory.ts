/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type { ITokenEvents, ITokenEventsInterface } from "../ITokenEvents";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
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
        indexed: false,
        internalType: "string",
        name: "_oldName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_newName",
        type: "string",
      },
    ],
    name: "ChangedName",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "_oldSybmol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "_newSybmol",
        type: "string",
      },
    ],
    name: "ChangedSymbol",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_delegator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_fromDelegate",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_toDelegate",
        type: "address",
      },
    ],
    name: "DelegateChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_delegate",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_previousBalance",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_newBalance",
        type: "uint256",
      },
    ],
    name: "DelegateVotesChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_oldMinter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_newMinter",
        type: "address",
      },
    ],
    name: "MinterChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_oldImplementation",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_newImplementation",
        type: "address",
      },
    ],
    name: "NewImplementation",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;

export class ITokenEvents__factory {
  static readonly abi = _abi;
  static createInterface(): ITokenEventsInterface {
    return new utils.Interface(_abi) as ITokenEventsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ITokenEvents {
    return new Contract(address, _abi, signerOrProvider) as ITokenEvents;
  }
}
