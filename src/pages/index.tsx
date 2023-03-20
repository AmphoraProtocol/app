import { formatColor, neutral } from '../theme';
import { Box, Typography, useTheme } from '@mui/material';
import { useWeb3Context } from '../components/libs/web3-data-provider/Web3Provider';
import { ProtocolStatsCard } from '../components/util/cards';
import { StatsMeter } from '../components/util/statsMeter';
import { UserStats } from '../components/util/UserStats';
import { useRolodexContext } from '../components/libs/rolodex-data-provider/RolodexDataProvider';
import { useEffect, useState } from 'react';
import { useVaultDataContext } from '../components/libs/vault-data-provider/VaultDataProvider';
import Cookies from 'universal-cookie';
import fetchVaultOf from '../contracts/Vault/fetchVaultOf';
import { getTotalSupply, getReserveRatioPercentage } from '../contracts/USDI';
import { BN } from '../easy/bn';
import { GweiBlockText, TitleText } from '../components/util/text';
import { SingleStatCard } from '../components/util/cards';
import { InverseButton } from '../components/util/button';
import { TitleTextToolTip } from '../components/util/text/TitleTextToolTip';
import { useModalContext, ModalType } from '../components/libs/modal-content-provider/ModalContentProvider';
import { OpenVaultButton } from '../components/util/button/OpenVaultButton';
import { Substat } from '../components/util/text/Substat';
import { useLight } from '../hooks/useLight';
import { UserIPTVault } from '../components/util/UserStats/UserIPTVault';
import SVGBox from '../components/icons/misc/SVGBox';
import { RedirectTo } from '../components/util/redirect';
import getAPRs from '../contracts/USDI/getAPRs';
import { useStableCoinsContext } from '~/components/libs/stable-coins-provider/StableCoinsProvider';

const Dashboard = () => {
  // temporary
  // const cookies = new Cookies();
  // const firstVisitExists = cookies.get('first-visit');
  // if (!firstVisitExists) return <RedirectTo url='#/landing' />;

  const isLight = useLight();
  const { setType } = useModalContext();
  const theme = useTheme();
  const { currentAccount, dataBlock, chainId } = useWeb3Context();
  const rolodex = useRolodexContext();
  const { setVaultID, setVaultAddress, accountLiability, hasVault, borrowingPower } = useVaultDataContext();

  const [totalSupply, setTotalSupply] = useState<string>('');
  const [totalSUSDDeposited, setTotalSUSDDeposited] = useState<string>('');
  const { SUSD } = useStableCoinsContext();
  const [reserveRatio, setReserveRatio] = useState('0');
  const [borrowAPR, setBorrowAPR] = useState(0);
  const [depositAPR, setDepositAPR] = useState(0);

  useEffect(() => {
    if (currentAccount && rolodex) {
      fetchVaultOf(currentAccount, rolodex).then((res) => {
        if (res !== null) {
          setVaultID(res.vaultID);
          setVaultAddress(res.vaultAddress);
        }
      });
    }
  }, [currentAccount, rolodex]);

  useEffect(() => {
    if (rolodex && rolodex.SUSD && rolodex.addressUSDA) {
      rolodex.SUSD.balanceOf(rolodex.addressUSDA).then((val) => {
        setTotalSUSDDeposited(val.div(BN(`1e${SUSD.decimals}`)).toLocaleString());
      });

      getTotalSupply(rolodex).then(setTotalSupply);
      getReserveRatioPercentage(rolodex).then(setReserveRatio);
    }

    if (rolodex) {
      getAPRs(rolodex)
        .then(({ borrow, deposit }) => {
          setBorrowAPR(borrow);
          setDepositAPR(deposit);
        })
        .catch(() => {
          setBorrowAPR(0);
          setDepositAPR(0);
        });
    }
  }, [rolodex, dataBlock, chainId]);

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

              <TitleText title='USDA in Circulation' text={Math.round(Number(totalSupply)).toLocaleString()} />
            </>
          </SingleStatCard>

          <SingleStatCard>
            <>
              <SVGBox svg_name={`cube_${isLight ? 'light' : 'dark'}`} width={36} height={36} sx={{ mr: 3 }} />

              <TitleText title='sUSD in Reserve' text={Math.round(Number(totalSUSDDeposited)).toLocaleString()} />
            </>
          </SingleStatCard>
          <SingleStatCard>
            <>
              <SVGBox svg_name={`cylinder_${isLight ? 'light' : 'dark'}`} width={36} height={36} sx={{ mr: 3 }} />

              <TitleText title='Reserve Ratio' text={`${reserveRatio}%`} />
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
                  tooltipContent='Maximum amount that your vault can borrow, calculated by the sum of collateral values discounted by the LTV'
                  text={
                    borrowingPower !== null
                      ? borrowingPower?.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        })
                      : null
                  }
                />
              </SingleStatCard>
              <SingleStatCard>
                <TitleTextToolTip
                  title={`Deposit APR`}
                  tooltipContent='Current annualized rate paid to USDA holders'
                  text={depositAPR !== null ? depositAPR.toFixed(2) + '%' : null}
                />
              </SingleStatCard>
              <SingleStatCard>
                <TitleTextToolTip
                  title={`Borrow APR`}
                  tooltipContent='Current annualized rate paid by USDA borrowers'
                  text={borrowAPR !== null ? borrowAPR.toFixed(2) + '%' : null}
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
                  tooltipContent='The amount of USDA your vault is currently borrowing. This increases as interest accrue.'
                  text={accountLiability !== null ? '$' + Math.round(accountLiability).toLocaleString() : null}
                />

                {hasVault ? (
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
