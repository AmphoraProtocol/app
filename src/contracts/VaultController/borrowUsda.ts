import { JsonRpcSigner } from '@ethersproject/providers';
import { ContractTransaction, utils } from 'ethers';

import { Rolodex } from '~/chain/rolodex/rolodex';
import { USDA_DECIMALS } from '~/constants';

export const borrowUsda = async (
  vaultID: number,
  amount: string,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => {
  const formattedUSDIAmount = utils.parseUnits(amount, USDA_DECIMALS);

  try {
    const VC = rolodex.VC!.connect(signer);

    const gasEstimation = (await VC.estimateGas.borrowUSDA(vaultID, formattedUSDIAmount)).mul(100).div(50);
    console.log('here');
    return await VC.borrowUSDA(vaultID.toString(), formattedUSDIAmount.toString(), {
      gasLimit: gasEstimation,
    });
  } catch (err) {
    throw new Error('Could not borrow');
  }
};
