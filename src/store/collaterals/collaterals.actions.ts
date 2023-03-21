import { JsonRpcSigner, JsonRpcProvider } from '@ethersproject/providers';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { IVaultController__factory } from '~/chain/newContracts';
import {
  getVaultTokenBalanceAndPrice,
  getVaultTokenMetadata,
} from '~/components/libs/vault-data-provider/getVaultTokenBalanceAndPrice';
import { VAULT_CONTROLLER_ADDRESS } from '~/constants';
import { getBalanceOf } from '~/contracts/ERC20/getBalanceOf';
import { ThunkAPI } from '~/store';
import { CollateralTokens } from '~/types';

const getCollateralData = createAsyncThunk<
  { tokens: CollateralTokens },
  {
    userAddress?: string;
    vaultAddress?: string;
    tokens: CollateralTokens;
    signerOrProvider: JsonRpcProvider | JsonRpcSigner;
  },
  ThunkAPI
>('collateral/getData', async ({ userAddress, vaultAddress, tokens, signerOrProvider }) => {
  const newTokens = { ...tokens };
  const VCAddress = VAULT_CONTROLLER_ADDRESS;
  const VC = IVaultController__factory.connect(VCAddress, signerOrProvider);

  for (const [key, token] of Object.entries(newTokens!)) {
    const tokenMetadata = await getVaultTokenMetadata(token.address, VC);
    const vaultData = await getVaultTokenBalanceAndPrice(tokenMetadata.oracle, vaultAddress, token);

    if (userAddress) {
      const balances = await getBalanceOf(userAddress, token.address, signerOrProvider);
      token.wallet_balance = balances.bn.toString();
    }

    token.price = Math.round(100 * vaultData.livePrice) / 100;
    token.vault_balance = vaultData.balanceBN.toString();
    token.token_penalty = tokenMetadata.penalty;
    token.token_LTV = tokenMetadata.ltv;
    token.capped_token = tokenMetadata.capped;
    token.capped_percent = tokenMetadata.cappedPercent;
    token.oracle_address = tokenMetadata.oracle;
  }

  return { tokens: newTokens };
});

export const CollateralActions = { getCollateralData };
