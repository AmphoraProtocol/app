import { Box, Toolbar, Link } from '@mui/material';

import { ConnectWalletButton, SelectedChainButton } from '~/components/button';
import { useLight } from '~/hooks/useLight';
import { useAppGovernanceContext } from '~/components/libs/app-governance-provider/AppGovernanceProvider';
import { AppGovSwitch } from '~/components/switch';
import { DesktopMenu } from './DesktopMenu';

export const DesktopToolBar = () => {
  //desktop menu config

  const isLight = useLight();

  const { setIsApp } = useAppGovernanceContext();

  return (
    <Toolbar sx={{ padding: 0 }} disableGutters>
      {/* temporary */}
      <Link href='#' /* '#/landing' */ role='heading' aria-level={1}>
        <span style={{ fontSize: 35 }}>🏺</span>
        {/* <SVGBox svg_name={isLight ? 'ip_black' : 'ip_white'} width={50} height={50} /> */}
      </Link>
      {setIsApp !== undefined ? (
        <Box sx={{ gap: 3 }} display='flex' ml={3}>
          <AppGovSwitch />
          <Box display='flex' alignItems='center'></Box>
        </Box>
      ) : (
        <></>
      )}

      <Box sx={{ gap: 2 }} display='flex' mr={-1} ml='auto'>
        {/* temporary */}
        {/* {window.location.hash !== '#/sale' && (
          <Box mx={2} maxWidth={200} width='100%'>
            <TokenSaleButton />
          </Box>
        )} */}
        <SelectedChainButton />
        <ConnectWalletButton />
        <DesktopMenu />
      </Box>
    </Toolbar>
  );
};
