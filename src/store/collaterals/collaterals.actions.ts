import { createAsyncThunk } from '@reduxjs/toolkit';
import { BigNumber, constants } from 'ethers';
import { Address } from 'wagmi';
import { multicall, readContract } from '@wagmi/core';

import { IERC20Metadata__factory, IOracleRelay__factory, IVaultController__factory } from '~/chain/contracts';
import {
  getOracleType,
  formatBigInt,
  formatBNtoPreciseStringAndNumber,
  formatBNWithDecimals,
  BN,
  BNtoDecSpecific,
} from '~/utils';
import { CollateralTokens } from '~/types';
import { ThunkAPI } from '~/store';
import { getConfig } from '~/config';

const getCollateralData = createAsyncThunk<
  { tokens: CollateralTokens },
  {
    userAddress?: Address;
    vaultAddress?: Address;
    tokens: CollateralTokens;
  },
  ThunkAPI
>('collateral/getData', async ({ userAddress, vaultAddress, tokens }) => {
  const newTokens: CollateralTokens = { ...tokens };
  const { VAULT_CONTROLLER_ADDRESS, ZERO_ADDRESS } = getConfig().ADDRESSES;

  for (const [key, token] of Object.entries(newTokens!)) {
    const data = await readContract({
      address: VAULT_CONTROLLER_ADDRESS,
      abi: IVaultController__factory.abi,
      functionName: 'tokenCollateralInfo',
      args: [token.address],
    });

    token.token_LTV = data.ltv.div(BN('1e16')).toNumber();
    token.token_penalty = data.liquidationIncentive.div(BN('1e16')).toNumber();
    token.capped_token = !constants.MaxUint256.eq(data.cap);
    token.oracle_address = data.oracle;

    let cappedPercent = 0;

    if (!constants.MaxUint256.eq(data.cap)) {
      cappedPercent = data.totalDeposited.div(data.cap).toNumber() * 100;
      // show minimum 5%
      if (cappedPercent <= 5) {
        cappedPercent = 5;
      } else if (cappedPercent >= 100) {
        cappedPercent = 100;
      }
    }
    token.capped_percent = cappedPercent;

    const erc20Contract = {
      address: token.address as Address,
      abi: IERC20Metadata__factory.abi,
    } as const;

    const oracleContract = {
      address: data.oracle as Address,
      abi: IOracleRelay__factory.abi,
    } as const;

    const [decimals, currentValue, oracleType, balanceOf1, balanceOf2] = await multicall({
      contracts: [
        {
          ...erc20Contract,
          functionName: 'decimals',
        },
        {
          ...oracleContract,
          functionName: 'currentValue',
        },
        {
          ...oracleContract,
          functionName: 'oracleType',
        },
        {
          ...erc20Contract,
          functionName: 'balanceOf',
          args: [vaultAddress || ZERO_ADDRESS],
        },
        {
          ...erc20Contract,
          functionName: 'balanceOf',
          args: [userAddress || ZERO_ADDRESS],
        },
      ],
    });

    let unformattedBalance = '0';
    let balanceBN = BigNumber.from(0);
    token.oracle_type = getOracleType(oracleType);
    const livePrice = formatBNWithDecimals(currentValue, 18 + (18 - decimals!));
    token.price = Math.round(100 * livePrice) / 100;

    if (vaultAddress && balanceOf1 && decimals) {
      const formattedBalanceOf = formatBigInt(balanceOf1, decimals);
      unformattedBalance = formattedBalanceOf.str;
      balanceBN = formattedBalanceOf.bn;
    }

    if (userAddress && balanceOf2 && decimals) {
      const formattedBalance = formatBNtoPreciseStringAndNumber(balanceOf2, decimals);
      token.wallet_amount = formattedBalance.bn.toString();
      token.wallet_amount_str = formattedBalance.str;

      if (formattedBalance.bn.isZero()) {
        token.wallet_balance = '0';
      } else {
        const walletBalance = BNtoDecSpecific(formattedBalance.bn, token.decimals) * token.price;
        token.wallet_balance = walletBalance.toFixed(2);
      }
    }

    token.vault_amount_str = unformattedBalance;
    token.vault_amount = balanceBN.toString();
    if (balanceBN.isZero()) {
      token.vault_balance = '0';
    } else {
      const vaultBalance = BNtoDecSpecific(balanceBN, token.decimals) * token.price;
      token.vault_balance = vaultBalance.toFixed(2);
    }
  }

  return { tokens: newTokens };
});

export const CollateralActions = { getCollateralData };
