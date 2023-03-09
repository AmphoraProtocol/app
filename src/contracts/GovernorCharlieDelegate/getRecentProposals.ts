import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import connectToGovernorContract from './connectToGovernorContract';

export const getRecentProposals = async (signer: JsonRpcSigner, headBlock?: number) => {
  try {
    console.log(signer, 'signer');
    const contract = connectToGovernorContract(signer);
    const filters = contract.filters.ProposalCreated();
    console.log(headBlock, 'headBlock', filters);
    const logs = await contract.queryFilter(filters, undefined, headBlock);
    console.log(logs, 'logs');
    return logs;
  } catch (err) {
    console.error(err);
    throw new Error('error getting proposals');
  }
};
