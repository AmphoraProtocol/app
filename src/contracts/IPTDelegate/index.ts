export * from './delegateUserVotingPower';
export * from './getUserVotingPower';

import { JsonRpcSigner } from '@ethersproject/providers';
import connectIPTDelegateContract from './connectToContract';

export const getUserDelegates = async (currentAccount: string, signer: JsonRpcSigner) => {
  try {
    const IPTDelegateContract = connectIPTDelegateContract(signer);
    return await IPTDelegateContract.delegates(currentAccount);
  } catch (err) {
    throw new Error('Error getting delegates');
  }
};
