import { HashRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { localhost, sepolia, mainnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import '@rainbow-me/rainbowkit/styles.css';

import { getConfig } from './config';
import store from '~/store';
import App from './App';

const { chains, provider } = configureChains(
  [sepolia, localhost, mainnet],
  [alchemyProvider({ apiKey: getConfig().ALCHEMY_KEY }), publicProvider()],
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
