import { ReactNode } from 'react';
import { Box } from '@mui/system';

import { Footer } from '../footer';
import { TopBar } from '../top-bar';

export const AppLayout = (props: { children: ReactNode }) => {
  const { children } = props;
  return (
    <Box>
      Warning: This version is not yet audited. Do not use assets you are unwilling to lose.
      <TopBar />
      <Box
        sx={(theme) => ({
          background: theme.palette.background.default,
          pt: { xs: 10, sm: 18 },
        })}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
