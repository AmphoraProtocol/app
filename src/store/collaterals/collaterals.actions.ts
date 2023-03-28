import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address, getAddress } from 'viem';

import { formatBigInt, formatBNtoPreciseStringAndNumber, formatBNWithDecimals } from '~/hooks/formatBNWithDecimals';
import { IERC20Metadata__factory, IOracleRelay__factory } from '~/chain/contracts';
import { IVaultController__factory } from '~/chain/contracts';
import { VAULT_CONTROLLER_ADDRESS } from '~/constants';
import { getOracleType } from '~/utils/getOracleType';
import { BN, BNtoDecSpecific } from '~/utils/bn';
import { BigNumber, constants } from 'ethers';
import { CollateralTokens } from '~/types';
import { ZERO_ADDRESS } from '~/constants';
import { ThunkAPI } from '~/store';
import { viemClient } from '~/App';

const getCollateralData = createAsyncThunk<
  { tokens: CollateralTokens },
  {
    userAddress?: string;
    vaultAddress?: string;
    tokens: CollateralTokens;
  },
  ThunkAPI
>('collateral/getData', async ({ userAddress, vaultAddress, tokens }) => {
  const newTokens: CollateralTokens = { ...tokens };
  const VCAddress = VAULT_CONTROLLER_ADDRESS;

  for (const [key, token] of Object.entries(newTokens!)) {
    const data = await viemClient.readContract({
      address: VCAddress,
      abi: IVaultController__factory.abi,
      functionName: 'tokenCollateralInfo',
      args: [getAddress(token.address)],
    });

    token.token_LTV = BN(data.ltv).div(BN('1e16')).toNumber();
    token.token_penalty = BN(data.liquidationIncentive).div(BN('1e16')).toNumber();
    token.capped_token = !constants.MaxUint256.eq(BN(data.cap));
    token.oracle_address = data.oracle;

    let cappedPercent = 0;

    if (!constants.MaxUint256.eq(BN(data.cap))) {
      cappedPercent = BN(data.totalDeposited).div(BN(data.cap)).toNumber() * 100;
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

    const [decimals, currentValue, oracleType, balanceOf1, balanceOf2] = await viemClient.multicall({
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
          args: [getAddress(vaultAddress || ZERO_ADDRESS)],
        },
        {
          ...erc20Contract,
          functionName: 'balanceOf',
          args: [getAddress(userAddress || ZERO_ADDRESS)],
        },
      ],
    });

    let unformattedBalance = '0';
    let balanceBN = BigNumber.from(0);
    token.oracle_type = getOracleType(oracleType.result);
    const livePrice = formatBNWithDecimals(BN(currentValue.result?.toString())!, 18 + (18 - decimals.result!));
    token.price = Math.round(100 * livePrice) / 100;

    if (vaultAddress && balanceOf1.result && decimals.result) {
      const formattedBalanceOf = formatBigInt(balanceOf1.result, decimals.result);
      unformattedBalance = formattedBalanceOf.str;
      balanceBN = formattedBalanceOf.bn;
    }

    if (userAddress && balanceOf2.result && decimals.result) {
      const formattedBalance = formatBNtoPreciseStringAndNumber(BN(balanceOf2.result), decimals.result);
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
    if (BN(token.vault_amount).isZero()) {
      token.vault_balance = '0';
    } else {
      const vaultBalance = BNtoDecSpecific(BN(token.vault_amount), token.decimals) * token.price;
      token.vault_balance = vaultBalance.toFixed(2);
    }
  }

  return { tokens: newTokens };
});

export const CollateralActions = { getCollateralData };
