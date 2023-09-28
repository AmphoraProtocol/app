import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from 'wagmi';
import { multicall, erc20ABI } from '@wagmi/core';

import { formatBigInt, initializeToken } from '~/utils';
import { ThunkAPI } from '~/store';
import { Token } from '~/types';
import { getConfig } from '~/config';

const getStablesData = createAsyncThunk<
  { USDA: Token; SUSD: Token; wUSDA: Token },
  {
    userAddress: Address;
    chainId: number;
  },
  ThunkAPI
>('stablecoin/getStablecoinData', async ({ userAddress, chainId }) => {
  const { USDA: USDA_ADDRESS, SUSD: SUSD_ADDRESS, WUSDA: WUSDA_ADDRESS } = getConfig().ADDRESSES[chainId];
  const { USDA_DECIMALS, WUSDA_DECIMALS } = getConfig();

  let USDA: Token = initializeToken({
    name: 'Amphora USD',
    address: USDA_ADDRESS,
    ticker: 'USDA',
    decimals: USDA_DECIMALS,
  });

  let wUSDA: Token = initializeToken({
    name: 'Wrapped USDA',
    address: WUSDA_ADDRESS,
    ticker: 'wUSDA',
    decimals: WUSDA_DECIMALS,
  });

  let SUSD: Token = initializeToken({
    name: 'Synth sUSD',
    address: SUSD_ADDRESS,
    ticker: 'sUSD',
    decimals: 18,
  });

  const [balanceOfSUSD, balanceOfUSDA, balanceOfWUsda] = await multicall({
    contracts: [
      {
        address: SUSD.address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      },

      {
        address: USDA.address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      },

      {
        address: wUSDA.address,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      },
    ],
  });
  SUSD = {
    ...SUSD,
    wallet_balance: formatBigInt(balanceOfSUSD, SUSD.decimals).str,
    wallet_amount: balanceOfSUSD.toString(),
  };

  USDA = {
    ...USDA,
    wallet_balance: formatBigInt(balanceOfUSDA, USDA.decimals).str,
    wallet_amount: balanceOfUSDA.toString(),
  };

  wUSDA = {
    ...wUSDA,
    wallet_balance: formatBigInt(balanceOfWUsda, wUSDA.decimals).str,
    wallet_amount: balanceOfWUsda.toString(),
  };

  return { USDA, SUSD, wUSDA };
});

export const StablecoinActions = { getStablesData };
