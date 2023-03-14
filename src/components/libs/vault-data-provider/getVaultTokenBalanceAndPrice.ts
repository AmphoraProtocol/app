import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { IOracleRelay__factory } from '../../../chain/newContracts';
import { backupProvider, Rolodex } from '../../../chain/rolodex/rolodex';
import { getBalanceOf } from '../../../contracts/ERC20/getBalanceOf';
import getDecimals from '../../../contracts/misc/getDecimals';
import { BN } from '../../../easy/bn';
import { useFormatBNWithDecimals } from '../../../hooks/useFormatBNWithDecimals';
import { Token } from '../../../types/token';

export const getVaultTokenBalanceAndPrice = async (
  vault_address: string | undefined,
  token: Token,
  rolodex: Rolodex,
  signerOrProvider: JsonRpcProvider | JsonRpcSigner,
): Promise<{
  balance: number;
  livePrice: number;
  unformattedBalance: string;
  balanceBN: BigNumber;
}> => {
  try {
    // get vault balance
    let balance = 0;
    let unformattedBalance = '0';
    let balanceBN = BigNumber.from(0);
    const SOP = signerOrProvider ? signerOrProvider : rolodex.provider;

    const token_address = token.capped_address ? token.capped_address : token.address;

    if (vault_address !== undefined) {
      const balanceOf = await getBalanceOf(vault_address, token_address, SOP);

      balance = balanceOf.num;
      unformattedBalance = balanceOf.str;
      balanceBN = balanceOf.bn;
    }

    // temporary to get token price
    // const price = await rolodex?.Oracle?.getLivePrice(token_address);
    const oracleAddr = await rolodex.VC?.tokensOracle(token_address);
    const provider = backupProvider;
    const oracle = IOracleRelay__factory.connect(oracleAddr!, provider);
    const price = await oracle.currentValue();

    const decimals = await getDecimals(token_address, SOP);
    const livePrice = useFormatBNWithDecimals(price!, 18 + (18 - decimals));

    return { balance, livePrice, unformattedBalance, balanceBN };
  } catch (e) {
    console.log(e);
    return {
      balance: 0,
      livePrice: 0,
      unformattedBalance: '0',
      balanceBN: BigNumber.from(0),
    };
  }
};

export const getVaultTokenMetadata = async (
  token_address: string,
  rolodex: Rolodex,
): Promise<{ ltv: number; penalty: number }> => {
  // temporary we can batch these calls
  const ltvBig = await rolodex?.VC!.tokenLTV(token_address);
  const penaltyBig = await rolodex?.VC!.tokenLiquidationIncentive(token_address);
  const ltv = ltvBig.div(BN('1e16')).toNumber();
  const penalty = penaltyBig.div(BN('1e16')).toNumber();
  return { ltv, penalty };
};
