import { Env } from '~/types';

export const getEnv = (): Env => {
  const { VITE_ALLOW_DEV_MODE, VITE_ALCHEMY_KEY, VITE_CUSTOM_LOCAL_RPC } = import.meta.env;

  return {
    VITE_ALLOW_DEV_MODE: VITE_ALLOW_DEV_MODE === 'true',
    VITE_CUSTOM_LOCAL_RPC: VITE_CUSTOM_LOCAL_RPC || '',
    ALCHEMY_KEY: VITE_ALCHEMY_KEY || '',
  };
};
