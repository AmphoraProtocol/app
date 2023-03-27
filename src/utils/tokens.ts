import { SUSD_ADDRESS, USDA_ADDRESS, USDA_DECIMALS } from '~/constants';
import initializeToken from '~/utils/tokens/initializeToken';
import { CollateralTokens, Token } from '~/types/token';
import { ChainIDs } from './chains';
import { tokensToChains } from './tokensToChains';

export const getStablecoins = (): {
  USDA: Token;
  SUSD: Token;
} => {
  return {
    USDA: initializeToken({
      name: 'Amphora USD',
      address: USDA_ADDRESS,
      ticker: 'USDA',
      decimals: USDA_DECIMALS,
    }),
    SUSD: initializeToken({
      name: 'Synth sUSD',
      address: SUSD_ADDRESS,
      ticker: 'sUSD',
      decimals: 18,
    }),
  };
};

export const getTokensListOnCurrentChain = (chain_id: ChainIDs): CollateralTokens => {
  return {
    WETH: initializeToken({
      name: 'Wrapped ETH',
      address: tokensToChains.WETH[chain_id],
      ticker: 'WETH',
    }),
    // temporary commented tokens to reduce some eth_calls

    // stETH: initializeToken({
    //   name: 'Lido Staked ETH',
    //   address: tokensToChains.stETH[chain_id],
    //   ticker: 'stETH',
    // }),
    // rETH: initializeToken({
    //   name: 'rETH',
    //   address: tokensToChains.rETH[chain_id],
    //   ticker: 'rETH',
    //   capped_token: true,
    //   capped_address: '0x64eA012919FD9e53bDcCDc0Fc89201F484731f41',
    // }),
    // cbETH: initializeToken({
    //   name: 'cbETH',
    //   address: tokensToChains.cbETH[chain_id],
    //   ticker: 'cbETH',
    //   capped_token: true,
    //   capped_address: '0x99bd1f28a5A7feCbE39a53463a916794Be798FC3',
    // }),
    // WBTC: initializeToken({
    //   name: 'Wrapped BTC',
    //   address: tokensToChains.WBTC[chain_id],
    //   ticker: 'WBTC',
    //   decimals: 8,
    // }),
    // UNI: initializeToken({
    //   name: 'Uniswap',
    //   address: tokensToChains.UNI[chain_id],
    //   ticker: 'UNI',
    //   can_delegate: true,
    // }),
    // MATIC: initializeToken({
    //   name: 'Matic',
    //   address: tokensToChains.MATIC[chain_id],
    //   ticker: 'MATIC',
    //   capped_token: true,
    //   capped_address: '0x5aC39Ed42e14Cf330A864d7D1B82690B4D1B9E61',
    // }),
    // ENS: initializeToken({
    //   name: 'Ethereum Name Service',
    //   address: tokensToChains.ENS[chain_id],
    //   ticker: 'ENS',
    //   can_delegate: true,
    //   capped_token: true,
    //   capped_address: '0xfb42f5afb722d2b01548f77c31ac05bf80e03381',
    // }),
    // AAVE: initializeToken({
    //   name: 'Aave',
    //   address: tokensToChains.AAVE[chain_id],
    //   ticker: 'AAVE',
    //   can_delegate: true,
    //   capped_token: true,
    //   capped_address: '0xd3bd7a8777c042De830965de1C1BCC9784135DD2',
    // }),
    // BAL: initializeToken({
    //   name: 'Balancer',
    //   address: tokensToChains.BAL[chain_id],
    //   ticker: 'BAL',
    //   capped_token: true,
    //   capped_address: '0x05498574BD0Fa99eeCB01e1241661E7eE58F8a85',
    // }),
    // DYDX: initializeToken({
    //   name: 'dYdX',
    //   address: tokensToChains.DYDX[chain_id],
    //   ticker: 'DYDX',
    //   can_delegate: true,
    //   capped_token: true,
    //   capped_address: '0xDDB3BCFe0304C970E263bf1366db8ed4DE0e357a',
    // }),
    // CRV: initializeToken({
    //   name: 'Curve',
    //   address: tokensToChains.CRV[chain_id],
    //   ticker: 'CRV',
    //   capped_token: true,
    //   capped_address: '0x9d878eC06F628e883D2F9F1D793adbcfd52822A8',
    // }),
    // LDO: initializeToken({
    //   name: 'Lido',
    //   address: tokensToChains.LDO[chain_id],
    //   ticker: 'LDO',
    //   capped_token: true,
    //   capped_address: '0x7C1Caa71943Ef43e9b203B02678000755a4eCdE9',
    // }),
    // ZRX: initializeToken({
    //   name: 'ZRX',
    //   address: tokensToChains.ZRX[chain_id],
    //   ticker: 'ZRX',
    //   capped_token: true,
    //   capped_address: '0xDf623240ec300fD9e2B7780B34dC2F417c0Ab6D2',
    // }),
  };
};

export const getTokenFromTicker = (chainId: ChainIDs, ticker: string): Token => {
  const tokens = getTokensListOnCurrentChain(chainId);

  const tok = (tokens as any)[ticker];
  if (tok != undefined) {
    return tok;
  }

  throw new TypeError('Could not find Token');
};
