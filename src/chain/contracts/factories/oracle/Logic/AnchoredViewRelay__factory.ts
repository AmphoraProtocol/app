/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, BigNumberish, Overrides } from 'ethers';
import type { Provider, TransactionRequest } from '@ethersproject/providers';
import type { AnchoredViewRelay, AnchoredViewRelayInterface } from '../../../oracle/Logic/AnchoredViewRelay';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'anchor_address',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'main_address',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'widthNumerator',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'widthDenominator',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: '_anchorAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_anchorRelay',
    outputs: [
      {
        internalType: 'contract IOracleRelay',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_mainAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_mainRelay',
    outputs: [
      {
        internalType: 'contract IOracleRelay',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_widthDenominator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: '_widthNumerator',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'currentValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

const _bytecode = '';

type AnchoredViewRelayConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: AnchoredViewRelayConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class AnchoredViewRelay__factory extends ContractFactory {
  constructor(...args: AnchoredViewRelayConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    anchor_address: string,
    main_address: string,
    widthNumerator: BigNumberish,
    widthDenominator: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<AnchoredViewRelay> {
    return super.deploy(
      anchor_address,
      main_address,
      widthNumerator,
      widthDenominator,
      overrides || {},
    ) as Promise<AnchoredViewRelay>;
  }
  override getDeployTransaction(
    anchor_address: string,
    main_address: string,
    widthNumerator: BigNumberish,
    widthDenominator: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(anchor_address, main_address, widthNumerator, widthDenominator, overrides || {});
  }
  override attach(address: string): AnchoredViewRelay {
    return super.attach(address) as AnchoredViewRelay;
  }
  override connect(signer: Signer): AnchoredViewRelay__factory {
    return super.connect(signer) as AnchoredViewRelay__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AnchoredViewRelayInterface {
    return new utils.Interface(_abi) as AnchoredViewRelayInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): AnchoredViewRelay {
    return new Contract(address, _abi, signerOrProvider) as AnchoredViewRelay;
  }
}
