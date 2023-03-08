import { Rolodex } from '../../chain/rolodex/rolodex';
import { BNtoHexNumber } from '../../components/util/helpers/BNtoHex';

export const getReserveRatioPercentage = async (rolodex: Rolodex): Promise<string> => {
  try {
    const reserveRatio = await getReserveRatio(rolodex);
    const formattedReserveRatio = BNtoHexNumber(reserveRatio);

    const toPercentage = formattedReserveRatio / 1e16;

    return toPercentage.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (err) {
    throw new Error('Could not retrieve reserve ratio percentage');
  }
};

export const getReserveRatio = async (rolodex: Rolodex) => {
  try {
    const reserveRatio = await rolodex?.USDI.reserveRatio();

    return reserveRatio;
  } catch (err) {
    throw new Error('Could not retrieve reserve ratio');
  }
};
