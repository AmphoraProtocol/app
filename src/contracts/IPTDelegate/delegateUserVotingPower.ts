import { JsonRpcSigner } from '@ethersproject/providers';
import connectIPTDelegateContract from './connectToContract';

export const delegateUserVotingPower = async (delegatee: string, signer: JsonRpcSigner) => {
  try {
    const IPTDelegateContract = connectIPTDelegateContract(signer);

    return await IPTDelegateContract.delegate(delegatee);
  } catch (err) {
    throw new Error('Error delegating IPT');
  }
};
