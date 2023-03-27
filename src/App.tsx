import { StrictMode, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import './theme/fonts.css';

import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import { AppLayout } from './partials/app-layout';
import { Web3ContextProvider } from './components/libs/web3-data-provider/Web3Provider';
import { WalletModalProvider } from './components/libs/wallet-modal-provider/WalletModalProvider';
import { ModalContentProvider } from './components/libs/modal-content-provider/ModalContentProvider';
import { PaletteModeContextProvider } from './components/libs/palette-mode-provider/palette-mode-provider';
import Dashboard from './pages';
import LandingPage from './pages/landing';
import NotFound404Page from './pages/404';
import {
  DepositWithdrawSUSDModal,
  DepositWithdrawCollateralModal,
  BorrowRepayModal,
  WithdrawSUSDConfirmationModal,
  DepositSUSDConfirmationModal,
  WithdrawCollateralConfirmationModal,
  DepositCollateralConfirmationModal,
  TransactionStatusModal,
} from './components/modal';
import { ClaimModal } from './components/modal/ClaimModal';
import { RolodexContentProvider } from './components/libs/rolodex-data-provider/RolodexDataProvider';
import { SwapTokenProvider } from './components/libs/swap-token-provider/SwapTokenProvider';
import { TestingPage } from './pages/playground';
import { RedirectTo } from './components/redirect';

import { mainnet } from 'viem/chains';
import { createPublicClient, http } from 'viem';
import { BACKUP_PROVIDER } from './constants';

export const viemClient = createPublicClient({
  chain: mainnet,
  transport: http(BACKUP_PROVIDER),
});

// https://github.com/NoahZinsmeister/web3-react/tree/v6/docs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const WalletContext = (props: { children: any }) => {
  return <Web3ReactProvider getLibrary={getWeb3Library}>{props.children}</Web3ReactProvider>;
};

const DashboardContext = (props: { children: any }) => {
  return (
    <Web3ContextProvider>
      <RolodexContentProvider>
        <ModalContentProvider>
          <>
            <WalletModalProvider>
              <>
                <SwapTokenProvider>{props.children}</SwapTokenProvider>
                <DepositWithdrawCollateralModal />
                <DepositCollateralConfirmationModal />
                <WithdrawCollateralConfirmationModal />
                <DepositWithdrawSUSDModal />
                <BorrowRepayModal />
                <DepositSUSDConfirmationModal />
                <WithdrawSUSDConfirmationModal />
                <ClaimModal />
                <TransactionStatusModal />
              </>
            </WalletModalProvider>
          </>
        </ModalContentProvider>
      </RolodexContentProvider>
    </Web3ContextProvider>
  );
};

const AppRouter = () => {
  return (
    <WalletContext>
      <Routes>
        <Route path={`/landing`} element={<LandingPage />} />
        <Route path={`/docs`} element={<RedirectTo url='book/docs/intro/index.html' />} />
        <Route path={`/book`} element={<RedirectTo url='book/docs/intro/index.html' />} />
        <Route path={`/testing`} element={<TestingPage />} />
        <Route path={`*`} element={<NotFound404Page />} />

        <Route
          path={`/`}
          element={
            <DashboardContext>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </DashboardContext>
          }
        />
      </Routes>
    </WalletContext>
  );
};

const App = () => {
  return (
    <StrictMode>
      <Suspense fallback={<p>Loading...</p>}>
        <StyledEngineProvider injectFirst>
          <PaletteModeContextProvider>
            <>
              <CssBaseline />
              <AppRouter />
            </>
          </PaletteModeContextProvider>
        </StyledEngineProvider>
      </Suspense>
    </StrictMode>
  );
};

export default App;
