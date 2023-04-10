import { BigNumber } from 'ethers';

export const BNtoHexNumber = (BN: BigNumber) => Number(BigNumber.from(BN._hex));
