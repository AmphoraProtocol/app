import { BigNumber, utils } from 'ethers';
import { BN } from '~/easy/bn';

export const useFormatBNWithDecimals = (amount: BigNumber, decimals: number) =>
  Number(utils.formatUnits(amount._hex, decimals));

export const useFormatBNtoPreciseStringAndNumber = (amount: BigNumber, decimals: number) => {
  const formatted = utils.formatUnits(amount, decimals);

  return {
    str: formatted,
    num: Number(formatted),
    bn: amount,
  };
};

export const useFormatBigInt = (amount: bigint, decimals: number) => {
  const formatted = utils.formatUnits(amount.toString(), decimals);

  return {
    str: formatted,
    num: Number(formatted),
    bn: BN(amount.toString()),
  };
};
