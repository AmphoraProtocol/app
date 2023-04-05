import { Address } from 'wagmi';
import { ChainIDs } from './chains';

interface TokenToChains {
  [key: string]: {
    [key: number]: Address;
  };
}

export const tokensToChains: TokenToChains = {
  WETH: {
    [ChainIDs.MAINNET]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    [ChainIDs.LOCAL]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  },
};
