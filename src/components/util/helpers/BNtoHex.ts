import { BigNumber } from 'ethers';

export const BNtoHexString = (BN: BigNumber) => BigNumber.from(BN._hex).toString();

export const BNtoHexNumber = (BN: BigNumber) => Number(BigNumber.from(BN._hex));
