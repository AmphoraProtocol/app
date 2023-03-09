import { STAGING_ANALYTICS_URL, LIVE_AVERAGE_RATES } from '../../../constants';
import axios from 'axios';

export interface Averages {
  Borrow: number;
  Supply: number;
}

const getAverages = async () => {
  try {
    const averageRateURL = `${STAGING_ANALYTICS_URL}${LIVE_AVERAGE_RATES}`;

    const response = await axios.get(averageRateURL);
    return response.data as Averages;
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getAverages;
