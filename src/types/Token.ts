import { Address } from 'wagmi';

export interface Token {
  name: string;
  address: Address;
  ticker: string;
  price: number;
  decimals: number;

  wallet_balance?: string;
  wallet_amount?: string;
  wallet_amount_str?: string;

  vault_balance?: string;
  vault_amount?: string;
  vault_amount_str?: string;

  token_LTV?: number;
  token_penalty?: number;
  tokenId?: number;
  poolId?: number;

  curve_lp?: boolean;
  rewards_contract?: Address;
  claimable_rewards?: {
    token: `0x${string}`;
    amount: string;
    price: number;
    symbol: string;
  }[];

  capped_token?: boolean;
  capped_address?: string;
  capped_percent?: number;

  oracle_address?: string;
  oracle_type?: OracleType;
}

export type OracleType = '' | 'Chainlink' | 'Uniswap' | 'Price';

export interface InitializeTokenProps {
  name: string;
  ticker: string;
  address: Address;
  capped_token?: boolean;
  capped_address?: string;
  price?: number;
  decimals?: number;
}

export interface CollateralTokens {
  [key: string]: Token;
}
