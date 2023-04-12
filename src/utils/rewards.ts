import { Address } from 'wagmi';
import { Token } from '~/types';

export const getRewardAmount = (
  rewards:
    | {
        token: Address;
        amount: string;
        price: number;
      }[]
    | undefined,
): {
  amount: number;
  value: number;
} => {
  let amount = 0;
  let value = 0;
  rewards?.forEach((tokenRewards) => {
    amount += Number.parseFloat(tokenRewards.amount);
    value += tokenRewards.price * Number.parseFloat(tokenRewards.amount);
  });

  return {
    amount: amount,
    value: value,
  };
};

export const getTotalRewardValue = (assets: {
  [key: string]: Token;
}): {
  value: number;
} => {
  let totalValue = 0;
  const assetesArray = Object.entries(assets);

  assetesArray.forEach((element) => {
    if (element[1].claimable_rewards) {
      totalValue += getRewardAmount(element[1].claimable_rewards).value;
    }
  });
  return {
    value: totalValue,
  };
};
