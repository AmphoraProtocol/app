import { Rolodex } from '~/chain/rolodex/rolodex';

const getCappedPercentOf = async (tokenAddress: string, rolodex: Rolodex) => {
  try {
    const maximumCap = await rolodex.VC?.tokenCap(tokenAddress);
    const totalSupply = await rolodex.VC?.tokenTotalDeposited(tokenAddress);

    return totalSupply!.div(maximumCap!).toNumber() * 100;
  } catch (err) {
    console.log(err);
    throw new Error('Could not get capped percent');
  }
};

export default getCappedPercentOf;
