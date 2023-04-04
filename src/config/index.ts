import { Config } from '~/types/Config';

import { getConstants } from './constants';
import { getEnv } from './env';

export const getConfig = (): Config => ({
  ...getConstants(),
  ...getEnv(),
});
