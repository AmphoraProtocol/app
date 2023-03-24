import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address, getAddress } from 'viem';
import { viemClient } from '~/App';
import { IERC20Metadata__factory } from '~/chain/newContracts';
import { getStablecoins } from '~/chain/tokens';
import { formatBigInt } from '~/hooks/formatBNWithDecimals';
import { ThunkAPI } from '~/store';
import { Token } from '~/types';

const getStablesData = createAsyncThunk<
  { USDA: Token; SUSD: Token },
  {
    userAddress: string;
  },
  ThunkAPI
>('stablecoin/getStablecoinData', async ({ userAddress }) => {
  let USDA: Token = getStablecoins().USDA!;
  let SUSD: Token = getStablecoins().SUSD!;

  const susdContract = {
    address: SUSD.address as Address,
    abi: IERC20Metadata__factory.abi,
  } as const;

  const usdaContract = {
    address: USDA.address as Address,
    abi: IERC20Metadata__factory.abi,
  } as const;

  const result = await viemClient.multicall({
    contracts: [
      {
        ...susdContract,
        functionName: 'decimals',
      },
      {
        ...susdContract,
        functionName: 'balanceOf',
        args: [getAddress(userAddress)],
      },
      {
        ...usdaContract,
        functionName: 'decimals',
      },
      {
        ...usdaContract,
        functionName: 'balanceOf',
        args: [getAddress(userAddress)],
      },
    ],
  });
  SUSD = {
    ...SUSD,
    wallet_balance: formatBigInt(result[1].result!, result[0].result!).str,
    wallet_amount: result[1].result!.toString(),
  };

  USDA = {
    ...USDA,
    wallet_balance: formatBigInt(result[3].result!, result[2].result!).str,
    wallet_amount: result[3].result!.toString(),
  };

  return { USDA, SUSD };
});

export const StablecoinActions = { getStablesData };
