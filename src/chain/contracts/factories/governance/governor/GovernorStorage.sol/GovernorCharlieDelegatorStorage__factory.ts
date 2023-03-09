/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import type { Provider, TransactionRequest } from '@ethersproject/providers';
import type {
  GovernorCharlieDelegatorStorage,
  GovernorCharlieDelegatorStorageInterface,
} from '../../../../governance/governor/GovernorStorage.sol/GovernorCharlieDelegatorStorage';

const _abi = [
  {
    inputs: [],
    name: 'implementation',
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
];

const _bytecode =
  '0x6080604052348015600f57600080fd5b5060918061001e6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80635c60da1b14602d575b600080fd5b600054603f906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f3fea264697066735822122025b7e38ff67edff05e36e3606d255d78b7cb8a9ad7a1f9467c5f5c6b4cd4eea964736f6c63430008090033';

type GovernorCharlieDelegatorStorageConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: GovernorCharlieDelegatorStorageConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class GovernorCharlieDelegatorStorage__factory extends ContractFactory {
  constructor(...args: GovernorCharlieDelegatorStorageConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<GovernorCharlieDelegatorStorage> {
    return super.deploy(overrides || {}) as Promise<GovernorCharlieDelegatorStorage>;
  }
  override getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): GovernorCharlieDelegatorStorage {
    return super.attach(address) as GovernorCharlieDelegatorStorage;
  }
  override connect(signer: Signer): GovernorCharlieDelegatorStorage__factory {
    return super.connect(signer) as GovernorCharlieDelegatorStorage__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): GovernorCharlieDelegatorStorageInterface {
    return new utils.Interface(_abi) as GovernorCharlieDelegatorStorageInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): GovernorCharlieDelegatorStorage {
    return new Contract(address, _abi, signerOrProvider) as GovernorCharlieDelegatorStorage;
  }
}
