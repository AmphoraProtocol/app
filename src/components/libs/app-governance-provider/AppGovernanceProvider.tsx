import { createContext, useState, useContext } from 'react';
import { getTokensListOnCurrentChain } from '~/utils/tokens';
import { Token } from '~/types/token';
import { useWeb3Context } from '../web3-data-provider/Web3Provider';

interface AppGovernanceContextType {
  isApp: boolean;
  setIsApp: (val: boolean) => void;
  delegateToken: Token;
  setDelegateToken: (val: Token) => void;
  delegatedTo: string;
  setDelegatedTo: (val: string) => void;
  iptBalance: number;
  setIptBalance: (val: number) => void;
  currentVotes: number;
  setCurrentVotes: (val: number) => void;
}

export const AppGovernanceContext = createContext({} as AppGovernanceContextType);

export const AppGovernanceProvider = ({ children }: { children: React.ReactElement }) => {
  const { chainId } = useWeb3Context();

  const [isApp, setIsApp] = useState<boolean>(true);
  const [delegateToken, setDelegateToken] = useState<Token>(getTokensListOnCurrentChain(chainId || 1)['UNI']);
  const [currentVotes, setCurrentVotes] = useState(0);
  const [delegatedTo, setDelegatedTo] = useState('0x0000000000000000000000000000000000000000');
  const [iptBalance, setIptBalance] = useState(0);

  return (
    <AppGovernanceContext.Provider
      value={{
        isApp,
        setIsApp,
        delegateToken,
        setDelegateToken,
        delegatedTo,
        setDelegatedTo,
        iptBalance,
        setIptBalance,
        currentVotes,
        setCurrentVotes,
      }}
    >
      {children}
    </AppGovernanceContext.Provider>
  );
};

export const useAppGovernanceContext = () => {
  const context = useContext(AppGovernanceContext);

  if (context === undefined) {
    throw new Error('useAppGovernanceContext must be used within a AppGovernanceProvider');
  }

  return context;
};
