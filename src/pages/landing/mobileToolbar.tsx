import { Button, Toolbar, Typography, useTheme, SwipeableDrawer, Link } from '@mui/material';
import { useState, useRef } from 'react';
import { Box } from '@mui/system';
import { ForwardIcon } from '../../components/icons/misc/ForwardIcon';
import { formatColor, neutral } from '../../theme';
import { MenuIcon } from '../../components/icons/misc/menuIcon';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import SVGBox from '../../components/icons/misc/SVGBox';

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const LandingMobileToolbar = () => {
  const theme = useTheme();

  const [navMenuOpen, setNavMenuOpen] = useState(false);
  const navMenuButtonRef = useRef<HTMLButtonElement>(null);

  const cookies = new Cookies();
  const nav = useNavigate();

  const toApp = () => {
    cookies.set('first-visit', 'not');
    nav('/', { replace: true });
  };

  return (
    <Toolbar
      sx={{
        marginTop: 3,
        justifyContent: {
          xs: 'space-between',
        },
      }}
    >
      <Link href='/' aria-level={1}>
        <SVGBox svg_name='ip_green' width={{ xs: 25, md: 50 }} height={{ xs: 25, md: 50 }} />
      </Link>

      <Box display='flex'>
        <Button
          ref={navMenuButtonRef}
          sx={{
            p: 1,
            display: 'flex',
            minWidth: 'auto',
          }}
          variant='text'
          color='secondary'
          onClick={() => setNavMenuOpen(true)}
        >
          <MenuIcon sx={{ fill: '#5E64F4', width: 32, height: 32 }} />
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
            py: 8,
            px: 4,
            height: '100%',
            width: '100%',
            backgroundColor: formatColor(neutral.white),
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
            height: 23,
            width: 'auto',
            marginBottom: 5,
            minWidth: 14,
            padding: 0,
            alignItems: 'start',
          }}
        >
          <ForwardIcon stroke='black' />
        </Button>

        <Box sx={{ gap: 4 }} display='flex' flexDirection='column'>
          <Button variant='text' onClick={toApp} sx={{ color: 'inherit', justifyContent: 'start', mb: -1, pl: 0 }}>
            <Typography variant='body3' color={formatColor(neutral.black)}>
              App
            </Typography>
          </Button>
          <Link href='#/whitepaper'>
            <Typography variant='body3' color={formatColor(neutral.black)}>
              Whitepaper
            </Typography>
          </Link>
          <Link href='#/docs'>
            <Typography variant='body3' color={formatColor(neutral.black)}>
              Docs
            </Typography>
          </Link>
        </Box>
      </SwipeableDrawer>
    </Toolbar>
  );
};
