import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';
import { BN } from '../../easy/bn';
import { getAllowance } from '../ERC20/getAllowance';
import { getUSDCAllowanceWithRolodex } from './getAllowance';

export const hasUSDCAllowance = async (
  owner: string,
  spender: string,
  amount: string | BigNumber,
  rolodex: Rolodex,
) => {
  const allowance = await getUSDCAllowanceWithRolodex(owner, spender, rolodex);

  if (allowance !== undefined) {
    let usdcBN: BigNumber;
    if (typeof amount === 'string') {
      usdcBN = BN(amount).mul(BN('1e6'));
    } else {
      usdcBN = amount;
    }

    return allowance.gte(usdcBN);
  }
  return false;
};

export const hasTokenAllowance = async (
  owner: string,
  spender: string,
  amount: BigNumber | string,
  token_address: string,
  decimals: number,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
) => {
  const allowance = await getAllowance(owner, spender, token_address, signerOrProvider);

  if (typeof amount === 'string') {
    amount = BN(amount).mul(BN('1e' + decimals));
  }

  if (allowance !== undefined) {
    return allowance.bn.gte(amount);
  }
  return false;
};
