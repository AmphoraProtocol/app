import { useConnectModal } from '@rainbow-me/rainbowkit';

import { ModalType, useModalContext } from '~/components/libs/modal-content-provider/ModalContentProvider';

export const useAcknowledgeTerms = () => {
  const { setType } = useModalContext();
  const { openConnectModal } = useConnectModal();

  const handleConnect = () => {
    const hasAcknowledgedTerms = localStorage.getItem('acknowledgeTerms');
    if (!hasAcknowledgedTerms) {
      setType(ModalType.AcknowledgeTerms);
    } else {
      openConnectModal && openConnectModal();
    }
  };

  return handleConnect;
};
