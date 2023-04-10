import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from 'wagmi';
import { multicall, erc20ABI } from '@wagmi/core';

import { formatBigInt, initializeToken } from '~/utils';
import { ThunkAPI } from '~/store';
import { Token } from '~/types';
import { getConfig } from '~/config';

const getStablesData = createAsyncThunk<
  { USDA: Token; SUSD: Token },
  {
    userAddress: Address;
  },
  ThunkAPI
>('stablecoin/getStablecoinData', async ({ userAddress }) => {
  const {
    USDA_DECIMALS,
    ADDRESSES: { USDA: USDA_ADDRESS, SUSD: SUSD_ADDRESS },
  } = getConfig();

  let USDA: Token = initializeToken({
    name: 'Amphora USD',
    address: USDA_ADDRESS,
    ticker: 'USDA',
    decimals: USDA_DECIMALS,
  });

  let SUSD: Token = initializeToken({
    name: 'Synth sUSD',
    address: SUSD_ADDRESS,
    ticker: 'sUSD',
    decimals: 18,
  });

  const susdContract = {
    address: SUSD.address,
    abi: erc20ABI,
  };

  const usdaContract = {
    address: USDA.address,
    abi: erc20ABI,
  };

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
