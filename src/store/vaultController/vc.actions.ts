import { createAsyncThunk } from '@reduxjs/toolkit';
import { constants } from 'ethers';
import { Address, getAddress } from 'viem';
import { viemClient } from '~/App';
import {
  ICurveMaster__factory,
  IERC20Metadata__factory,
  IUSDA__factory,
  IVaultController__factory,
} from '~/chain/newContracts';
import { getStablecoins } from '~/utils/tokens';
import { BNtoHexNumber } from '~/components/util/helpers/BNtoHex';
import { CURVE_MASTER_ADDRESS, VAULT_CONTROLLER_ADDRESS, ZERO_ADDRESS } from '~/constants';
import { BN, BNtoDec, round } from '~/utils/bn';
import { ThunkAPI } from '~/store';
import { Token } from '~/types';
import { UserVault } from '~/types';
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
    userAddress: string | undefined;
  },
  ThunkAPI
>('vaultController/getVCData', async ({ userAddress }) => {
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
    address: CURVE_MASTER_ADDRESS as Address,
    abi: ICurveMaster__factory.abi,
  };

  const vcContract = {
    address: VAULT_CONTROLLER_ADDRESS as Address,
    abi: IVaultController__factory.abi,
  };

  const result = await viemClient.multicall({
    contracts: [
      {
        ...susdContract,
        functionName: 'balanceOf',
        args: [usdaContract.address],
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
        args: [getAddress(userAddress || ZERO_ADDRESS)],
      },
    ],
  });

  const ratioResult = await viemClient.multicall({
    contracts: [
      {
        ...curveContract,
        functionName: 'getValueAt',
        args: [ZERO_ADDRESS, result[2].result!],
      },
      {
        ...vcContract,
        functionName: 'vaultAddress',
        args: [result[3].result![0]],
      },

      {
        ...vcContract,
        functionName: 'vaultSummaries',
        args: [result[3].result![0], result[3].result![0]],
      },
    ],
  });

  const ratio = BN(result[2].result);
  const ratioDec = ratio.div(1e14).toNumber() / 1e4;
  const apr = BN(ratioResult[0].result);

  const susdDeposited = BN(result[0].result).div(constants.WeiPerEther).toLocaleString();
  const usdaSupply = BN(result[1].result).div(1e9).div(1e9).toString();
  const toPercentage = BNtoHexNumber(BN(result[2].result)) / 1e16;
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
  if (result[3].result && result[3].result[0]) {
    vaultID = Number.parseInt(result[3].result[0].toString());
  }

  let vaultAddress: string | undefined;
  if (ratioResult[1].result) {
    vaultAddress = ratioResult[1].result;
  }

  let tokenAddresses: string[] | undefined;
  let borrowingPower = 0;
  let accountLiability = 0;
  // let tokenBalances: bigint[] | undefined;
  if (ratioResult[2].result) {
    const result = ratioResult[2].result[0];
    tokenAddresses = [...result.tokenAddresses];
    borrowingPower = BNtoDec(BN(result.borrowingPower));
    accountLiability = BNtoDec(BN(result.vaultLiability));
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
