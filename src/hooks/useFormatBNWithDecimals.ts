import { BigNumber, utils } from 'ethers';

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
