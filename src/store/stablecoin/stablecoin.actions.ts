import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from 'wagmi';
import { multicall, erc20ABI } from '@wagmi/core';

import { getStablecoins, formatBigInt } from '~/utils';
import { ThunkAPI } from '~/store';
import { Token } from '~/types';

const getStablesData = createAsyncThunk<
  { USDA: Token; SUSD: Token },
  {
    userAddress: Address;
  },
  ThunkAPI
>('stablecoin/getStablecoinData', async ({ userAddress }) => {
  let USDA: Token = getStablecoins().USDA!;
  let SUSD: Token = getStablecoins().SUSD!;

  const susdContract = {
    address: SUSD.address as Address,
    abi: erc20ABI,
  } as const;

  const usdaContract = {
    address: USDA.address as Address,
    abi: erc20ABI,
  } as const;

  const result = await multicall({
    contracts: [
      {
        ...susdContract,
        functionName: 'decimals',
      },
      {
        ...susdContract,
        functionName: 'balanceOf',
        args: [userAddress],
      },
      {
        ...usdaContract,
        functionName: 'decimals',
      },
      {
        ...usdaContract,
        functionName: 'balanceOf',
        args: [userAddress],
      },
    ],
  });
  SUSD = {
    ...SUSD,
    wallet_balance: formatBigInt(result[1], result[0]).str,
    wallet_amount: result[1].toString(),
  };

  USDA = {
    ...USDA,
    wallet_balance: formatBigInt(result[3], result[2]).str,
    wallet_amount: result[3].toString(),
  };

  return { USDA, SUSD };
});

export const StablecoinActions = { getStablesData };
