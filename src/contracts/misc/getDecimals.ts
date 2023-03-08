import { Contract } from 'ethers';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';

const minABI = [
  // decimals
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    type: 'function',
  },
];

const getDecimals = async (
  contractAddressOrContract: string | Contract,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
): Promise<number> => {
  try {
    if (typeof contractAddressOrContract === 'string') {
      const contract = new Contract(contractAddressOrContract, minABI, signerOrProvider);

      const decimals = await contract.decimals();

      return decimals;
    }

    const decimals = await contractAddressOrContract.decimals();

    return decimals;
  } catch (err) {
    throw new Error('Error receiving decimals');
  }
};

export default getDecimals;
