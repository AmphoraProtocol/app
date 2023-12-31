import { InitializeTokenProps, Token } from '~/types';

export const initializeToken = ({
  name,
  ticker,
  address,
  capped_token = false,
  decimals = 18,
  price = 1,
}: InitializeTokenProps): Token => ({
  name,
  address,
  ticker,
  price,
  decimals,
  vault_balance: '0',
  vault_amount_str: '0',
  vault_amount: '0',
  wallet_balance: '0',
  wallet_amount: '0',
  wallet_amount_str: '0',
  token_LTV: 0,
  token_penalty: 0,
  capped_token,
});
