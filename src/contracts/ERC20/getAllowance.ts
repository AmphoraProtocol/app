import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';

import getDecimals from '../misc/getDecimals';
import { formatBNtoPreciseStringAndNumber } from '~/hooks/formatBNWithDecimals';
import { IERC20Metadata__factory } from '~/chain/newContracts';

export const getAllowance = async (
  wallet_address: string,
  spender: string,
  contract_address: string,
  providerOrSigner: JsonRpcProvider | JsonRpcSigner,
): Promise<{ num: number; str: string; bn: BigNumber }> => {
  const contract = IERC20Metadata__factory.connect(contract_address, providerOrSigner);
  const allowance = await contract.allowance(wallet_address, spender);
  const decimals = await getDecimals(contract, providerOrSigner);
  const formattedBalance = formatBNtoPreciseStringAndNumber(allowance, decimals);
  return formattedBalance;
};
