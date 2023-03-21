import React, { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react';

import { getTokensListOnCurrentChain } from '~/chain/tokens';
import { BN, BNtoDec, BNtoDecSpecific } from '~/easy/bn';
import { Logp } from '~/logger';
import { getBalanceOf } from '~/contracts/ERC20/getBalanceOf';
import { CollateralTokens } from '~/types/token';
import { useRolodexContext } from '../rolodex-data-provider/RolodexDataProvider';
import { useWeb3Context } from '../web3-data-provider/Web3Provider';
import { getVaultTokenBalanceAndPrice, getVaultTokenMetadata } from './getVaultTokenBalanceAndPrice';
import { getVaultBorrowingPower } from './getBorrowingPower';
import { useAppDispatch, useAppSelector } from '~/hooks/store';
import { CollateralActions } from '~/store';

export type VaultDataContextType = {
  hasVault: boolean;
  setVaultID: Dispatch<SetStateAction<string | null>>;
  redraw: boolean;
  setRedraw: Dispatch<SetStateAction<boolean>>;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
  vaultID: string | null;
  vaultAddress?: string;
  setVaultAddress: Dispatch<SetStateAction<string | undefined>>;
  borrowingPower: number;
  accountLiability: number;
  totalBaseLiability: number;
  tokens: CollateralTokens | undefined;
  setTokens: Dispatch<SetStateAction<CollateralTokens | undefined>>;
};

export const VaultDataContext = React.createContext({} as VaultDataContextType);

export const VaultDataProvider = ({ children }: { children: React.ReactElement }) => {
  const { dataBlock, currentAccount, chainId, signerOrProvider, connected } = useWeb3Context();
  const rolodex = useRolodexContext();
  const [redraw, setRedraw] = useState(false);
  const [hasVault, setHasVault] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [vaultID, setVaultID] = useState<string | null>(null);
  const [vaultAddress, setVaultAddress] = useState<VaultDataContextType['vaultAddress']>(undefined);
  const [accountLiability, setAccountLiability] = useState(0);
  const [borrowingPower, setBorrowingPower] = useState(0);
  const [tokens, setTokens] = useState<VaultDataContextType['tokens']>(undefined);
  const [totalBaseLiability, setTotalBaseLiability] = useState(0);
  const dispath = useAppDispatch();
  const reduxTokens = useAppSelector((state) => state.collaterals.elements);

  const update = async () => {
    const px: Array<Promise<any>> = [];
    if (rolodex && rolodex.VC) {
      if (vaultID) {
        rolodex
          .VC!.vaultLiability(vaultID!)
          .then((val) => {
            const vl = BNtoDec(val);
            setAccountLiability(vl);
          })
          .catch((e) => {
            console.log('could not get account liability', e);
          });
        getVaultBorrowingPower(vaultID, rolodex)
          .then(setBorrowingPower)
          .catch((e) => {
            console.log('could not get borrowing power ', e);
          });
      }
      rolodex.VC?.totalBaseLiability().then((res) => {
        const bl = BNtoDec(res);
        setTotalBaseLiability(bl);
      });

      for (const [key, token] of Object.entries(tokens!)) {
        const tokenAddress = token.address;
        const p1 = getVaultTokenMetadata(tokenAddress, rolodex.VC!)
          .then((res) => {
            token.token_penalty = res.penalty;
            token.token_LTV = res.ltv;
            token.capped_token = res.capped;
            token.capped_percent = res.cappedPercent;
            token.oracle_address = res.oracle;
          })
          .catch(Logp('failed token metadata check'));
        if (!(token.token_LTV && token.token_penalty)) {
          px.push(p1);
        }
        const p2 = getVaultTokenBalanceAndPrice(token.oracle_address!, vaultAddress, token)
          .then((res) => {
            token.price = Math.round(100 * res.livePrice) / 100;
            token.vault_amount_str = res.unformattedBalance;
            token.vault_amount = res.balanceBN.toString();
            if (BN(token.vault_amount).isZero()) {
              token.vault_balance = '0';
            } else {
              const vaultBalance = BNtoDecSpecific(BN(token.vault_amount), token.decimals) * token.price;
              token.vault_balance = vaultBalance.toFixed(2);
            }
          })
          .catch((e) => {
            console.error('failed token balance check', e);
          });
        px.push(p2);
        if (currentAccount && connected) {
          const p3 = getBalanceOf(currentAccount, token.address, signerOrProvider!)
            .then((val) => {
              token.wallet_amount = val.bn.toString();
              token.wallet_amount_str = val.str;
            })
            .catch((e) => {
              console.log('failed to get token balances', e);
            });
          px.push(p3);
        }
      }
    }
    return Promise.all(px);
  };

  // const update2 = () => {
  //   dispath(
  //     CollateralActions.getCollateralData({
  //       userAddress: currentAccount,
  //       vaultAddress: vaultAddress!,
  //       tokens: tokens!,
  //       signerOrProvider,
  //     }),
  //   );
  // };

  // useEffect(() => {
  //   console.log('reduxTokens', reduxTokens);
  //   if (tokens && !reduxTokens) {
  //     update2();
  //   }
  // }, [tokens, currentAccount, reduxTokens]);

  useEffect(() => {
    if (redraw) {
      setRedraw(false);
    }
  }, [redraw]);

  useEffect(() => {
    if (rolodex && tokens) {
      console.log('update called @ block', dataBlock);
      update()
        .then(() => {
          setRedraw(true);
        })
        .catch((e) => {
          setRedraw(true);
          console.log('update error', e);
        });
    }
    setRefresh(false);
  }, [tokens, vaultAddress, rolodex, refresh, dataBlock, currentAccount]);

  useEffect(() => {
    setTokens(getTokensListOnCurrentChain(chainId));
  }, [chainId]);

  useEffect(() => {
    setHasVault(!!vaultID);
    if (!!vaultID && rolodex) {
      rolodex?.VC?.vaultAddress(vaultID)
        .then(setVaultAddress)
        .catch((e) => {
          console.error('failed to get vault address', e);
        });
    }
  }, [vaultID, rolodex]);

  return (
    <VaultDataContext.Provider
      value={{
        hasVault,
        setVaultID,
        vaultID,
        vaultAddress,
        setVaultAddress,
        borrowingPower,
        redraw,
        setRedraw,
        refresh,
        setRefresh,
        tokens,
        setTokens,
        accountLiability,
        totalBaseLiability,
      }}
    >
      {children}
    </VaultDataContext.Provider>
  );
};

export const useVaultDataContext = () => {
  const context = useContext(VaultDataContext);

  if (context === undefined) {
    throw new Error('useVaultDataContext must be used within a WalletModalProvider');
  }

  return context;
};
