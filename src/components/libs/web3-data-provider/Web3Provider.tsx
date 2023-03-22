import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { providers } from 'ethers';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';

import { getWallet, WalletType } from './WalletOptions';
import { BACKUP_PROVIDER } from '../../../constants';
import getGasPrice from '../../../contracts/misc/getGasPrice';

export type ERC20TokenType = {
  address: string;
  symbol: string;
  decimals: number;
  image?: string;
  aToken?: boolean;
};

export type Web3Data = {
  connectWallet: (wallet: WalletType) => Promise<boolean>;
  disconnectWallet: () => void;
  currentAccount: string;
  currentSigner: JsonRpcSigner | undefined;
  connected: boolean;
  loading: boolean;
  provider: JsonRpcProvider;
  chainId: number;
  dataBlock: number;
  gasPrice: string;
  error: Error | undefined;
  signerOrProvider: JsonRpcSigner | JsonRpcProvider;
};

export type Web3ContextData = {
  web3ProviderData: Web3Data;
};

export const Web3Context = React.createContext({} as Web3ContextData);

export const Web3ContextProvider = ({ children }: { children: React.ReactElement }) => {
  const {
    account,
    chainId,
    library: libraryProvider,
    activate,
    active,
    error,
    deactivate,
    setError,
  } = useWeb3React<providers.Web3Provider>();
  const [loading, setLoading] = useState<boolean>(false);
  const [connector, setConnector] = useState<AbstractConnector>();
  const [currentSigner, setCurrentSigner] = useState<JsonRpcSigner>();
  const [provider, setProvider] = useState<JsonRpcProvider>(libraryProvider || new JsonRpcProvider(BACKUP_PROVIDER));
  const [signerOrProvider, setSignerOrProvider] = useState<JsonRpcSigner | JsonRpcProvider>(provider);

  const [deactivated, setDeactivated] = useState<boolean>(false);
  const [tried, setTried] = useState<boolean>(false);

  const [dataBlock, setDataBlock] = useState(0);
  const [gasPrice, setGasPrice] = useState('0');

  useEffect(() => {
    if (libraryProvider) {
      setProvider(libraryProvider);
    } else {
      setProvider(new JsonRpcProvider(BACKUP_PROVIDER));
    }
  }, [libraryProvider]);

  useEffect(() => {
    if (provider && account) {
      setCurrentSigner(provider?.getSigner(account?.toLowerCase()));
    }
  }, [provider, account]);

  useEffect(() => {
    setSignerOrProvider(currentSigner ? currentSigner : provider);
  }, [provider, currentSigner]);

  // Wallet connection and disconnection
  // clean local storage
  const cleanConnectorStorage = useCallback((): void => {
    if (connector instanceof WalletConnectConnector) {
      localStorage.removeItem('walletconnect');
    }
    if (connector instanceof WalletLinkConnector) {
      localStorage.removeItem('-walletlink:https://www.walletlink.org:version');
      localStorage.removeItem('-walletlink:https://www.walletlink.org:session:id');
      localStorage.removeItem('-walletlink:https://www.walletlink.org:session:secret');
      localStorage.removeItem('-walletlink:https://www.walletlink.org:session:linked');
      localStorage.removeItem('-walletlink:https://www.walletlink.org:AppVersion');
      localStorage.removeItem('-walletlink:https://www.walletlink.org:Addresses');
      localStorage.removeItem('-walletlink:https://www.walletlink.org:walletUsername');
    }
  }, [connector]);

  const disconnectWallet = useCallback(async () => {
    cleanConnectorStorage();

    localStorage.removeItem('walletProvider');
    deactivate();

    // @ts-expect-error close can be returned by wallet
    if (connector && connector.close) {
      // @ts-expect-error idk
      await connector.close();
    }

    setDeactivated(true);

    setLoading(false);

    window.location.reload();
  }, [provider, connector]);

  const connectWallet = useCallback(
    async (wallet: WalletType) => {
      setLoading(false);
      try {
        const connector: AbstractConnector = getWallet(wallet, chainId);

        if (connector instanceof WalletConnectConnector) {
          connector.walletConnectProvider = undefined;
        }

        await activate(connector, undefined, true);
        setConnector(connector);
        localStorage.setItem('walletProvider', wallet.toString());
        setDeactivated(false);
        setLoading(false);
        return true;
      } catch (e) {
        const err = e as Error;
        setError(err);
        setLoading(false);
        console.error(err);

        throw new Error('Error connecting to');
      }
    },
    [disconnectWallet],
  );

  useEffect(() => {
    if (provider) {
      // console.log('started auto refresh of blockNumber for', provider);
      provider.on('block', (n: number) => {
        const tempSignerOrProvider = signerOrProvider ? signerOrProvider : provider;

        getGasPrice(tempSignerOrProvider!).then(setGasPrice);
        if (n > dataBlock) {
          setDataBlock(n);
        }
      });
      return () => {
        // console.log('stopped auto refresh of blockNumber for', provider);
        provider.on('block', () => {
          console.log();
        });
      };
    }
  }, [provider]);

  // handle logic to eagerly connect to the injected ethereum provider,
  // if it exists and has granted access already
  useEffect(() => {
    const lastWalletProvider = localStorage.getItem('walletProvider');
    if (!active && !deactivated) {
      if (lastWalletProvider) {
        connectWallet(lastWalletProvider as WalletType).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    }
  }, [activate, setTried, active, connectWallet, deactivated]);

  useEffect(() => {
    if (window && window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return (
    <Web3Context.Provider
      value={{
        web3ProviderData: {
          connectWallet,
          disconnectWallet,
          provider,
          currentSigner,
          connected: active,
          loading,
          chainId: chainId || 1,
          dataBlock,
          gasPrice,
          error,
          currentAccount: account?.toLowerCase() || '',
          signerOrProvider,
        },
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3Context = () => {
  const { web3ProviderData } = useContext(Web3Context);
  if (Object.keys(web3ProviderData).length === 0) {
    throw new Error(
      'useWeb3Context() can only be used inside of <Web3ContextProvider />, ' + 'please declare it at a higher level.',
    );
  }

  return web3ProviderData;
};
