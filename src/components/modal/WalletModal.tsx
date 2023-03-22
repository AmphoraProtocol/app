import { useWalletModalContext } from '../libs/wallet-modal-provider/WalletModalProvider';
import { WalletModalContent } from '../walletModalContent/WalletModalContent';
import { BaseModal } from './BaseModal';

export const WalletModal = () => {
  const { isWalletModalOpen, setIsWalletModalOpen } = useWalletModalContext();
  return (
    <BaseModal open={isWalletModalOpen} setOpen={setIsWalletModalOpen} withCloseButton>
      <WalletModalContent />
    </BaseModal>
  );
};
