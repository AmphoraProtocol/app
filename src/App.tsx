import { StrictMode, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import './theme/styles.css';

import { AppLayout } from './partials/app-layout';
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
  ClaimModal,
  AcknowledgeTerms,
} from './components/modal';
import { SwapTokenProvider } from './components/libs/swap-token-provider/SwapTokenProvider';

const DashboardContext = (props: { children: any }) => {
  return (
    <ModalContentProvider>
      <>
        <SwapTokenProvider>{props.children}</SwapTokenProvider>
        <DepositWithdrawCollateralModal />
        <DepositCollateralConfirmationModal />
        <WithdrawCollateralConfirmationModal />
        <DepositWithdrawSUSDModal />
        <BorrowRepayModal />
        <AcknowledgeTerms />
        <DepositSUSDConfirmationModal />
        <WithdrawSUSDConfirmationModal />
        <ClaimModal />
        <TransactionStatusModal />
      </>
    </ModalContentProvider>
  );
};

const AppRouter = () => {
  return (
    <Routes>
      <Route path={`/landing`} element={<LandingPage />} />
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
