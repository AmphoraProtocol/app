import { useContext, useEffect, useState, ReactElement, createContext } from 'react';
import { getStablecoins } from '../../../chain/tokens';
import { getBalanceOf } from '../../../contracts/ERC20/getBalanceOf';
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
    if (rolodex && rolodex?.addressUSDA && rolodex?.addressSUSD) {
      getBalanceOf(currentAccount, rolodex.addressSUSD, rolodex.provider).then((res) => {
        setSUSD({ ...SUSD, wallet_balance: res.str, wallet_amount: res.bn });
      });
      getBalanceOf(currentAccount, rolodex.addressUSDA, rolodex.provider).then((res) => {
        setUSDA({ ...USDA, wallet_balance: res.str, wallet_amount: res.bn });
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
