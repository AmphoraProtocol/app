import { Box } from '@mui/system';
import React, { useState } from 'react';
import { DiscreteSliderSteps } from '../landing/visuals/comparing';

export const TestingPage: React.FC = () => {
  return (
    <Box
      display='flex'
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <DiscreteSliderSteps />
    </Box>
  );
};
