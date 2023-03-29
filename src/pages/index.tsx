import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Box, Typography, useTheme } from '@mui/material';
import Cookies from 'universal-cookie';

import { formatColor, neutral } from '../theme';
import { ProtocolStatsCard } from '../components/cards';
import { StatsMeter } from '../components/statsMeter';
import { UserStats } from '../components/UserStats';
import { GweiBlockText, TitleText } from '../components/text';
import { SingleStatCard } from '../components/cards';
import { InverseButton } from '../components/button';
import { TitleTextToolTip } from '../components/text/TitleTextToolTip';
import { useModalContext, ModalType } from '../components/libs/modal-content-provider/ModalContentProvider';
import { OpenVaultButton } from '../components/button/OpenVaultButton';
import { useLight } from '../hooks/useLight';
import { UserIPTVault } from '../components/UserStats/UserIPTVault';
import SVGBox from '../components/icons/misc/SVGBox';
import { useAppDispatch, useAppSelector } from '~/hooks/store';
import { CollateralActions, StablecoinActions, VCActions } from '~/store';
import { getTokensListOnCurrentChain } from '~/utils/tokens';
import { RedirectTo } from '../components/redirect';
import { Substat } from '../components/text/Substat';

const Dashboard = () => {
  // temporary
  // const cookies = new Cookies();
  // const firstVisitExists = cookies.get('first-visit');
  // if (!firstVisitExists) return <RedirectTo url='#/landing' />;
  const isLight = useLight();
  const { setType } = useModalContext();
  const theme = useTheme();
  const vaultControllerData = useAppSelector((state) => state.VC);
  const dispatch = useAppDispatch();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  useEffect(() => {
    dispatch(VCActions.getVCData({ userAddress: address }));
    dispatch(
      CollateralActions.getCollateralData({
        userAddress: address,
        vaultAddress: vaultControllerData.userVault.vaultAddress,
        tokens: getTokensListOnCurrentChain(chain?.id || 1),
      }),
    );

    if (address) {
      dispatch(StablecoinActions.getStablesData({ userAddress: address }));
    }
  }, [vaultControllerData.userVault.vaultAddress, chain?.id, address]);

  return (
    <Box
      sx={{
        marginX: 'auto',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        color={formatColor(neutral.black)}
        textAlign='left'
        maxWidth='xl'
        pt={{ xs: 2, sm: 0 }}
        pb={{ xs: 5, sm: 10 }}
        px={{ xs: 2, md: 10 }}
        margin='auto'
        position='relative'
        sx={{
          [theme.breakpoints.down('md')]: {
            mb: 0,
            marginLeft: 'auto',
          },
        }}
      >
        {/* Global Data Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            my: 3,
            [theme.breakpoints.down('lg')]: {
              flexDirection: 'column',
            },
          }}
        >
          <SingleStatCard>
            <>
              <SVGBox svg_name={`globe_${isLight ? 'light' : 'dark'}`} width={36} height={36} sx={{ mr: 3 }} />

              <TitleText
                title='USDA in Circulation'
                text={Math.round(vaultControllerData.usdaSupply).toLocaleString()}
              />
            </>
          </SingleStatCard>

          <SingleStatCard>
            <>
              <SVGBox svg_name={`cube_${isLight ? 'light' : 'dark'}`} width={36} height={36} sx={{ mr: 3 }} />

              <TitleText
                title='sUSD in Reserve'
                text={Math.round(Number(vaultControllerData.totalSUSDDeposited)).toLocaleString()}
              />
            </>
          </SingleStatCard>
          <SingleStatCard>
            <>
              <SVGBox svg_name={`cylinder_${isLight ? 'light' : 'dark'}`} width={36} height={36} sx={{ mr: 3 }} />

              <TitleText title='Reserve Ratio' text={`${vaultControllerData.reserveRatio}%`} />
            </>
          </SingleStatCard>
        </Box>

        {/* Your Position Section */}
        <Box display='flex' flexDirection={{ xs: 'column-reverse', lg: 'column' }}>
          <Typography mt={8} mb={2} color='text.primary' display={{ xs: 'none', lg: 'block' }}>
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
                    vaultControllerData.userVault.borrowingPower
                      ? vaultControllerData.userVault.borrowingPower.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })
                      : '0'
                  }
                />
              </SingleStatCard>
              <SingleStatCard>
                <TitleTextToolTip
                  title={`Deposit APR`}
                  tooltipcontent='Current annualized rate paid to USDA holders'
                  text={vaultControllerData.depositAPR ? vaultControllerData.depositAPR.toFixed(2) + '%' : null}
                />
              </SingleStatCard>
              <SingleStatCard>
                <TitleTextToolTip
                  title={`Borrow APR`}
                  tooltipcontent='Current annualized rate paid by USDA borrowers'
                  text={vaultControllerData.borrowAPR ? vaultControllerData.borrowAPR.toFixed(2) + '%' : null}
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
                    vaultControllerData.userVault.accountLiability
                      ? '$' + Math.round(vaultControllerData.userVault.accountLiability).toLocaleString()
                      : '0'
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

        <Box>
          {/* Vault Section */}
          <UserIPTVault />

          {/* Assets Section */}
          <UserStats />
        </Box>
      </Box>

      <Box maxWidth='xl' margin='auto'>
        {/* Gas Section */}
        <GweiBlockText />
      </Box>
    </Box>
  );
};

export default Dashboard;
