import React, { useContext, useEffect, useState } from 'react';
import { useWeb3Context } from '../web3-data-provider/Web3Provider';

export type WalletModalContextType = {
  isWalletModalOpen: boolean;
  setIsWalletModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const WalletModalContext = React.createContext({} as WalletModalContextType);

export const WalletModalProvider = ({ children }: { children: React.ReactElement }) => {
  const { connected } = useWeb3Context();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  useEffect(() => {
    if (connected) {
      setIsWalletModalOpen(false);
    }
  }, [connected]);

  return (
    <WalletModalContext.Provider value={{ isWalletModalOpen, setIsWalletModalOpen }}>
      {children}
    </WalletModalContext.Provider>
  );
};

export const useWalletModalContext = () => {
  const context = useContext(WalletModalContext);

  if (context === undefined) {
    throw new Error('useWalletModalContext must be used within a WalletModalProvider');
  }

  return context;
};
