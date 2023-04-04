import { Box, Toolbar, Link } from '@mui/material';

import { SelectedChainButton } from '~/components/button';
import { useLight } from '~/hooks';
import { AppGovSwitch } from '~/components/switch';
import { DesktopMenu } from './DesktopMenu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
// import { useAppGovernanceContext } from '~/components/libs/app-governance-provider/AppGovernanceProvider';

export const DesktopToolBar = () => {
  //desktop menu config

  const isLight = useLight();

  // const { setIsApp } = useAppGovernanceContext();

  return (
    <Toolbar sx={{ padding: 0 }} disableGutters>
      {/* temporary */}
      <Link href='#' /* '#/landing' */ role='heading' aria-level={1}>
        <span style={{ fontSize: 35 }}>🏺</span>
        {/* <SVGBox svg_name={isLight ? 'ip_black' : 'ip_white'} width={50} height={50} /> */}
      </Link>
      <Box sx={{ gap: 3 }} display='flex' ml={3}>
        <AppGovSwitch />
        <Box display='flex' alignItems='center'></Box>
      </Box>

      <Box sx={{ gap: 2 }} display='flex' mr={-1} ml='auto'>
        <SelectedChainButton />
        <Box display='flex'>
          <ConnectButton chainStatus='none' showBalance={false} accountStatus='address' />
        </Box>

        <DesktopMenu />
      </Box>
    </Toolbar>
  );
};
