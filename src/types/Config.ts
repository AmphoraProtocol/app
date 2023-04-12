import { Address } from 'wagmi';

export interface Env {
  VITE_ALLOW_DEV_MODE: boolean;
  ALCHEMY_KEY: string | undefined;
  VITE_CUSTOM_LOCAL_RPC: string;
}

export interface Constants {
  DEFAULT_APPROVE_AMOUNT: string;
  USDA_DECIMALS: number;
  DEFAULT_CHAIN_ID: number;
  ADDRESSES: {
    [key: number]: {
      ZERO_ADDRESS: Address;
      VAULT_CONTROLLER: Address;
      CURVE_MASTER: Address;
      USDA: Address;
      SUSD: Address;
      WETH: Address;
      USDC_ETH_UNISWAP_POOL: Address;
    };
  };
}

export interface Config extends Env, Constants {}
