import { useState } from 'react';
import { Typography, Button } from '@mui/material';
import { ContractReceipt } from 'ethers';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useContract } from 'wagmi';

import { useLight, useAmphContracts, useAcknowledgeTerms } from '~/hooks';
import SVGBox from '../icons/misc/SVGBox';
import { useModalContext } from '../libs/modal-content-provider/ModalContentProvider';

export const OpenVaultButton = () => {
  const { updateTransactionState } = useModalContext();
  const { isConnected, address } = useAccount();
  const isLight = useLight();
  const [ishovered, setIshovered] = useState(false);
  const { openConnectModal } = useConnectModal();
  const { VaultControllerContract } = useAmphContracts();
  const VC = useContract(VaultControllerContract);
  const handleConnect = useAcknowledgeTerms();

  const openVault = async () => {
    if ((!isConnected || !address) && openConnectModal) {
      handleConnect();
      return;
    }

    try {
      if (VC) {
        const mintVaultRes = await VC.mintVault();
        updateTransactionState(mintVaultRes);
        const mintVaultReceipt = await mintVaultRes.wait();
        updateTransactionState(mintVaultReceipt);
        return mintVaultRes;
      }
    } catch (err) {
      updateTransactionState(err as ContractReceipt);
      throw new Error('Error creating vault');
    }
  };

  return (
    <Button
      variant='contained'
      sx={{
        width: '100%',
        backgroundColor: 'button.status',
        boxShadow: 0,
        color: isLight ? '#FFFFFF' : '#353947',
        '&:hover': {
          backgroundColor: 'button.hoverGray',
        },
      }}
      onClick={openVault}
      onMouseEnter={() => setIshovered(true)}
      onMouseLeave={() => setIshovered(false)}
    >
      <SVGBox svg_name={ishovered ? 'unlock' : 'lock'} width={16} height={16} sx={{ mr: 1 }} />

      <Typography variant='body1' lineHeight={1}>
        Open a Vault
      </Typography>
    </Button>
  );
};
