import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, Contract } from 'ethers';
import { BNtoHexNumber } from '../../utils/BNtoHex';
import { LINK_FAST_GAS_GWEI } from '../../constants';

const CHAIN_DATA_ABI = [
  {
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

const getGasPrice = async (signerOrProvider: JsonRpcSigner | JsonRpcProvider) => {
  const gasContract = new Contract(LINK_FAST_GAS_GWEI, CHAIN_DATA_ABI, signerOrProvider);

  const gasPrice: BigNumber = await gasContract.latestAnswer();

  // bignumber to decimal to 2 decimal places
  return (BNtoHexNumber(gasPrice) / 1000000000).toFixed(2);
};

export default getGasPrice;
