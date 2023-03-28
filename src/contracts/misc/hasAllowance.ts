import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { BN } from '../../utils/bn';
import { getAllowance } from '../ERC20/getAllowance';

export const hasSUSDAllowance = async (amount: string | BigNumber, allowance: BigNumber, decimals: number) => {
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
