import { JsonRpcSigner } from '@ethersproject/providers';
import { Vault__factory } from '../../chain/contracts';

export const delegateVaultVotingPower = async (
  vault_address: string,
  token: string,
  target: string,
  signer: JsonRpcSigner,
) => {
  return Vault__factory.connect(vault_address, signer).delegateCompLikeTo(target, token);
};
