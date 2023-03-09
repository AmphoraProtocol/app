import { Rolodex } from '../../chain/rolodex/rolodex';
import { BN, round } from '../../easy/bn';
import { getReserveRatio } from './getReserveRatio';

const getAPRs = async (rolodex: Rolodex) => {
  try {
    const ratio = await getReserveRatio(rolodex);

    const ratioDec = ratio.div(1e14).toNumber() / 1e4;

    const apr = await rolodex!.Curve?.getValueAt('0x0000000000000000000000000000000000000000', ratio);

    if (apr) {
      const borrow = apr.div(BN('1e14')).toNumber() / 100;

      const deposit = round(borrow * (1 - ratioDec) * 0.85, 3);

      return { deposit, borrow };
    }

    return { deposit: 0, borrow: 0 };
  } catch (err) {
    throw new Error('Could not retrieve APRs');
  }
};

export default getAPRs;
