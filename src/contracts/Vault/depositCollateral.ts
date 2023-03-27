import { JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber, utils } from 'ethers';

import { IERC20Metadata__factory, IVault__factory } from '~/chain/contracts';

export const depositCollateral = async (
  amount: string | BigNumber,
  collateral_address: string,
  signer: JsonRpcSigner,
  vaultAddress: string,
) => {
  const contract = IVault__factory.connect(vaultAddress, signer);
  const token = IERC20Metadata__factory.connect(collateral_address, signer);

  try {
    const formattedERC20Amount = typeof amount === 'string' ? utils.parseUnits(amount, await token.decimals()) : amount;

    return await contract.depositERC20(collateral_address, formattedERC20Amount);
  } catch (err) {
    console.error(err);
    throw new Error('Could not deposit');
  }
};
