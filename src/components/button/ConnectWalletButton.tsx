import { useState } from 'react';
import {
  ButtonProps,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ClickAwayListener,
} from '@mui/material';
import { useAccount } from 'wagmi';
import { useLight } from '~/hooks/useLight';

import { useWalletModalContext } from '../libs/wallet-modal-provider/WalletModalProvider';
import { WalletModal } from '../modal';
import { addressShortener } from '../text';

export const ConnectWalletButton = () => {
  const { setIsWalletModalOpen } = useWalletModalContext();

  const { isConnected } = useAccount();
  const [expanded, setExpanded] = useState(false);

  const StyledConnectButton = (props: ButtonProps) => {
    const { onClick, children, sx } = props;

    const isLight = useLight();
    return (
      <Button
        sx={{
          minWidth: 'auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          px: 3,
          justifyContent: 'space-between',
          backgroundColor: 'button.header',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.03)',
          border: isLight ? '1px solid #F4F4F4' : 'none',
          '&:hover': {
            backgroundColor: 'button.hover',
          },
          ...sx,
        }}
        size='large'
        onClick={onClick}
      >
        <Typography variant='label' whiteSpace='nowrap' color='text.primary'>
          {children}
        </Typography>
      </Button>
    );
  };

  return (
    <>
      {isConnected ? (
        <ClickAwayListener onClickAway={() => setExpanded(false)}>
          <Accordion
            sx={{ borderRadius: '10px !important', boxShadow: 'none' }}
            disableGutters
            TransitionProps={{ unmountOnExit: true }}
            expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            <AccordionSummary
              sx={{
                padding: 0,
                '& .MuiAccordionSummary-content': {
                  margin: 0,
                },
              }}
              aria-controls='panel1a-content'
              id='panel1a-header'
            >
              <StyledConnectButton>{addressShortener('test')}</StyledConnectButton>
            </AccordionSummary>
            <AccordionDetails sx={{ position: 'absolute', px: 0, width: '100%' }}>
              <StyledConnectButton
                onClick={() => console.log('Disconnect account')}
                sx={{ width: '100%', justifyContent: 'center' }}
              >
                Disconnect
              </StyledConnectButton>
            </AccordionDetails>
          </Accordion>
        </ClickAwayListener>
      ) : (
        <>
          <StyledConnectButton onClick={() => setIsWalletModalOpen(true)}>Connect wallet</StyledConnectButton>
          <WalletModal />
        </>
      )}
    </>
  );
};
