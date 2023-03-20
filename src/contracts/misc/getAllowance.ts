import { Rolodex } from '~/chain/rolodex/rolodex';

export const getSUSDAllowanceWithRolodex = async (owner: string, spender: string, rolodex: Rolodex) => {
  const allowance = await rolodex.SUSD?.allowance(owner, spender);
  return allowance;
};
