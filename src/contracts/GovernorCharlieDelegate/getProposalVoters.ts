import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumberish } from 'ethers';
import { VoteCastEventObject } from '../../chain/contracts/GovernorBravoEvents';
import connectToGovernorContract from './connectToGovernorContract';

export const getProposalVoters = async (
  id: BigNumberish,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
): Promise<VoteCastEventObject[]> => {
  const contract = connectToGovernorContract(signerOrProvider);

  const log = await contract.queryFilter(contract.filters.VoteCast(undefined), undefined, undefined);
  return log
    .filter((x) => {
      return x.args.proposalId.eq(id);
    })
    .map((x) => {
      return {
        ...x.args,
      };
    });
};
