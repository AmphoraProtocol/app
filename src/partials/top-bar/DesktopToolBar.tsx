import { Box, Toolbar, Link, Typography } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { SelectedChainButton } from '~/components/button';
import { DesktopMenu } from './DesktopMenu';
import { formatColor, neutral } from '~/theme';
import SVGBox from '~/components/icons/misc/SVGBox';

const AppLinkTo = ({ url, label, newTarget }: { url: string; label: string; newTarget?: boolean }) => (
  <Typography
    sx={{
      color: formatColor(neutral.gray2),
      display: 'flex',
      zIndex: 10,
      variant: 'label',
      alignItems: 'center',
    }}
  >
    <Link href={url} sx={{ color: 'inherit' }} target={newTarget ? '_blank' : ''}>
      {label}
    </Link>
  </Typography>
);

//desktop menu config
export const DesktopToolBar = () => {
  return (
    <Toolbar sx={{ padding: 0 }} disableGutters>
      <Link href='#' /* '#/landing' */ role='heading' aria-level={1}>
        <SVGBox img_name='AMPHORA.png' width={50} height={50} />
      </Link>

      <Box sx={{ gap: 5 }} display='flex' ml={5}>
        <Typography
          sx={{
            color: formatColor(neutral.gray2),
            display: 'flex',
            zIndex: 10,
            variant: 'label',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          App
        </Typography>
        <AppLinkTo url='https://www.tally.xyz/' label='Governance' newTarget />
        <AppLinkTo url='https://www.tally.xyz/' label='Documentation' newTarget />
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
