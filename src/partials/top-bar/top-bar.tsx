import { AppBar, AppBarProps, useMediaQuery, useTheme } from '@mui/material';

import { DesktopToolBar } from './DesktopToolBar';
import { MobileToolBar } from './MobileToolBar';

export const TopBar = (props: AppBarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <AppBar
      position='absolute'
      {...props}
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        paddingTop: { xs: 1, lg: 5 },
        paddingX: isMobile ? 1 : isTablet ? 10 : 10,
        maxWidth: 1500,
        margin: 'auto',
        left: 0,
        right: 0,
      }}
    >
      {isTablet ? <MobileToolBar /> : <DesktopToolBar />}
    </AppBar>
  );
};
