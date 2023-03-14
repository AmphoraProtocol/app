import { JsonRpcSigner } from '@ethersproject/providers';
import { IVault__factory } from '~/chain/newContracts';

export const connectVaultContract = (address: string, signer: JsonRpcSigner) =>
  IVault__factory.connect(address, signer);
