import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, localhost } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import '@rainbow-me/rainbowkit/styles.css';

import store from '~/store';
import App from './App';

const { chains, provider } = configureChains(
  [mainnet, localhost],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: 'https://eth.llamarpc.com',
      }),
    }),
    publicProvider(),
  ],
);

const { connectors } = getDefaultWallets({
  appName: 'Amphora Protocol',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <Provider store={store}>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <HashRouter>
          <App />
        </HashRouter>
      </RainbowKitProvider>
    </WagmiConfig>
  </Provider>,
);
