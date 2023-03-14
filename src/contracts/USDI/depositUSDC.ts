import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, ContractTransaction } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';

export const depositUSDC = async (
  depositAmount: BigNumber,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => await rolodex.USDA.connect(signer!).deposit(depositAmount);
