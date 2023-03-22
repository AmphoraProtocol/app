import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';
import { BN } from '../../easy/bn';
import { getAllowance } from '../ERC20/getAllowance';
import { getSUSDAllowanceWithRolodex } from './getAllowance';

export const hasSUSDAllowance = async (
  owner: string,
  spender: string,
  amount: string | BigNumber,
  rolodex: Rolodex,
  decimals: number,
) => {
  const allowance = await getSUSDAllowanceWithRolodex(owner, spender, rolodex);

  if (allowance !== undefined) {
    let susdBN: BigNumber;
    if (typeof amount === 'string') {
      susdBN = BN(amount).mul(BN('1e' + decimals));
    } else {
      susdBN = amount;
    }

    return allowance.gte(susdBN);
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
