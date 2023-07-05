import { Env } from '~/types';

export const getEnv = (): Env => {
  const { VITE_ALLOW_DEV_MODE, VITE_ALCHEMY_KEY } = import.meta.env;

  return {
    VITE_ALLOW_DEV_MODE: VITE_ALLOW_DEV_MODE === 'true',
    ALCHEMY_KEY: VITE_ALCHEMY_KEY || '',
  };
};
