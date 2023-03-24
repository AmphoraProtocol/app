export interface Token {
  name: string;
  address: string;
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

  can_delegate?: boolean;

  capped_token?: boolean;
  capped_address?: string;
  capped_percent?: number;
  oracle_address?: string;
  oracle_type?: string;
}

export interface InitializeTokenProps {
  name: string;
  ticker: string;
  address: string;
  capped_token?: boolean;
  capped_address?: string;
  price?: number;
  can_delegate?: boolean;
  decimals?: number;
}

export interface CollateralTokens {
  [key: string]: Token;
}
