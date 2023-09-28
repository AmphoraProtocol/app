import { Outlet } from 'react-router-dom';
import { ModalContentProvider } from '~/components/libs/modal-content-provider/ModalContentProvider';
import { SwapTokenProvider } from '~/components/libs/swap-token-provider/SwapTokenProvider';
import { WrapTokenProvider } from '~/components/libs/wrap-token-provider/WrapTokenProvider';
import {
  DepositWithdrawCollateralModal,
  DepositCollateralConfirmationModal,
  WithdrawCollateralConfirmationModal,
  DepositWithdrawSUSDModal,
  BorrowRepayModal,
  AcknowledgeTerms,
  DepositSUSDConfirmationModal,
  WithdrawSUSDConfirmationModal,
  ClaimModal,
  TransactionStatusModal,
} from '~/components/modal';
import { UnwrapUSDAConfirmationModal } from '~/components/modal/UnwrapUSDAConfirmationModal';
import { WrapUSDAConfirmationModal } from '~/components/modal/WrapUSDAConfirmationModal';
import { AppLayout } from '~/partials/app-layout';

const DashboardContext = (props: { children: any }) => {
  return (
    <ModalContentProvider>
      <>
        <WrapTokenProvider>
          <SwapTokenProvider>{props.children}</SwapTokenProvider>
        </WrapTokenProvider>
        <DepositWithdrawCollateralModal />
        <DepositCollateralConfirmationModal />
        <WithdrawCollateralConfirmationModal />
        <DepositWithdrawSUSDModal />
        <BorrowRepayModal />
        <AcknowledgeTerms />
        <DepositSUSDConfirmationModal />
        <WithdrawSUSDConfirmationModal />
        <WrapUSDAConfirmationModal />
        <UnwrapUSDAConfirmationModal />
        <ClaimModal />
        <TransactionStatusModal />
      </>
    </ModalContentProvider>
  );
};

export default function Root() {
  return (
    <DashboardContext>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </DashboardContext>
  );
}
