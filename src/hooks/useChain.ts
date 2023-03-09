import { useMemo } from 'react';
import { Chains } from '../chain/chains';
import { useWeb3Context } from '../components/libs/web3-data-provider/Web3Provider';

export const useChain = () => {
  const { chainId } = useWeb3Context();

  return useMemo(() => Chains.getInfo(chainId), [chainId]);
};
