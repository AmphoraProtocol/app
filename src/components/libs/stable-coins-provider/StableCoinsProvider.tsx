import { useContext, useEffect, useState, ReactElement, createContext } from 'react';
import { Address, getAddress } from 'viem';
import { viemClient } from '~/App';
import { IERC20Metadata__factory } from '~/chain/newContracts';
import { formatBigInt } from '~/hooks/formatBNWithDecimals';
import { getStablecoins } from '../../../chain/tokens';
import { Token } from '../../../types/token';
import { useWeb3Context } from '../web3-data-provider/Web3Provider';

export type StableCoinsContextType = {
  USDA: Token;
  SUSD: Token;
};

export const StableCoinsContext = createContext({} as StableCoinsContextType);

export const StableCoinsProvider = ({ children }: { children: ReactElement }) => {
  const { currentAccount, dataBlock, chainId } = useWeb3Context();

  const [SUSD, setSUSD] = useState<Token>(() => getStablecoins().SUSD!);
  const [USDA, setUSDA] = useState<Token>(() => getStablecoins().USDA!);

  useEffect(() => {
    if (currentAccount) {
      const susdContract = {
        address: SUSD.address as Address,
        abi: IERC20Metadata__factory.abi,
      } as const;

      const usdaContract = {
        address: USDA.address as Address,
        abi: IERC20Metadata__factory.abi,
      } as const;

      viemClient
        .multicall({
          contracts: [
            {
              ...susdContract,
              functionName: 'decimals',
            },
            {
              ...susdContract,
              functionName: 'balanceOf',
              args: [getAddress(currentAccount)],
            },
            {
              ...usdaContract,
              functionName: 'decimals',
            },
            {
              ...usdaContract,
              functionName: 'balanceOf',
              args: [getAddress(currentAccount)],
            },
          ],
        })
        .then((result) => {
          setSUSD({
            ...SUSD,
            wallet_balance: formatBigInt(result[1].result!, result[0].result!).str,
            wallet_amount: result[1].result!.toString(),
          });
          setUSDA({
            ...USDA,
            wallet_balance: formatBigInt(result[3].result!, result[2].result!).str,
            wallet_amount: result[3].result!.toString(),
          });
        });
    }
  }, [currentAccount, dataBlock, chainId]);

  return <StableCoinsContext.Provider value={{ SUSD, USDA }}>{children}</StableCoinsContext.Provider>;
};

export const useStableCoinsContext = () => {
  const context = useContext(StableCoinsContext);

  if (context === undefined) {
    throw new Error('useStableCoinsContext must be used within a WalletModalProvider');
  }

  return context;
};
