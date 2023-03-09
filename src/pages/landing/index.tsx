import { AppBar, useMediaQuery, useTheme } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';

import { formatColor, neutral } from '../../theme';
import { Cards } from './cards';
import { Community } from './community';
import { Fractional } from './fractional';
import { Highlights } from './highlights';
import { Splash } from './splash';
import { Values } from './values';
import { Footer } from '../../components/partials/footer';
import { LandingDesktopToolbar } from './desktopToolbar';
import { LandingMobileToolbar } from './mobileToolbar';

const TopBar: React.FC<{ sx?: any }> = (props?: { sx?: any }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        paddingTop: { xs: 1, md: 5 },
        paddingX: isMobile ? 1 : 2,
        width: '100%',
        margin: 'auto',
        paddingBottom: 5,
        left: 0,
        right: 0,
        ...props?.sx,
      }}
    >
      {isMobile ? <LandingMobileToolbar /> : <LandingDesktopToolbar />}
    </AppBar>
  );
};

const LandingPage: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.documentElement.scrollTop);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  return (
    <>
      <Box
        sx={{
          marginX: 'auto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <TopBar
          sx={{
            transition: 'top 0.6s',
            top:
              scrollTop < 30 || scrollTop > document.documentElement.scrollHeight - window.innerHeight - 30
                ? '0'
                : -160,
            backgroundColor: scrollTop < 50 ? 'transparent' : formatColor(neutral.white),
          }}
        />

        <Splash />
        <Cards />
        <Fractional />
        <Highlights />
        <Values />
        <Community />
        <Footer />
      </Box>
    </>
  );
};

export default LandingPage;
