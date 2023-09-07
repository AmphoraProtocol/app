import { useRef, useState, useContext } from 'react';
import { Box, Button, Link as MuiLink, SwipeableDrawer, Toolbar } from '@mui/material';

import { MenuIcon } from '~/components/icons/misc/menuIcon';
import { Link } from '~/components/link';
import { SelectedChainButton } from '~/components/button';
import { ForwardIcon } from '~/components/icons/misc/ForwardIcon';
import { useLight } from '~/hooks';
import { formatColor, neutral } from '~/theme';
import { PaletteModeContext } from '~/components/libs/palette-mode-provider/palette-mode-provider';
import { MobileIconButton } from './MobileIconButton';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import SVGBox from '~/components/icons/misc/SVGBox';

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const MobileToolBar = () => {
  // mobile menu config
  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuButtonRef = useRef<HTMLButtonElement>(null);

  const { toggleMode } = useContext(PaletteModeContext);

  const isLight = useLight();

  return (
    <Toolbar
      sx={{
        marginTop: 3,
        marginBottom: 3,
        paddingX: { xs: 1 },
        justifyContent: {
          xs: 'space-between',
        },
      }}
    >
      <MuiLink component={Link} to='#' aria-level={1}>
        <SVGBox img_name='AMPHORA.png' width={50} height={50} />
      </MuiLink>

      <Box display='flex'>
        <SelectedChainButton />

        <Box display='flex' marginLeft={2} marginRight={1}>
          <ConnectButton chainStatus='none' showBalance={false} accountStatus='address' />
        </Box>

        <Button
          ref={navMenuButtonRef}
          sx={{
            p: 0,
            display: 'flex',
            minWidth: 'auto',
          }}
          onClick={() => setNavMenuOpen(true)}
        >
          <MenuIcon sx={{ width: 32, height: 32, fill: '#5E64F4' }} />
        </Button>
      </Box>

      <SwipeableDrawer
        open={navMenuOpen}
        anchor='right'
        onClose={() => {
          setNavMenuOpen(false);
        }}
        onOpen={() => {
          setNavMenuOpen(true);
        }}
        PaperProps={{
          elevation: 12,
          sx: {
            py: 5,
            px: 4,
            height: '100%',
            width: '80%',
            backgroundColor: 'mobileToolBar.background',
            backgroundImage: 'none',
            display: 'flex',
            justifyContent: 'start',
          },
        }}
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        transitionDuration={500}
      >
        <Button
          onClick={() => {
            setNavMenuOpen(false);
          }}
          sx={{
            display: 'flex',
            alignSelf: 'start',
            width: 'auto',
            height: 23,
            marginBottom: 3,
            minWidth: 14,
            padding: 0,
          }}
        >
          <ForwardIcon stroke={isLight ? formatColor(neutral.black) : formatColor(neutral.white)} />
        </Button>
        <MobileIconButton text='App' img='rocket' href='/' />
        <MobileIconButton text='Governance' img='people' href='https://www.tally.xyz/gov/amphora-dao' />
        <br />
        <MobileIconButton text='Docs' img='cog' href='https://amphora-protocol.gitbook.io/amphora-protocol/' />
        <MobileIconButton text='Bootstrap Tool' img='feedback' href='https://fastdapp.xyz/app/ipfs%3A%2F%2Fbafybeibwtlejzrbyet7fdy45p65v6iaobn6b6ssr4xfvpi6ilnknw7acha%2F40643c9e9803f2374742933a9482ecb0f9c5ad0c.json' />
        <br />
        <MobileIconButton text='Discord' img='discord_icon_grey' href='https://discord.gg/EXSYFTgwp6' />
        <MobileIconButton text={isLight ? `Light Mode` : 'Dark Mode'} img='sun' onClick={toggleMode} />
      </SwipeableDrawer>
    </Toolbar>
  );
};
