import { useContext, useEffect, useState, ReactElement, createContext } from 'react';
import { Address, getAddress } from 'viem';
import { viemClient } from '~/App';
import { IERC20Metadata__factory } from '~/chain/newContracts';
import { useFormatBigInt } from '~/hooks/useFormatBNWithDecimals';
import { getStablecoins } from '../../../chain/tokens';
import { Token } from '../../../types/token';
import { useRolodexContext } from '../rolodex-data-provider/RolodexDataProvider';
import { useWeb3Context } from '../web3-data-provider/Web3Provider';

export type StableCoinsContextType = {
  USDA: Token;
  SUSD: Token;
};

export const StableCoinsContext = createContext({} as StableCoinsContextType);

export const StableCoinsProvider = ({ children }: { children: ReactElement }) => {
  const { currentAccount, dataBlock, chainId } = useWeb3Context();
  const rolodex = useRolodexContext();

  const [SUSD, setSUSD] = useState<Token>(() => getStablecoins(rolodex!).SUSD!);
  const [USDA, setUSDA] = useState<Token>(() => getStablecoins(rolodex!).USDA!);

  useEffect(() => {
    if (rolodex && rolodex?.addressUSDA && rolodex?.addressSUSD && currentAccount) {
      const susdContract = {
        address: rolodex?.addressSUSD as Address,
        abi: IERC20Metadata__factory.abi,
      } as const;

      const usdaContract = {
        address: rolodex?.addressUSDA as Address,
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
            wallet_balance: useFormatBigInt(result[1].result!, result[0].result!).str,
            wallet_amount: useFormatBigInt(result[1].result!, result[0].result!).bn,
          });
          setUSDA({
            ...USDA,
            wallet_balance: useFormatBigInt(result[3].result!, result[2].result!).str,
            wallet_amount: useFormatBigInt(result[3].result!, result[2].result!).bn,
          });
        });
    }
  }, [currentAccount, dataBlock, chainId, rolodex]);

  return <StableCoinsContext.Provider value={{ SUSD, USDA }}>{children}</StableCoinsContext.Provider>;
};

export const useStableCoinsContext = () => {
  const context = useContext(StableCoinsContext);

  if (context === undefined) {
    throw new Error('useStableCoinsContext must be used within a WalletModalProvider');
  }

  return context;
};
