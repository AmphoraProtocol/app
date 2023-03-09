import { BigNumber } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';

export interface IfetchVaultOf {
  vaultID: string;
  vaultAddress: string | undefined;
}

const fetchVaultOf = async (currentAccount: string, rolodex: Rolodex): Promise<IfetchVaultOf | null> => {
  try {
    const vaultIDs = await rolodex?.VC?.vaultIDs(currentAccount);
    if (vaultIDs && vaultIDs?.length > 0) {
      const vaultID = BigNumber.from(vaultIDs[0]._hex).toString();
      const vaultAddress = await rolodex?.VC?.vaultAddress(vaultID);

      return { vaultID, vaultAddress };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

export default fetchVaultOf;
