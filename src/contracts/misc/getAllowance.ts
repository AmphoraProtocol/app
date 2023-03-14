import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { ERC20Detailed__factory } from '../../chain/contracts';
import { Rolodex } from '../../chain/rolodex/rolodex';

export const getUSDCAllowanceWithRolodex = async (owner: string, spender: string, rolodex: Rolodex) => {
  const allowance = await rolodex.SUSD?.allowance(owner, spender);
  return allowance;
};

export const getERC20Allowance = async (
  owner: string,
  spender: string,
  token_address: string,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
) => {
  const contract = ERC20Detailed__factory.connect(token_address, signerOrProvider);

  const allowance = await contract.allowance(owner, spender);
  return allowance;
};
