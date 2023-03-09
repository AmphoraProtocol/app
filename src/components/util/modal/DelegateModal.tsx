import { Box, Typography, TextField } from '@mui/material';
import { useState, FormEvent } from 'react';
import { ContractReceipt } from 'ethers';

import { formatColor, neutral } from '../../../theme';
import { ModalType, useModalContext } from '../../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useLight } from '../../../hooks/useLight';
import { useAppGovernanceContext } from '../../libs/app-governance-provider/AppGovernanceProvider';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { ModalInputContainer } from './ModalContent/ModalInputContainer';
import { useVaultDataContext } from '../../libs/vault-data-provider/VaultDataProvider';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import { locale } from '../../../locale';
import { delegateVaultVotingPower } from '../../../contracts/Vault/delegateVaultVotingPower';
import SVGBox from '../../icons/misc/SVGBox';

export const DelegateModal = () => {
  const { type, setType, updateTransactionState } = useModalContext();
  const isLight = useLight();

  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');

  const [address, setAddress] = useState('');

  const toggle = () => setFocus(!focus);

  const { delegateToken } = useAppGovernanceContext();
  const { vaultAddress, votingVaultAddress, hasVotingVault } = useVaultDataContext();
  const { provider, currentAccount } = useWeb3Context();

  const handleDelegateRequest = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadmsg(locale('CheckWallet'));
    try {
      const delegateAddress = delegateToken.capped_address && hasVotingVault ? votingVaultAddress : vaultAddress;

      await delegateVaultVotingPower(
        delegateAddress!,
        delegateToken.address,
        address,
        provider!.getSigner(currentAccount)!,
      ).then(async (res) => {
        updateTransactionState(res);
        setLoadmsg(locale('TransactionPending'));
        setLoading(true);
        return res!.wait().then((res) => {
          setLoadmsg('');
          setLoading(false);

          updateTransactionState(res);
        });
      });
    } catch (e) {
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      console.log(e);

      const err = e as ContractReceipt;

      updateTransactionState(err);
    }
  };

  return (
    <BaseModal
      open={type === ModalType.Delegate}
      setOpen={() => {
        setType(null);
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          mb: 2.5,
          mt: 4,
          columnGap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2.5,
            mt: 4,
            columnGap: 2,
          }}
        >
          <SVGBox svg_name={delegateToken?.ticker} width={40} height={40} alt={delegateToken?.name} />
          <Box>
            <Typography variant='subtitle1' color='text.primary'>
              ${delegateToken?.ticker}
            </Typography>
          </Box>
        </Box>
        <Typography variant='body2' color={isLight ? formatColor(neutral.black) : formatColor(neutral.white)}>
          Enter the address you would like to delegate your vote(s) to
        </Typography>
        <Box component='form' onSubmit={handleDelegateRequest}>
          <Box my={2}>
            <ModalInputContainer focus={focus}>
              <TextField
                placeholder='Address'
                variant='standard'
                onBlur={toggle}
                onFocus={toggle}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                InputProps={{
                  sx: {
                    '&:before, &:after': {
                      borderBottom: 'none !important',
                    },
                  },
                }}
                sx={{
                  width: '100%',
                  paddingBottom: '4px',
                  '.MuiInputBase-input': {
                    fontWeight: 600,
                    color: isLight ? formatColor(neutral.gray1) : formatColor(neutral.white),
                  },
                }}
              />
            </ModalInputContainer>
          </Box>
          <DisableableModalButton
            type='submit'
            text='Delegate'
            loading={loading}
            shaking={shaking}
            load_text={loadmsg}
            onClick={handleDelegateRequest}
          />
        </Box>
      </Box>
    </BaseModal>
  );
};
