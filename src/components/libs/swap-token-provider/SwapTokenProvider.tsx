import { createContext, useState, useContext, useEffect } from 'react';
import { useAppSelector } from '~/hooks/store';
import { Token } from '~/types/token';

type SwapTokenContextType = [Token, Token, () => void];

export const SwapTokenContext = createContext([] as unknown as SwapTokenContextType);

export const SwapTokenProvider = ({ children }: { children: React.ReactElement }) => {
  const { SUSD, USDA } = useAppSelector((state) => state.stablecoins);

  const [token1, setToken1] = useState<Token>(SUSD);
  const [token2, setToken2] = useState<Token>(USDA);

  useEffect(() => {
    if (token1.ticker === SUSD.ticker) {
      setToken1(SUSD);
      setToken2(USDA);
    } else {
      setToken1(USDA);
      setToken2(SUSD);
    }
  }, [USDA, SUSD]);

  const swapTokenPositions = () => {
    const newToken2 = { ...token1 };
    setToken1({ ...token2 });
    setToken2({ ...newToken2 });
  };

  return <SwapTokenContext.Provider value={[token1, token2, swapTokenPositions]}>{children}</SwapTokenContext.Provider>;
};

export const useSwapTokenContext = () => {
  const context = useContext(SwapTokenContext);

  if (context === undefined) {
    throw new Error('useSwapTokenContext must be used within a SwapTokenProvider');
  }

  return context;
};
