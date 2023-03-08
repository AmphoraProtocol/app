import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { MerkleRedeem__factory } from '../../chain/contracts/factories/IPTsale/MerkleRedeem';
import { MERKLE_REDEEM_ADDRESS } from '../../constants';
import { Claim } from './createClaim';

const claimWeeks = async (address: string, claims: Claim[], providerOrSigner: JsonRpcProvider | JsonRpcSigner) => {
  try {
    const merkleContract = MerkleRedeem__factory.connect(MERKLE_REDEEM_ADDRESS, providerOrSigner);

    const claimAttempt = await merkleContract.claimWeeks(address, claims);

    return claimAttempt;
  } catch (err) {
    console.error(err);
    throw new Error('Error claiming weeks');
  }
};

export default claimWeeks;
