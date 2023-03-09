import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { VotingVaultController__factory } from '../../chain/contracts/factories/lending/VotingVaultController__factory';
import { VOTING_VAULT_CONTROLLER_ADDRESS, ZERO_ADDRESS } from '../../constants';

export const getVotingVaultAddress = async (id: string, signerOrProvider: JsonRpcSigner | JsonRpcProvider) => {
  const VVCContract = VotingVaultController__factory.connect(VOTING_VAULT_CONTROLLER_ADDRESS, signerOrProvider);

  const votingVaultAddress = await VVCContract.votingVaultAddress(Number(id));

  return votingVaultAddress;
};

export const hasVotingVaultAddress = (address: string) => address !== ZERO_ADDRESS;
