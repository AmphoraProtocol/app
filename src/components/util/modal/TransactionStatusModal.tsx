import { Box, Typography, Link as MuiLink, Button } from '@mui/material';
import { useLight } from '../../../hooks/useLight';
import { formatColor, neutral } from '../../../theme';
import { CircleExclamationIcon } from '../../icons/misc/CircleExclamationIcon';
import { ModalType, useModalContext } from '../../libs/modal-content-provider/ModalContentProvider';
import { Spinner } from '../loading';
import { BaseModal } from './BaseModal';
import { Chains } from '../../../chain/chains';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { useVaultDataContext } from '../../libs/vault-data-provider/VaultDataProvider';
import { useEffect } from 'react';
import SVGBox from '../../icons/misc/SVGBox';

export const TransactionStatusModal = () => {
  const { type, setType, transactionState, transaction } = useModalContext();
  const { chainId } = useWeb3Context();

  const { setRefresh } = useVaultDataContext();

  useEffect(() => {
    if (transactionState === 'SUCCESS') {
      setRefresh(true);
    }
  }, [transactionState]);

  const renderTransitionState = () => {
    const isLight = useLight();

    const chain = Chains.getInfo(chainId);

    switch (transactionState) {
      case 'PENDING':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='subtitle1' color='text.secondary' mb={1}>
              Pending Transaction
            </Typography>

            <Box my={3}>
              <Spinner />
            </Box>

            <MuiLink target='_blank' href={`${chain.scan_url}${(transaction as ContractTransaction).hash}`}>
              <Button variant='contained' sx={{ color: formatColor(neutral.white) }}>
                View on {chain.scan_site}
              </Button>
            </MuiLink>
          </Box>
        );

      case 'SUCCESS':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='subtitle1' color='text.secondary' mb={1}>
              Successful Transaction
            </Typography>

            <SVGBox svg_name='ip_green' width={30} height={30} alt='ip_green' sx={{ my: 3, mx: 'auto' }} />

            <MuiLink target='_blank' href={`${chain.scan_url}${(transaction as ContractReceipt).transactionHash}`}>
              <Button
                variant='contained'
                sx={{
                  color: formatColor(neutral.white),
                  display: 'block',
                  margin: 'auto',
                }}
              >
                View on {chain.scan_site}
              </Button>
            </MuiLink>
          </Box>
        );

      case 'FAILURE':
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant='subtitle1' color='text.secondary' mb={1}>
              Failed Transaction
            </Typography>
            <Box my={3}>
              <CircleExclamationIcon
                sx={{ width: 50 }}
                strokecolor={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)}
              />
            </Box>
            <MuiLink target='_blank' href={`${chain.scan_url}${(transaction as ContractReceipt).transactionHash}`}>
              <Button variant='contained' sx={{ color: formatColor(neutral.white) }}>
                View on {chain.scan_site}
              </Button>
            </MuiLink>
          </Box>
        );

      default:
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant='subtitle1' color='text.secondary' mb={1}>
            Error
          </Typography>
          <Box my={3}>
            <CircleExclamationIcon strokecolor={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)} />
          </Box>

          <Button variant='contained' sx={{ color: formatColor(neutral.white) }} onClick={() => setType(null)}>
            Please try again later
          </Button>
        </Box>;
        break;
    }
  };

  return (
    <BaseModal
      open={type === ModalType.TransactionStatus}
      setOpen={() => {
        setType(null);
      }}
      contentMaxWidth={400}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2.5,
          mt: 4,
          rowGap: 2,
        }}
      >
        {renderTransitionState()}
      </Box>
    </BaseModal>
  );
};
