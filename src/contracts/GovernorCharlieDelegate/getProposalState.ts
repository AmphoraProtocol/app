import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumberish } from 'ethers';
import connectToGovernorContract from './connectToGovernorContract';

export const getProposalState = async (
  id: BigNumberish,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
): Promise<number> => {
  const status = await connectToGovernorContract(signerOrProvider).state(id);

  return status;
};
