import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, constants } from 'ethers';
import { Address } from 'wagmi';
import { multicall } from '@wagmi/core';

import {
  ICurveMaster__factory,
  IERC20Metadata__factory,
  IUSDA__factory,
  IVaultController__factory,
} from '~/chain/contracts';
import { BNtoHexNumber, BN, BNtoDec, round } from '~/utils';
import { ThunkAPI } from '~/store';
import { UserVault } from '~/types';
import { getConfig } from '~/config';

const getVCData = createAsyncThunk<
  {
    depositAPR: number | undefined;
    borrowAPR: number | undefined;
    usdaSupply: number;
    totalSUSDDeposited: number;
    reserveRatio: number;
    userVault: UserVault;
    collaterals?: Address[];
  },
  {
    userAddress: Address | undefined;
  },
  ThunkAPI
>('vaultController/getVCData', async ({ userAddress }) => {
  const {
    ZERO_ADDRESS,
    VAULT_CONTROLLER: VAULT_CONTROLLER_ADDRESS,
    CURVE_MASTER: CURVE_MASTER_ADDRESS,
    SUSD: SUSD_ADDRESS,
    USDA: USDA_ADDRESS,
  } = getConfig().ADDRESSES;

  const susdContract = {
    address: SUSD_ADDRESS,
    abi: IERC20Metadata__factory.abi,
  };

  const usdaContract = {
    address: USDA_ADDRESS,
    abi: IUSDA__factory.abi,
  };

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
      {
        ...vcContract,
        functionName: 'getEnabledTokens',
      },
    ],
  });

  const ratioResult = await multicall({
    contracts: [
      {
        ...curveContract,
        functionName: 'getValueAt',
        args: [ZERO_ADDRESS, firstCall[2]] as [Address, BigNumber],
      },
      {
        ...vcContract,
        functionName: 'vaultAddress',
        args: [firstCall[3][0]] as [BigNumber],
      },
      {
        ...vcContract,
        functionName: 'vaultSummaries',
        args: [firstCall[3][0], firstCall[3][0]] as [BigNumber, BigNumber],
      },
    ],
  });

  const susdDeposited = firstCall[0].div(constants.WeiPerEther).toLocaleString();
  const ratioDecimal = firstCall[2].div(1e14).toNumber() / 1e4;
  const usdaSupply = firstCall[1].div(1e9).div(1e9).toString();
  const toPercentage = BNtoHexNumber(firstCall[2]) / 1e16;
  const reserveRatio = toPercentage.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  let vaultID: number | undefined;
  if (firstCall[3] && firstCall[3][0]) {
    vaultID = Number.parseInt(firstCall[3][0].toString());
  }

  let borrowAPR: number | undefined;
  let depositAPR: number | undefined;
  if (ratioResult[0]) {
    borrowAPR = ratioResult[0].div(BN('1e14')).toNumber() / 100;
    depositAPR = round(borrowAPR * (1 - ratioDecimal) * 0.85, 3);
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
    collaterals: [...firstCall[4]],
  };
});

export const VCActions = { getVCData };
