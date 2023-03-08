import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, utils } from 'ethers';
import { Rolodex } from '../../chain/rolodex/rolodex';
import { BN } from '../../easy/bn';

export const withdrawUSDC = async (usdc_amount: string | BigNumber, rolodex: Rolodex, signer: JsonRpcSigner) => {
  let formattedUSDCAmount: BigNumber;
  if (typeof usdc_amount === 'string') {
    formattedUSDCAmount = utils.parseUnits(usdc_amount, 6);
  } else {
    formattedUSDCAmount = usdc_amount.div(BN('1e12'));
  }

  try {
    const ge = (await rolodex.USDI.connect(signer).estimateGas.withdraw(formattedUSDCAmount)).mul(100).div(90);

    const withdrawAttempt = await rolodex.USDI.connect(signer).withdraw(
      formattedUSDCAmount,
      // { gasLimit: ge }
    );

    return withdrawAttempt;
  } catch (err) {
    console.error(err);
    throw new Error('Could not withdraw');
  }
};
