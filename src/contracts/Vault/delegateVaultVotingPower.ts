import { JsonRpcSigner } from '@ethersproject/providers';
import { Vault__factory } from '~/chain/contracts/factories';

// TODO: i think we can remove this
export const delegateVaultVotingPower = async (
  vault_address: string,
  token: string,
  target: string,
  signer: JsonRpcSigner,
) => {
  return Vault__factory.connect(vault_address, signer).delegateCompLikeTo(target, token);
};
