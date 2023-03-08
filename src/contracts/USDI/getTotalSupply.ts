import { Rolodex } from '../../chain/rolodex/rolodex';

export const getTotalSupply = async (rolodex: Rolodex): Promise<string> => {
  try {
    const totalSupply = await rolodex?.USDI?.totalSupply();

    return totalSupply.div(1e9).div(1e9).toString();
  } catch (err) {
    throw new Error('Could not retrieve total supply');
  }
};
