import { JsonRpcSigner } from '@ethersproject/providers';
import { ContractTransaction, utils } from 'ethers';

import { Rolodex } from '~/chain/rolodex/rolodex';
import { USDA_DECIMALS } from '~/constants';

export const borrowUsda = async (
  vaultID: number,
  amount: string,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => {
  const formattedUSDAAmount = utils.parseUnits(amount, USDA_DECIMALS);

  try {
    const VC = rolodex.VC!.connect(signer);

    return await VC.borrowUSDA(vaultID.toString(), formattedUSDAAmount.toString());
  } catch (err) {
    throw new Error('Could not borrow');
  }
};
