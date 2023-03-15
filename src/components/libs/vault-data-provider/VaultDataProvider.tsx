import React, { useContext, useEffect, useState, Dispatch, SetStateAction } from 'react';

import { getTokensListOnCurrentChain } from '~/chain/tokens';
import { BNtoDec, BNtoDecSpecific } from '~/easy/bn';
import { Logp } from '~/logger';
import { getBalanceOf } from '~/contracts/ERC20/getBalanceOf';
import { getVotingVaultAddress, hasVotingVaultAddress } from '~/contracts/VotingVault/hasVotingVault';
import { CollateralTokens } from '~/types/token';
import { useRolodexContext } from '../rolodex-data-provider/RolodexDataProvider';
import { useWeb3Context } from '../web3-data-provider/Web3Provider';
import { getVaultTokenBalanceAndPrice, getVaultTokenMetadata } from './getVaultTokenBalanceAndPrice';
import { getVaultBorrowingPower } from './getBorrowingPower';

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
  votingVaultAddress: string | undefined;
  hasVotingVault: boolean;
  setHasVotingVault: Dispatch<SetStateAction<boolean>>;
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
  const [votingVaultAddress, setVotingVaultAddress] = useState<string | undefined>(undefined);
  const [hasVotingVault, setHasVotingVault] = useState(false);

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
        const tokenAddress = token.capped_address ? token.capped_address : token.address;
        const p1 = getVaultTokenMetadata(tokenAddress, rolodex!)
          .then((res) => {
            token.token_penalty = res.penalty;
            token.token_LTV = res.ltv;
            token.capped_token = res.capped;
          })
          .catch(Logp('failed token metadata check'));
        if (!(token.token_LTV && token.token_penalty)) {
          px.push(p1);
        }
        const p2 = getVaultTokenBalanceAndPrice(vaultAddress, token, rolodex!, signerOrProvider!)
          .then((res) => {
            token.price = Math.round(100 * res.livePrice) / 100;
            token.vault_amount_str = res.unformattedBalance;
            token.vault_amount = res.balanceBN;
            if (token.vault_amount.isZero()) {
              token.vault_balance = '0';
            } else {
              const vaultBalance = BNtoDecSpecific(token.vault_amount, token.decimals) * token.price;

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
              token.wallet_amount = val.bn;
              token.wallet_amount_str = val.str;
            })
            .catch((e) => {
              console.log('failed to get token balances');
            });
          px.push(p3);
        }
      }
    }
    return Promise.all(px);
  };

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
    if (currentAccount && rolodex) {
      rolodex?.VC?.vaultIDs(currentAccount).then((vaultIDs) => {
        if (vaultIDs && vaultIDs?.length > 0) {
          const id = vaultIDs.toString();
          setVaultID(id);

          getVotingVaultAddress(id, signerOrProvider!).then((address) => {
            setVotingVaultAddress(address);
            setHasVotingVault(hasVotingVaultAddress(address));
          });
        } else {
          setVaultID(null);
        }
      });
    }
  }, [currentAccount, rolodex]);

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
        hasVotingVault,
        setHasVotingVault,
        votingVaultAddress,
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
