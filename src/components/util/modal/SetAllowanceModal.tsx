import { Box, Typography } from '@mui/material';
import { ModalType, useModalContext } from '../../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import { useVaultDataContext } from '../../libs/vault-data-provider/VaultDataProvider';
import { useState } from 'react';
import { DisableableModalButton } from '../button/DisableableModalButton';

type ButtonText = 'Set Allowance' | 'Allowance Set';

export const SetAllowanceModal = () => {
  const { type, setType } = useModalContext();

  const { vaultID } = useVaultDataContext();
  const { currentSigner } = useWeb3Context();
  const { setRefresh } = useVaultDataContext();

  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState<ButtonText>('Set Allowance');
  const [error, setError] = useState<string | undefined>();
  const mintVotingVault = async () => {
    try {
      if (vaultID && currentSigner) {
        setLoading(true);
        // set allowance request

        setLoading(false);

        setButtonText('Allowance Set');
        setRefresh(true);
      }
    } catch (err) {
      setLoading(false);
      const error = err as Error;
      setError(error.message);
    }
  };

  return (
    <BaseModal
      // open={type === ModalType.SetAllowance}
      open={true}
      setOpen={() => {
        setType(null);
      }}
      contentMaxWidth={400}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          rowGap: 2,
        }}
      >
        <Box component='img' mx='auto' height={141} width={170} src='images/check.png'></Box>

        <Typography variant='h7'>Set Contract Allowance</Typography>

        <Typography>Must enable capped tokens to deposit into the protocol. This is required only once.</Typography>

        <DisableableModalButton
          text={buttonText}
          disabled={false}
          onClick={mintVotingVault}
          loading={loading}
          load_text={'Pending Transaction'}
        />

        {error && (
          <Typography textAlign='center' color='red'>
            {error}
          </Typography>
        )}
      </Box>
    </BaseModal>
  );
};
