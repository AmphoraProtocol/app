import { BigNumberish, BigNumber, utils } from 'ethers';
import { BN } from '~/utils';

export const formatBNWithDecimals = (amount: BigNumber, decimals: number) =>
  Number(utils.formatUnits(amount._hex, decimals));

export const formatBNtoPreciseStringAndNumber = (amount: BigNumberish, decimals: number) => {
  const formatted = utils.formatUnits(amount, decimals);

  return {
    str: formatted,
    num: Number(formatted),
    bn: amount,
  };
};

export const formatBigInt = (amount: bigint | BigNumber, decimals: number) => {
  const formatted = utils.formatUnits(amount.toString(), decimals);

  return {
    str: formatted,
    num: Number(formatted),
    bn: BN(amount.toString()),
  };
};

export const formatNumber = (value: number | undefined) => {
  if (value) {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    return '0';
  }
};

export const formatPercent = (value: BigNumber) => {
  return value.div(1e14).toNumber() / 100;
};
