import { Box, Button, Typography } from '@mui/material';
import { useAccount } from 'wagmi';

import { CopyButton } from '../button';
import { addressShortener } from '../text';
import { ToolTip } from '../tooltip/ToolTip';
import { CardContainer } from '../cards/CardContainer';
import { ClaimsCard } from '../cards/ClaimsCard';
import { useAcknowledgeTerms, useAppSelector } from '~/hooks';
import { formatColor, neutral } from '~/theme';

export const UserIPTVault = () => {
  const { isConnected } = useAccount();
  const { vaultAddress } = useAppSelector((state) => state.VC.userVault);
  const handleConnect = useAcknowledgeTerms();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        columnGap: 3,
        rowGap: 3,
        justifyContent: {
          xs: 'space-between',
        },
        alignItems: 'center',
        marginBottom: 3,
      }}
    >
      <ClaimsCard />

      <CardContainer>
        <Box display='flex' alignItems='center' justifyContent='space-between' p={{ xs: 2, lg: 3 }}>
          <Box>
            <ToolTip
              content={
                <Typography variant='body3'>
                  Each vault is a unique smart contract. You can deposit ERC20 collateral directly to your vault to
                  increase the vault&apos;s borrowing power. (Do NOT transfer unwrapped ETH to your vault; it may not be
                  recoverable.)
                </Typography>
              }
              text={`Vault Address`}
              text_variant='label_semi'
            />
            <Typography color='text.primary' variant='h7'>
              {addressShortener(vaultAddress ? vaultAddress : '0x0000000000000000000000000000000000000000')}
            </Typography>
          </Box>

          {isConnected ? (
            vaultAddress ? (
              <CopyButton copy={vaultAddress} />
            ) : (
              <CopyButton copy={`0x0000000000000000000000000000000000000000`} />
            )
          ) : (
            <Box display='flex' height='48px'>
              <Button
                variant='contained'
                onClick={handleConnect}
                sx={{
                  backgroundColor: 'button.mintRedeem',
                  color: formatColor(neutral.white),
                  width: '100%',
                }}
              >
                Connect Wallet
              </Button>
            </Box>
          )}
        </Box>
      </CardContainer>
    </Box>
  );
};
