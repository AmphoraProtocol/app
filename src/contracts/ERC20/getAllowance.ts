import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import getDecimals from '../misc/getDecimals';
import { useFormatBNtoPreciseStringAndNumber } from '../../hooks/useFormatBNWithDecimals';
import { ERC20Detailed__factory } from '../../chain/contracts';
import { BigNumber } from 'ethers';

export const getAllowance = async (
  wallet_address: string,
  spender: string,
  contract_address: string,
  providerOrSigner: JsonRpcProvider | JsonRpcSigner,
): Promise<{ num: number; str: string; bn: BigNumber }> => {
  const contract = ERC20Detailed__factory.connect(contract_address, providerOrSigner);
  const allowance = await contract.allowance(wallet_address, spender);
  const decimals = await getDecimals(contract, providerOrSigner);
  const formattedBalance = useFormatBNtoPreciseStringAndNumber(allowance, decimals);
  return formattedBalance;
};
