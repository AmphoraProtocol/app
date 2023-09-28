import { createContext, useState, useContext, useEffect } from 'react';
import { useAppSelector } from '~/hooks';
import { Token } from '~/types';

type ContextType = [Token, Token, () => void];

export const WrapTokenContext = createContext([] as unknown as ContextType);

export const WrapTokenProvider = ({ children }: { children: React.ReactElement }) => {
  const { USDA, wUSDA } = useAppSelector((state) => state.stablecoins);

  const [token1, setToken1] = useState<Token>(USDA);
  const [token2, setToken2] = useState<Token>(wUSDA);

  useEffect(() => {
    if (token1.ticker === USDA.ticker) {
      setToken1(USDA);
      setToken2(wUSDA);
    } else {
      setToken1(wUSDA);
      setToken2(USDA);
    }
  }, [USDA, token1.ticker, wUSDA]);

  const swapPositions = () => {
    const newToken2 = { ...token1 };
    setToken1({ ...token2 });
    setToken2({ ...newToken2 });
  };

  return <WrapTokenContext.Provider value={[token1, token2, swapPositions]}>{children}</WrapTokenContext.Provider>;
};

export const useWrapTokenContext = () => {
  const context = useContext(WrapTokenContext);

  if (context === undefined) {
    throw new Error('useWrapTokenContext must be used within a WrapTokenProvider');
  }

  return context;
};
