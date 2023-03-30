import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, utils } from 'ethers';

import { IERC20Metadata__factory } from '~/chain/contracts';

export const approveCollateral = async (
  amount: string | BigNumber,
  collateral_address: string,
  signer: JsonRpcSigner,
  vaultAddress: string,
) => {
  const token = IERC20Metadata__factory.connect(collateral_address, signer);

  try {
    const formattedERC20Amount = typeof amount === 'string' ? utils.parseUnits(amount, await token.decimals()) : amount;

    return await token.approve(vaultAddress, formattedERC20Amount);
  } catch (err) {
    console.error(err);
    throw new Error('Could not set allowance');
  }
};
