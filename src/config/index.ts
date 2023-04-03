import { Config } from '~/types';

import { getConstants } from './constants';
import { getEnv } from './env';

export const getConfig = (): Config => ({
  ...getConstants(),
  ...getEnv(),
});
