import { BigNumber, ethers, constants, utils } from 'ethers';
import { Address } from 'wagmi';
import { multicall } from '@wagmi/core';

import { IUniswapV3Pool__factory } from '~/chain/contracts';
import { getConfig } from '~/config';

export const getPriceForToken = (sqrtPriceX96: BigNumber, isWethToken0: boolean) => {
  const two = constants.Two;
  const numerator = sqrtPriceX96.pow(two);
  const denominator = two.pow(192);
  if (isWethToken0) {
    return constants.WeiPerEther.mul(numerator).div(denominator);
  } else {
    return constants.WeiPerEther.mul(denominator).div(numerator);
  }
};

const getFormattedPrice = (ethPrice: BigNumber, sqrtPriceX96: BigNumber, token0: Address): number => {
  const isWethToken0 = !(token0.toLowerCase() === getConfig().ADDRESSES.WETH.toLowerCase());
  const price = utils.formatUnits(
    ethPrice.mul(getPriceForToken(sqrtPriceX96, isWethToken0)).div(constants.WeiPerEther),
    6,
  );
  return Number.parseFloat(price);
};

export const getRewardPrices = async (
  pools: Address[],
): Promise<{
  crvPrice: number;
  cvxPrice: number;
  amphPrice: number;
}> => {
  try {
    const USDC_ETH_UNISWAP_POOL = '0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640';

    const uniContracts: { address: Address; abi: typeof IUniswapV3Pool__factory.abi; functionName: string }[] = [
      {
        address: USDC_ETH_UNISWAP_POOL,
        abi: IUniswapV3Pool__factory.abi,
        functionName: 'slot0',
      },
      {
        address: USDC_ETH_UNISWAP_POOL,
        abi: IUniswapV3Pool__factory.abi,
        functionName: 'token0',
      },
    ];

    pools.forEach((address) => {
      uniContracts.push(
        {
          address: address,
          abi: IUniswapV3Pool__factory.abi,
          functionName: 'slot0',
        },
        {
          address: address,
          abi: IUniswapV3Pool__factory.abi,
          functionName: 'token0',
        },
      );
    });

    const result: any = await multicall({
      contracts: uniContracts,
    });

    const ethPrice = getPriceForToken(
      result[0].sqrtPriceX96,
      result[1].toLowerCase() === getConfig().ADDRESSES.WETH.toLowerCase(),
    );

    let crvPrice = 0;
    if ((result[2], result[3])) crvPrice = getFormattedPrice(ethPrice, result[2].sqrtPriceX96, result[3]);

    let cvxPrice = 0;
    if ((result[4], result[5])) cvxPrice = getFormattedPrice(ethPrice, result[4].sqrtPriceX96, result[5]);

    let amphPrice = 0;
    if ((result[6], result[7])) amphPrice = getFormattedPrice(ethPrice, result[6].sqrtPriceX96, result[7]);

    return { crvPrice, cvxPrice, amphPrice };
  } catch (error) {
    console.log('Error getting reward prices');
    return { crvPrice: 0, cvxPrice: 0, amphPrice: 0 };
  }
};

export const getTotalAmount = (prices: number[], amounts: number[]) => {
  let total = 0;
  for (let i = 0; i < amounts.length; i++) {
    total += amounts[i] * prices[i];
  }

  return total.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};
