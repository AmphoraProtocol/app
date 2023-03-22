import { JsonRpcSigner } from '@ethersproject/providers';
import { ContractTransaction, utils } from 'ethers';

import { Rolodex } from '~/chain/rolodex/rolodex';
import { USDA_DECIMALS } from '~/constants';

export const repayUsda = (
  vaultID: number,
  amount: string,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => {
  const formattedUSDAAmount = utils.parseUnits(amount, USDA_DECIMALS);
  try {
    return rolodex.VC!.connect(signer).repayUSDA(vaultID, formattedUSDAAmount);
  } catch (err) {
    throw new Error('Could not repay:' + err);
  }
};

export const repayAllUsda = (
  vaultID: number,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => {
  try {
    return rolodex.VC!.connect(signer).repayAllUSDA(vaultID);
  } catch (err) {
    throw new Error('Could not repay:' + err);
  }
};
