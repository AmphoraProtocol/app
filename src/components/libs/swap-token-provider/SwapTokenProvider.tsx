import { createContext, useState, useContext, useEffect } from 'react';
import { Token } from '../../../types/token';
import { useStableCoinsContext } from '../stable-coins-provider/StableCoinsProvider';

type SwapTokenContextType = [Token, Token, () => void];

export const SwapTokenContext = createContext([] as unknown as SwapTokenContextType);

export const SwapTokenProvider = ({ children }: { children: React.ReactElement }) => {
  const { USDI, USDC } = useStableCoinsContext();
  const [token1, setToken1] = useState<Token>(USDC);
  const [token2, setToken2] = useState<Token>(USDI);

  useEffect(() => {
    if (token1.ticker === USDC.ticker) {
      setToken1(USDC);
      setToken2(USDI);
    } else {
      setToken1(USDI);
      setToken2(USDC);
    }
  }, [USDI, USDC]);

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
