import { BigNumber, constants, utils } from 'ethers';
import { Address } from 'wagmi';
import { multicall } from '@wagmi/core';

import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json';
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

const getFormattedPrice = (
  ethPrice: BigNumber,
  sqrtPriceX96: BigNumber,
  token0: Address,
  WETH_ADDRESS: string,
): number => {
  const isWethToken0 = !(token0.toLowerCase() === WETH_ADDRESS);
  const price = utils.formatUnits(
    ethPrice.mul(getPriceForToken(sqrtPriceX96, isWethToken0)).div(constants.WeiPerEther),
    6,
  );
  return Number.parseFloat(price);
};

export const getRewardPrices = async (pools: Address[], chainId: number): Promise<number[]> => {
  try {
    const { WETH, USDC_ETH_UNISWAP_POOL } = getConfig().ADDRESSES[chainId];
    const WETH_ADDRESS = WETH.toLowerCase();

    pools.push(USDC_ETH_UNISWAP_POOL);

    const uniContracts: { address: Address; abi: typeof IUniswapV3Pool.abi; functionName: string }[] = [];

    pools.forEach((address) => {
      uniContracts.push(
        {
          address: address,
          abi: IUniswapV3Pool.abi,
          functionName: 'slot0',
        },
        {
          address: address,
          abi: IUniswapV3Pool.abi,
          functionName: 'token0',
        },
      );
    });

    const result: any = await multicall({
      contracts: uniContracts,
    });

    const ethPrice = getPriceForToken(result[4].sqrtPriceX96, result[5].toLowerCase() === WETH_ADDRESS);

    let crvPrice = 0;
    if ((result[0], result[1])) crvPrice = getFormattedPrice(ethPrice, result[0].sqrtPriceX96, result[1], WETH_ADDRESS);

    let cvxPrice = 0;
    if ((result[2], result[3])) cvxPrice = getFormattedPrice(ethPrice, result[2].sqrtPriceX96, result[3], WETH_ADDRESS);

    const amphPrice = 0;
    // if ((result[4], result[5]))
    //   amphPrice = getFormattedPrice(ethPrice, result[4].sqrtPriceX96, result[5], WETH_ADDRESS);

    return [crvPrice, cvxPrice, amphPrice];
  } catch (error) {
    console.log('Error getting reward prices');
    return [0, 0, 0];
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
