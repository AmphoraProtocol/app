import { JsonRpcSigner } from '@ethersproject/providers';
import connectToGovernorContract from './connectToGovernorContract';

export const castVote = async (id: string, vote: number, signer: JsonRpcSigner) => {
  const contract = connectToGovernorContract(signer);

  return contract.castVote(id, vote);
};
