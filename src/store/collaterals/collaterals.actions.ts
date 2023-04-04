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
  initializeToken,
} from '~/utils';
import { CollateralTokens } from '~/types';
import { ThunkAPI } from '~/store';
import { getConfig } from '~/config';

const getCollateralData = createAsyncThunk<
  { tokens: CollateralTokens },
  {
    userAddress?: Address;
    vaultAddress?: Address;
    tokens?: Address[];
  },
  ThunkAPI
>('collateral/getData', async ({ userAddress, vaultAddress, tokens }) => {
  // temporary
  const tokenList: Address[] = [
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', // 3crv
    '0xcA3d75aC011BF5aD07a98d02f18225F9bD9A6BDF', // tricrypto
  ];

  // const tokenList: Address[] = tokens || ['0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'];

  const { VAULT_CONTROLLER, ZERO_ADDRESS } = getConfig().ADDRESSES;
  const collateralsLength = tokenList.length;

  const tokensName = tokenList.map((address) => {
    return {
      address: address,
      abi: IERC20Metadata__factory.abi,
      functionName: 'name',
    };
  });

  const tokensSymbol = tokenList.map((address) => {
    return {
      address: address,
      abi: IERC20Metadata__factory.abi,
      functionName: 'symbol',
    };
  });

  const collateralCall = await multicall({
    contracts: [...tokensSymbol, ...tokensName],
  });

  const collaterals: CollateralTokens = Object.assign(
    {},
    ...tokenList.map((address, index) => ({
      [collateralCall[index] as string]: initializeToken({
        name: collateralCall[collateralsLength + index] as string,
        address: address,
        ticker: collateralCall[index] as string,
      }),
    })),
  );

  for (const [key, token] of Object.entries(collaterals)) {
    // temporary
    token.curve_lp = true;
    if (token.address === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2') {
      // temporary fixed value
      token.curve_lp = false;

      const data = await readContract({
        address: VAULT_CONTROLLER,
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
  }

  return { tokens: collaterals };
});

export const CollateralActions = { getCollateralData };
