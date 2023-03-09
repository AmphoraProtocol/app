import { Box } from '@mui/material';
import { forwardRef } from 'react';

export const Flex: typeof Box = forwardRef((props, ref) => <Box ref={ref} flex={1} display='flex' {...props} />) as any;

export const FlexCol: typeof Box = forwardRef((props, ref) => (
  <Box ref={ref} flex={1} display='flex' flexDirection='column' {...props} />
)) as any;

export const FlexRow: typeof Box = forwardRef((props, ref) => (
  <Box ref={ref} flex={1} display='flex' flexDirection='row' {...props} />
)) as any;
