import { Address } from 'wagmi';
import { formatNumber } from './format';

export const getRewardAmount = (
  rewards:
    | {
        token: Address;
        amount: string;
        price: number;
      }[]
    | undefined,
): {
  amount: string;
  value: string;
} => {
  let amount = 0;
  let value = 0;
  rewards?.forEach((tokenRewards) => {
    amount += Number.parseFloat(tokenRewards.amount);
    value += tokenRewards.price * Number.parseFloat(tokenRewards.amount);
  });

  return {
    amount: formatNumber(amount),
    value: formatNumber(value),
  };
};

export const getTotalRewardAmount = (
  rewards:
    | {
        token: Address;
        amount: string;
        price: number;
      }[]
    | undefined,
): {
  amount: string;
  value: string;
} => {
  let amount = 0;
  let value = 0;
  rewards?.forEach((tokenRewards) => {
    amount += Number.parseFloat(tokenRewards.amount);
    value += tokenRewards.price * Number.parseFloat(tokenRewards.amount);
  });

  return {
    amount: formatNumber(amount),
    value: formatNumber(value),
  };
};
