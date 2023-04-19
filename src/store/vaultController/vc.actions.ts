import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber } from 'ethers';
import { Address } from 'wagmi';
import { multicall } from '@wagmi/core';

import {
  ICurveMaster__factory,
  IERC20Metadata__factory,
  IUSDA__factory,
  IVaultController__factory,
} from '~/chain/contracts';
import { BNtoHexNumber, BNtoDec, formatNumber, formatPercent } from '~/utils';
import { ThunkAPI } from '~/store';
import { UserVault } from '~/types';
import { getConfig } from '~/config';

const getVCData = createAsyncThunk<
  {
    depositAPR: number | undefined;
    borrowAPR: number | undefined;
    usdaSupply: number;
    totalSUSDDeposited: number;
    reserveRatio: string;
    userVault: UserVault;
    collaterals?: Address[];
  },
  {
    userAddress: Address | undefined;
    chainId: number;
  },
  ThunkAPI
>('vaultController/getVCData', async ({ userAddress, chainId }) => {
  const {
    ZERO_ADDRESS,
    VAULT_CONTROLLER: VAULT_CONTROLLER_ADDRESS,
    CURVE_MASTER: CURVE_MASTER_ADDRESS,
    SUSD: SUSD_ADDRESS,
    USDA: USDA_ADDRESS,
  } = getConfig().ADDRESSES[chainId];

  const usdaContract = {
    address: USDA_ADDRESS,
    abi: IUSDA__factory.abi,
  };

  const vcContract = {
    address: VAULT_CONTROLLER_ADDRESS,
    abi: IVaultController__factory.abi,
  };

  const [balanceOfSUSD, susdTotalSupply, reserveRatioInWeis, vaultIds, enabledTokens, protocolFee] = await multicall({
    contracts: [
      {
        address: SUSD_ADDRESS,
        abi: IERC20Metadata__factory.abi,
        functionName: 'balanceOf',
        args: [USDA_ADDRESS] as [Address],
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
      {
        ...vcContract,
        functionName: 'protocolFee',
      },
    ],
  });

  const [borrowValueAt, vaultAddress, vaultSummaries] = await multicall({
    contracts: [
      {
        address: CURVE_MASTER_ADDRESS,
        abi: ICurveMaster__factory.abi,
        functionName: 'getValueAt',
        args: [ZERO_ADDRESS, reserveRatioInWeis] as [Address, BigNumber],
      },
      {
        ...vcContract,
        functionName: 'vaultAddress',
        args: [vaultIds[0]] as [BigNumber],
      },
      {
        ...vcContract,
        functionName: 'vaultSummaries',
        args: [vaultIds[0], vaultIds[0]] as [BigNumber, BigNumber],
      },
    ],
  });

  let borrowAPR: number | undefined;
  let depositAPR: number | undefined;
  if (borrowValueAt) {
    const ratioDecimal = formatPercent(reserveRatioInWeis) / 100;
    const protocolFeeDecimal = formatPercent(protocolFee) / 100;
    borrowAPR = formatPercent(borrowValueAt);
    /* 
      Deposit rate (D): 
      D(s) = B(s) * (1 − s) * (1 − f)
      
      where:
      - f = protocol fee rate
      - s = reserve ratio
      - D(s) = deposit rate at reserve ratio s
      - B(s) = borrow rate at reserve ratio s
      */

    depositAPR = borrowAPR * (1 - ratioDecimal) * (1 - protocolFeeDecimal);
  }

  let tokenAddresses: Address[] | undefined;
  let borrowingPower = 0;
  let accountLiability = 0;
  // let tokenBalances: bigint[] | undefined;
  if (vaultSummaries) {
    const result = vaultSummaries[0];
    tokenAddresses = [...result.tokenAddresses];
    borrowingPower = BNtoDec(result.borrowingPower);
    accountLiability = BNtoDec(result.vaultLiability);
    // tokenBalances = [...result.tokenBalances];
  }

  const reserveRatio = formatPercent(reserveRatioInWeis);

  return {
    depositAPR,
    borrowAPR,
    totalSUSDDeposited: BNtoDec(balanceOfSUSD),
    usdaSupply: BNtoDec(susdTotalSupply),
    reserveRatio: formatNumber(reserveRatio),
    userVault: {
      vaultAddress: vaultAddress,
      vaultID: vaultIds[0]?.toNumber(),
      tokenAddresses,
      borrowingPower,
      accountLiability,
    },
    collaterals: [...enabledTokens],
  };
});

export const VCActions = { getVCData };
