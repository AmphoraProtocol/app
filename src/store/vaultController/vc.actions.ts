import { createAsyncThunk } from '@reduxjs/toolkit';
import { constants } from 'ethers';
import { Address } from 'wagmi';
import { multicall } from '@wagmi/core';

import {
  ICurveMaster__factory,
  IERC20Metadata__factory,
  IUSDA__factory,
  IVaultController__factory,
} from '~/chain/contracts';
import { getStablecoins, BNtoHexNumber, BN, BNtoDec, round } from '~/utils';
import { ThunkAPI } from '~/store';
import { Token, UserVault } from '~/types';
import { getConfig } from '~/config';

const getVCData = createAsyncThunk<
  {
    depositAPR: number | undefined;
    borrowAPR: number | undefined;
    usdaSupply: number;
    totalSUSDDeposited: number;
    reserveRatio: number;
    userVault: UserVault;
  },
  {
    userAddress: Address | undefined;
  },
  ThunkAPI
>('vaultController/getVCData', async ({ userAddress }) => {
  const { ZERO_ADDRESS, VAULT_CONTROLLER_ADDRESS, CURVE_MASTER_ADDRESS } = getConfig().ADDRESSES;
  const USDA: Token = getStablecoins().USDA;
  const SUSD: Token = getStablecoins().SUSD;

  const susdContract = {
    address: SUSD.address as Address,
    abi: IERC20Metadata__factory.abi,
  } as const;

  const usdaContract = {
    address: USDA.address as Address,
    abi: IUSDA__factory.abi,
  } as const;

  const curveContract = {
    address: CURVE_MASTER_ADDRESS,
    abi: ICurveMaster__factory.abi,
  };

  const vcContract = {
    address: VAULT_CONTROLLER_ADDRESS,
    abi: IVaultController__factory.abi,
  };

  const firstCall = await multicall({
    contracts: [
      {
        ...susdContract,
        functionName: 'balanceOf',
        args: [usdaContract.address] as [Address],
      },
      {
        ...usdaContract,
        functionName: 'totalSupply',
      },
      {
        ...usdaContract,
        functionName: 'reserveRatio',
      },
      {
        ...vcContract,
        functionName: 'vaultIDs',
        args: [userAddress || ZERO_ADDRESS] as [Address],
      },
    ],
  });

  const ratioResult = await multicall({
    contracts: [
      {
        ...curveContract,
        functionName: 'getValueAt',
        args: [ZERO_ADDRESS, firstCall[2]],
      },
      {
        ...vcContract,
        functionName: 'vaultAddress',
        args: [firstCall[3][0]],
      },
      {
        ...vcContract,
        functionName: 'vaultSummaries',
        args: [firstCall[3][0], firstCall[3][0]],
      },
    ],
  });

  const ratio = firstCall[2];
  const ratioDec = ratio.div(1e14).toNumber() / 1e4;
  const apr = ratioResult[0];

  const susdDeposited = firstCall[0].div(constants.WeiPerEther).toLocaleString();
  const usdaSupply = firstCall[1].div(1e9).div(1e9).toString();
  const toPercentage = BNtoHexNumber(firstCall[2]) / 1e16;
  const reserveRatio = toPercentage.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let borrowAPR: number | undefined;
  let depositAPR: number | undefined;
  if (apr) {
    borrowAPR = apr.div(BN('1e14')).toNumber() / 100;
    depositAPR = round(borrowAPR * (1 - ratioDec) * 0.85, 3);
  }

  let vaultID: number | undefined;
  if (firstCall[3] && firstCall[3][0]) {
    vaultID = Number.parseInt(firstCall[3][0].toString());
  }

  let vaultAddress: Address | undefined;
  if (ratioResult[1]) {
    vaultAddress = ratioResult[1];
  }

  let tokenAddresses: Address[] | undefined;
  let borrowingPower = 0;
  let accountLiability = 0;
  // let tokenBalances: bigint[] | undefined;
  if (ratioResult[2]) {
    const result = ratioResult[2][0];
    tokenAddresses = [...result.tokenAddresses];
    borrowingPower = BNtoDec(result.borrowingPower);
    accountLiability = BNtoDec(result.vaultLiability);
    // tokenBalances = [...result.tokenBalances];
  }

  return {
    depositAPR,
    borrowAPR,
    totalSUSDDeposited: Number.parseInt(susdDeposited),
    usdaSupply: Number.parseInt(usdaSupply),
    reserveRatio: Number.parseFloat(reserveRatio),
    userVault: {
      vaultAddress,
      vaultID,
      tokenAddresses,
      borrowingPower,
      accountLiability,
    },
  };
});

export const VCActions = { getVCData };
