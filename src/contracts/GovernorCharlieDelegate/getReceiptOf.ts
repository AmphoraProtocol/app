import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import connectToGovernorContract from './connectToGovernorContract';

export const getReceiptOf = async (
  proposalId: string,
  userAddress: string,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
) => {
  try {
    const contract = connectToGovernorContract(signerOrProvider);
    const receipt = await contract.getReceipt(proposalId, userAddress);

    return receipt;
  } catch (err) {
    throw new Error('error getting receipt');
  }
};
