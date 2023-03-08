import { Box } from '@mui/system';
import React, { useState } from 'react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Button, Typography } from '@mui/material';
import { formatColor, neutral } from '../../theme';
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
