import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import getDecimals from '../misc/getDecimals';
import { useFormatBNtoPreciseStringAndNumber } from '../../hooks/useFormatBNWithDecimals';
import { IERC20Metadata__factory } from '~/chain/newContracts';
import { BigNumber } from 'ethers';

export const getBalanceOf = async (
  wallet_address: string,
  contract_address: string,
  providerOrSigner: JsonRpcProvider | JsonRpcSigner,
): Promise<{ num: number; str: string; bn: BigNumber }> => {
  const contract = IERC20Metadata__factory.connect(contract_address, providerOrSigner);
  const balance = await contract.balanceOf(wallet_address);
  const decimals = await getDecimals(contract, providerOrSigner);
  const formattedBalance = useFormatBNtoPreciseStringAndNumber(balance, decimals);
  return formattedBalance;
};
