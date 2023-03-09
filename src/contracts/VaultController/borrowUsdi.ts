import { JsonRpcSigner } from '@ethersproject/providers';
import { ContractTransaction, utils } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';
import { USDI_DECIMALS } from '../../constants';

export const borrowUsdi = async (
  vaultID: number,
  amount: string,
  rolodex: Rolodex,
  signer: JsonRpcSigner,
): Promise<ContractTransaction> => {
  const formattedUSDIAmount = utils.parseUnits(amount, USDI_DECIMALS);

  try {
    const VC = rolodex.VC!.connect(signer);

    const gasEstimation = (await VC.estimateGas.borrowUsdi(vaultID, formattedUSDIAmount)).mul(100).div(50);

    return VC.borrowUsdi(vaultID, formattedUSDIAmount, {
      gasLimit: gasEstimation,
    });
  } catch (err) {
    throw new Error('Could not borrow');
  }
};
