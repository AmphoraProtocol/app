import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, BigNumberish } from 'ethers';
import connectToGovernorContract from './connectToGovernorContract';

export interface ProposalInfo {
  id: BigNumber;
  proposer: string;
  eta: BigNumber;
  startBlock: BigNumber;
  endBlock: BigNumber;
  forVotes: BigNumber;
  againstVotes: BigNumber;
  abstainVotes: BigNumber;
  canceled: boolean;
  executed: boolean;
  emergency: boolean;
  quorumVotes: BigNumber;
  delay: BigNumber;
}

export const getProposalInfo = async (
  id: BigNumberish,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
): Promise<ProposalInfo> => {
  return await connectToGovernorContract(signerOrProvider).proposals(id);
};
