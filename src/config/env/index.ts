import { Env } from '~/types';

export const getEnv = (): Env => {
  const { VITE_ALLOW_DEV_MODE, VITE_ALCHEMY_KEY, VITE_WALLET_CONNECT_ID } = import.meta.env;

  return {
    VITE_ALLOW_DEV_MODE: VITE_ALLOW_DEV_MODE === 'true',
    ALCHEMY_KEY: VITE_ALCHEMY_KEY || '',
    WALLET_CONNECT_ID: VITE_WALLET_CONNECT_ID || '',
  };
};
