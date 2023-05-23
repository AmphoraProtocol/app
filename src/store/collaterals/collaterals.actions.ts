import { createAsyncThunk } from '@reduxjs/toolkit';
import { constants, utils } from 'ethers';
import { Address, erc20ABI } from 'wagmi';
import { multicall } from '@wagmi/core';

import {
  getOracleType,
  formatBigInt,
  formatBNtoPreciseStringAndNumber,
  formatBNWithDecimals,
  BN,
  BNtoDecSpecific,
  initializeToken,
  getRewardPrices,
} from '~/utils';
import { CollateralTokens } from '~/types';
import { ThunkAPI } from '~/store';
import { getConfig } from '~/config';
import {
  IVaultController__factory,
  IVault__factory,
  IOracleRelay__factory,
} from '@amphora-protocol/interfaces/ethers-v5/factories';

const getCollateralData = createAsyncThunk<
  { tokens: CollateralTokens },
  {
    userAddress?: Address;
    vaultAddress?: Address;
    tokens?: Address[];
    chainId: number;
  },
  ThunkAPI
>('collateral/getData', async ({ userAddress, vaultAddress, tokens, chainId }) => {
  const { VAULT_CONTROLLER, ZERO_ADDRESS, WETH } = getConfig().ADDRESSES[chainId];
  const tokenList: Address[] = tokens || [WETH];

  const collateralsLength = tokenList.length;

  const tokensName = tokenList.map((address) => {
    return {
      address: address,
      abi: erc20ABI,
      functionName: 'name',
    };
  });

  const tokensSymbol = tokenList.map((address) => {
    return {
      address: address,
      abi: erc20ABI,
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

  // Getting rewards prices, temporary fixed values
  const pools: Address[] = [
    '0x919fa96e88d67499339577fa202345436bcdaf79', // CRV  Pool
    '0x2e4784446a0a06df3d1a040b03e1680ee266c35a', // CVX  Pool
    '0x0000000000000000000000000000000000000000', // AMPH Pool
  ];
  const price_list = await getRewardPrices(pools, chainId);

  for (const [, token] of Object.entries(collaterals)) {
    const [data, rewards] = await multicall({
      contracts: [
        {
          address: VAULT_CONTROLLER,
          abi: IVaultController__factory.abi,
          functionName: 'tokenCollateralInfo',
          args: [token.address],
        },
        {
          address: vaultAddress || ZERO_ADDRESS,
          abi: IVault__factory.abi,
          functionName: 'claimableRewards',
          args: [token.address],
        },
      ],
    });

    token.token_LTV = data.ltv.div(BN('1e16')).toNumber();
    token.token_penalty = data.liquidationIncentive.div(BN('1e16')).toNumber();
    token.capped_token = !constants.MaxUint256.eq(data.cap);
    token.oracle_address = data.oracle;
    token.curve_lp = !!data.collateralType;
    token.tokenId = data.tokenId.toNumber();
    token.poolId = data.poolId.toNumber();
    token.rewards_contract = data.crvRewardsContract;

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
      address: token.address,
      abi: erc20ABI,
    };

    const oracleContract = {
      address: data.oracle,
      abi: IOracleRelay__factory.abi,
    };

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
          address: vaultAddress || ZERO_ADDRESS,
          abi: IVault__factory.abi,
          functionName: 'balances',
          args: [token.address || ZERO_ADDRESS],
        },
        {
          ...erc20Contract,
          functionName: 'balanceOf',
          args: [userAddress || ZERO_ADDRESS],
        },
      ],
    });

    // Fetch reward decimals and set reward price and amount:
    if (rewards) {
      const decimals: any[] = [];
      rewards.forEach((element) => {
        decimals.push({
          address: element.token,
          abi: erc20ABI,
          functionName: 'decimals',
        });
      });
      const symbols: any[] = [];
      rewards.forEach((element) => {
        symbols.push({
          address: element.token,
          abi: erc20ABI,
          functionName: 'symbol',
        });
      });

      const rewardDecimals = (await multicall({
        contracts: [...decimals, ...symbols],
      })) as (number | string)[];

      token.claimable_rewards = rewards.map((rewards, index) => {
        return {
          amount: utils.formatUnits(rewards.amount, rewardDecimals[index]),
          token: rewards.token,
          price: price_list[index] || 0,
          symbol: rewardDecimals[index + symbols.length].toString(),
        };
      });
    }

    let unformattedBalance = '0';
    let balanceBN = BN(0);
    token.oracle_type = getOracleType(oracleType);
    const livePrice = formatBNWithDecimals(currentValue || BN(0), 18 + (18 - decimals!));
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

  return { tokens: collaterals };
});

export const CollateralActions = { getCollateralData };
