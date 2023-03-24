import { BigNumber, BigNumberish } from 'ethers';

export const BN = (a: any): BigNumber => {
  if (typeof a === 'string') {
    a = a.split('.')[0];
    a = a.replaceAll(',', '');
    const splt = a.split('e');
    if (splt.length == 1) {
      splt.push('0');
    }
    return BigNumber.from(splt[0]).mul(BigNumber.from(10).pow(splt[1]));
  }
  return BigNumber.from(a);
};

export const round = (a: BigNumberish, n: number): number => {
  return Math.round(10 ** n * Number(a.toString())) / 10 ** n;
};

export const BNtoDec = (bn: BigNumber): number => {
  return bn.div(BN('1e16')).toNumber() / 100;
};

export const BNtoDecSpecific = (bn: BigNumber, decimals: number): number => {
  return bn.div(BN(`1e${decimals - 2}`)).toNumber() / 100;
};
