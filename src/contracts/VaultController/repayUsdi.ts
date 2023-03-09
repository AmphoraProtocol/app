import { JsonRpcSigner } from '@ethersproject/providers';
import { ContractTransaction, utils } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';
import { USDI_DECIMALS } from '../../constants';

export const repayUsdi = (
  vaultID: number,
  amount: string,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => {
  const formattedUSDIAmount = utils.parseUnits(amount, USDI_DECIMALS);
  try {
    return rolodex.VC!.connect(signer).repayUSDi(vaultID, formattedUSDIAmount);
  } catch (err) {
    throw new Error('Could not repay:' + err);
  }
};

export const repayAllUsdi = (
  vaultID: number,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => {
  try {
    return rolodex.VC!.connect(signer).repayAllUSDi(vaultID);
  } catch (err) {
    throw new Error('Could not repay:' + err);
  }
};
