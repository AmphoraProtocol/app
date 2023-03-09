import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { VotingVaultController__factory } from '../../chain/contracts/factories/lending/VotingVaultController__factory';
import { VOTING_VAULT_CONTROLLER_ADDRESS } from '../../constants';

const mintVotingVaultID = async (id: string, signerOrProvider: JsonRpcSigner | JsonRpcProvider) => {
  const VVCContract = VotingVaultController__factory.connect(VOTING_VAULT_CONTROLLER_ADDRESS, signerOrProvider);

  const mintVaultTransaction = await VVCContract.mintVault(Number(id));

  const mintVaultRecipt = await mintVaultTransaction.wait();

  return mintVaultRecipt;
};

export default mintVotingVaultID;
