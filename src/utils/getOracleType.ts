import { OracleType } from '~/types';

export const getOracleType = (type: number | undefined): OracleType => {
  switch (type) {
    case 0:
      return 'Chainlink';
    case 1:
      return 'Uniswap';
    case 2:
      return 'Price';
    default:
      return '';
  }
};
