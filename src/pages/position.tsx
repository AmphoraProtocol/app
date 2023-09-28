import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Box, Typography, useTheme } from '@mui/material';

import { ProtocolStatsCard } from '~/components/cards';
import { StatsMeter } from '~/components/statsMeter';
import { SingleStatCard } from '~/components/cards';
import { InverseButton } from '~/components/button';
import { TitleTextToolTip } from '~/components/text/TitleTextToolTip';
import { useModalContext, ModalType } from '~/components/libs/modal-content-provider/ModalContentProvider';
import { OpenVaultButton } from '~/components/button/OpenVaultButton';
import { useAppDispatch, useAppSelector } from '~/hooks';
import { CollateralActions } from '~/store';
import { getConfig } from '~/config';

const Position = () => {
  const { setType } = useModalContext();
  const theme = useTheme();
  const vaultControllerData = useAppSelector((state) => state.VC);
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { DEFAULT_CHAIN_ID } = getConfig();

  useEffect(() => {
    if (vaultControllerData.collaterals) {
      dispatch(
        CollateralActions.getCollateralData({
          userAddress: address,
          vaultAddress: vaultControllerData.userVault.vaultAddress,
          tokens: vaultControllerData.collaterals,
          chainId: chain?.id || DEFAULT_CHAIN_ID,
        }),
      );
    }
  }, [
    DEFAULT_CHAIN_ID,
    address,
    chain?.id,
    dispatch,
    vaultControllerData.collaterals,
    vaultControllerData.userVault.vaultAddress,
  ]);

  return (
    <Box display='flex' flexDirection={{ xs: 'column-reverse', lg: 'column' }}>
      <Typography mb={2} color='text.primary' display={{ xs: 'none', lg: 'block' }}>
        Your Position
      </Typography>
      <Box
        sx={{
          marginBottom: 8,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: 2,
          [theme.breakpoints.down('lg')]: {
            gridTemplateColumns: '1fr',
            rowGap: 2,
            mb: 3,
          },
        }}
      >
        <ProtocolStatsCard />
        <StatsMeter />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gap: 2,
          mb: 3,
          [theme.breakpoints.down('lg')]: {
            gridTemplateColumns: '1fr',
            mt: 3,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', lg: 'row' },
          }}
        >
          <SingleStatCard>
            <TitleTextToolTip
              title={`Borrowing Power`}
              tooltipcontent='Maximum amount that your vault can borrow, calculated by the sum of collateral values discounted by the LTV'
              text={
                vaultControllerData.userVault.borrowingPower || isConnected
                  ? vaultControllerData.userVault.borrowingPower.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })
                  : '-'
              }
            />
          </SingleStatCard>
          <SingleStatCard>
            <TitleTextToolTip
              title={`Deposit APR`}
              tooltipcontent='Current annualized rate paid to USDA holders'
              text={
                vaultControllerData.depositAPR || vaultControllerData.depositAPR === 0
                  ? vaultControllerData.depositAPR.toFixed(2) + '%'
                  : null
              }
            />
          </SingleStatCard>
          <SingleStatCard>
            <TitleTextToolTip
              title={`Borrow APR`}
              tooltipcontent='Current annualized rate paid by USDA borrowers'
              text={
                vaultControllerData.borrowAPR || vaultControllerData.borrowAPR === 0
                  ? vaultControllerData.borrowAPR.toFixed(2) + '%'
                  : null
              }
            />
          </SingleStatCard>
        </Box>

        <SingleStatCard>
          <Box
            display='flex'
            justifyContent='space-between'
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              columnGap: 12,
              [theme.breakpoints.down('lg')]: {
                flexWrap: 'wrap',
                rowGap: 2,
              },
            }}
          >
            <TitleTextToolTip
              title={`USDA Borrowed`}
              tooltipcontent='The amount of USDA your vault is currently borrowing. This increases as interest accrue.'
              text={
                vaultControllerData.userVault.accountLiability || isConnected
                  ? '$' + Math.round(vaultControllerData.userVault.accountLiability).toLocaleString()
                  : '-'
              }
            />

            {vaultControllerData.userVault.vaultID ? (
              <Box display='grid' alignItems='center' columnGap={2} width='100%' gridTemplateColumns='1fr 1fr'>
                <InverseButton
                  sx={{ width: '100%', height: { xs: 37, md: 48 } }}
                  onClick={() => setType(ModalType.Borrow)}
                >
                  <Typography variant='body1'>Borrow</Typography>
                </InverseButton>

                <InverseButton
                  sx={{ width: '100%', height: { xs: 37, md: 48 } }}
                  onClick={() => setType(ModalType.Repay)}
                >
                  <Typography variant='body1'>Repay</Typography>
                </InverseButton>
              </Box>
            ) : (
              <Box maxWidth={{ xs: 'auto', md: 350 }} width='100%' display='flex' alignItems='center'>
                <OpenVaultButton />
              </Box>
            )}
          </Box>
        </SingleStatCard>
      </Box>
    </Box>
  );
};

export default Position;
