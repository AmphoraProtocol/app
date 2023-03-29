import { BigNumber } from 'ethers';
import { BN } from '../../utils/bn';

export const hasSUSDAllowance = async (amount: string | BigNumber, allowance: BigNumber, decimals: number) => {
  if (allowance !== undefined) {
    let susdBN: BigNumber;
    if (typeof amount === 'string') {
      susdBN = BN(amount).mul(BN('1e' + decimals));
    } else {
      susdBN = amount;
    }

    return allowance.gte(susdBN);
  }
  return false;
};
