import { Address, getAddress } from 'viem';
import { BigNumber, constants } from 'ethers';

import { viemClient } from '~/App';
import { ZERO_ADDRESS } from '~/constants';
import { IERC20Metadata__factory, IOracleRelay__factory, IVaultController } from '~/chain/newContracts';
import { Rolodex } from '~/chain/rolodex/rolodex';
import { BN } from '~/easy/bn';
import { formatBigInt, formatBNWithDecimals } from '~/hooks/formatBNWithDecimals';
import { Token } from '~/types/token';

export const getVaultTokenBalanceAndPrice = async (
  oracleAddress: string,
  vaultAddress: string | undefined,
  token: Token,
): Promise<{
  balance: number;
  livePrice: number;
  unformattedBalance: string;
  balanceBN: BigNumber;
}> => {
  try {
    const erc20Contract = {
      address: token.address as Address,
      abi: IERC20Metadata__factory.abi,
    } as const;

    const oracleContract = {
      address: oracleAddress as Address,
      abi: IOracleRelay__factory.abi,
    } as const;

    const [decimals, balanceOf, currentValue] = await viemClient.multicall({
      contracts: [
        {
          ...erc20Contract,
          functionName: 'decimals',
        },
        {
          ...erc20Contract,
          functionName: 'balanceOf',
          args: [getAddress(vaultAddress || ZERO_ADDRESS)],
        },
        {
          ...oracleContract,
          functionName: 'currentValue',
        },
      ],
    });

    let balance = 0;
    let unformattedBalance = '0';
    let balanceBN = BigNumber.from(0);

    if (vaultAddress !== undefined) {
      const formattedBalanceOf = formatBigInt(balanceOf.result!, decimals.result!);

      balance = formattedBalanceOf.num;
      unformattedBalance = formattedBalanceOf.str;
      balanceBN = formattedBalanceOf.bn;
    }

    const livePrice = formatBNWithDecimals(BN(currentValue.result?.toString())!, 18 + (18 - decimals.result!));

    return { balance, livePrice, unformattedBalance, balanceBN };
  } catch (e) {
    console.log(e);
    return {
      balance: 0,
      livePrice: 0,
      unformattedBalance: '0',
      balanceBN: BigNumber.from(0),
    };
  }
};

export const getVaultTokenMetadata = async (
  token_address: string,
  VC: IVaultController,
): Promise<{ ltv: number; penalty: number; capped: boolean; cappedPercent: number; oracle: string }> => {
  const tokenData = await VC.tokenCollateralInfo(token_address);

  const ltv = tokenData.ltv.div(BN('1e16')).toNumber();
  const penalty = tokenData.liquidationIncentive.div(BN('1e16')).toNumber();
  const capped = !constants.MaxUint256.eq(tokenData.cap);
  const oracle = tokenData.oracle;

  let cappedPercent = 0;
  if (capped) {
    const totalDeposited = tokenData.totalDeposited;
    cappedPercent = totalDeposited!.div(tokenData.cap).toNumber() * 100;

    // show minimum 5%
    if (cappedPercent <= 5) {
      cappedPercent = 5;
    } else if (cappedPercent >= 100) {
      cappedPercent = 100;
    }
  }

  return { ltv, penalty, capped, cappedPercent, oracle };
};
