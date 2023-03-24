import { Box, Button, Typography, Link, CircularProgress } from '@mui/material';
import { useState } from 'react';
import SVGBox from '../icons/misc/SVGBox';
import { useWalletModalContext } from '../libs/wallet-modal-provider/WalletModalProvider';
import { WalletType } from '../libs/web3-data-provider/WalletOptions';
import { useWeb3Context } from '../libs/web3-data-provider/Web3Provider';

export const WalletModalContent = () => {
  const { connectWallet, loading } = useWeb3Context();
  const { setIsWalletModalOpen } = useWalletModalContext();
  const [errorConnecting, setErrorConnecting] = useState(false);

  const connectToWallet = async (walletType: WalletType) => {
    try {
      await connectWallet(walletType);

      setIsWalletModalOpen(false);
    } catch (err) {
      console.error(err);
      setErrorConnecting(true);
    }
  };
  return (
    <Box>
      <Typography variant='body3' position='relative' top={-8} textAlign='center'>
        Connect Wallet
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Button
            variant='outlined'
            sx={{
              justifyContent: 'start',
              my: 2,
              pl: 3,
            }}
            size='large'
            onClick={() => connectToWallet(WalletType.INJECTED)}
          >
            <SVGBox svg_name='metamask' width={26} sx={{ mr: 2 }} /> Browser wallet
          </Button>

          <Button
            variant='outlined'
            sx={{
              justifyContent: 'start',
              mb: 2,
              pl: 3,
            }}
            size='large'
            onClick={() => connectToWallet(WalletType.WALLET_LINK)}
          >
            <SVGBox width={26} height={26} svg_name='coinbase' alt='coinbase' sx={{ mr: 2 }} />
            Coinbase
          </Button>

          <Button
            variant='outlined'
            sx={{
              justifyContent: 'start',
              mb: 2,
              pl: 3,
            }}
            size='large'
            onClick={() => connectToWallet(WalletType.WALLET_CONNECT)}
          >
            <SVGBox svg_name='wallet_connect' width={26} sx={{ mr: 2 }} />
            Wallet Connect
          </Button>
          {errorConnecting && (
            <Typography color='error' variant='body2' textAlign='center'>
              Error connecting wallet. Please try another wallet.
            </Typography>
          )}
        </Box>
      )}

      <Box mt={0}>
        <Typography variant='label_semi'>
          By connecting a wallet, you agree to Amphora Protocols’{' '}
          <Link href='#' target='_blank'>
            Terms of Service{' '}
          </Link>
          and consent to its{' '}
          <Link href='#' target='_blank'>
            Privacy Policy.
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};
