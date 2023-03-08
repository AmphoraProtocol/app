import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import getSlowRollContract from './getSlowRollContract';

export type sop = JsonRpcSigner | JsonRpcProvider;

export const commitUSDC = async (amount: BigNumber, signer: JsonRpcSigner) =>
  await getSlowRollContract(signer).getPoints(amount);

export const getBasePrice = async (signer: sop): Promise<number> =>
  (await getSlowRollContract(signer)._startPrice()).div(1000000).toNumber();

export const getEndTime = async (signer: sop) => await getSlowRollContract(signer)._endTime();

export const getAmountIPTForSale = async (signer: sop) => {
  const slowRollContract = getSlowRollContract(signer);

  const soldQuantity = await slowRollContract._soldQuantity();

  const maxQuantity = await slowRollContract._maxQuantity();

  return { maxQuantity, soldQuantity };
};

export const getCurrentPrice = async (signer: sop) => {
  const currentPrice = await getSlowRollContract(signer).getCurrentPrice();

  return currentPrice;
};
