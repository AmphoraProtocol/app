import { JsonRpcSigner } from '@ethersproject/providers';
import { Vault__factory } from '../../../chain/contracts/';

export const connectVaultContract = (address: string, signer: JsonRpcSigner) => Vault__factory.connect(address, signer);
