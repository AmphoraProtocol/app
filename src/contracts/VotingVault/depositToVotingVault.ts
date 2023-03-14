import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, utils } from 'ethers';
import { CappedGovToken__factory } from '../../chain/contracts/factories/CappedGovToken__factory';
import { Token } from '../../types/token';

const depositToVotingVault = async (
  id: string,
  signerOrProvider: JsonRpcSigner | JsonRpcProvider,
  token: Token,
  amount: string | BigNumber,
) => {
  try {
    const cappedTokenContract = CappedGovToken__factory.connect(token.capped_address!, signerOrProvider);

    let formattedAmount;
    if (typeof amount === 'string') {
      const decimals = await cappedTokenContract.decimals();

      formattedAmount = utils.parseUnits(amount, decimals);
    } else {
      formattedAmount = amount;
    }

    // const ge = (
    //   await cappedTokenContract.estimateGas.transfer(
    //     token.capped_address!,
    //     formattedAmount
    //   )
    // )
    //   .mul(100)
    //   .div(80)

    const depositCapped = await cappedTokenContract.deposit(
      formattedAmount,
      Number(id),
      // { gasLimit: ge }
    );

    return depositCapped;
  } catch (err) {
    console.log(err);
    throw new Error('Could not deposit');
  }
};

export default depositToVotingVault;
