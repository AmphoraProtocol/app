import { useEffect } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { Box, Button, useTheme } from '@mui/material';

import { formatColor, neutral } from '../theme';
import { UserStats } from '~/components/UserStats';
import { SingleStatCard } from '~/components/cards';
import { useLight, useAppDispatch, useAppSelector } from '~/hooks';
import { UserIPTVault } from '~/components/UserStats/UserIPTVault';
import SVGBox from '~/components/icons/misc/SVGBox';
import { StablecoinActions, VCActions } from '~/store';
import { getConfig } from '~/config';
import { TitleText } from '~/components/text';
import Position from './position';
import Swap from './swap';

const Dashboard = () => {
  const isLight = useLight();
  const theme = useTheme();
  const vaultControllerData = useAppSelector((state) => state.VC);
  const dispatch = useAppDispatch();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { DEFAULT_CHAIN_ID } = getConfig();

  useEffect(() => {
    dispatch(VCActions.getVCData({ userAddress: address, chainId: chain?.id || DEFAULT_CHAIN_ID }));

    if (address) {
      dispatch(StablecoinActions.getStablesData({ userAddress: address, chainId: chain?.id || DEFAULT_CHAIN_ID }));
    }
  }, [chain?.id, address, DEFAULT_CHAIN_ID, dispatch]);

  return (
    <Box
      sx={{
        marginX: 'auto',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 5,
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
                title='snxUSD in Reserve'
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
        <Position />

        <Box>
          {/* Vault Section */}
          <UserIPTVault />

          {/* Assets Section */}
          <UserStats />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
