import { Box, SxProps } from '@mui/material';
import React from 'react';
import { CardContainer } from './CardContainer';

export const SingleStatCard = ({ children, sx }: { children: React.ReactElement; sx?: SxProps }) => {
  return (
    <CardContainer>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: { xs: 2, md: 3 },
          ...sx,
        }}
      >
        {children}
      </Box>
    </CardContainer>
  );
};
