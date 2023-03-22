import { useState } from 'react';
import { Token } from '~/types/token';
import { useSwapTokenContext } from '../libs/swap-token-provider/SwapTokenProvider';

export const useTokenAmountInput = (): [
  string,
  (amount: string) => void,
  string,
  (amount: string) => void,
  () => void,
] => {
  const [tokenOne, tokenTwo] = useSwapTokenContext();

  const [token1, setToken1] = useState('');
  const [token2, setToken2] = useState('');

  const setToken1Then2 = (token1: string) => {
    setToken1(token1);
    setToken2(convertPairAmount(token1, tokenOne, tokenTwo));
  };

  const setToken2Then1 = (token2: string) => {
    setToken2(token2);
    setToken1(convertPairAmount(token2, tokenTwo, tokenOne));
  };

  const swapTokenAmount = () => {
    const newToken1 = token2;

    setToken2(token1);
    setToken1(newToken1);
  };

  return [token1, setToken1Then2, token2, setToken2Then1, swapTokenAmount];
};

const convertPairAmount = (token: string, from: Token, to: Token) => {
  return ((Number(token) * from.price) / to.price).toString();
};
