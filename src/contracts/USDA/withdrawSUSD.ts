import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, utils } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';
import { BN } from '../../utils/bn';

export const withdrawSUSD = async (susd_amount: string | BigNumber, rolodex: Rolodex, signer: JsonRpcSigner) => {
  let formattedSUSDAmount: BigNumber;
  if (typeof susd_amount === 'string') {
    formattedSUSDAmount = utils.parseUnits(susd_amount, 18);
  } else {
    formattedSUSDAmount = susd_amount;
  }

  try {
    const withdrawAttempt = await rolodex.USDA.connect(signer).withdraw(formattedSUSDAmount);

    return withdrawAttempt;
  } catch (err) {
    console.error(err);
    throw new Error('Could not withdraw');
  }
};
