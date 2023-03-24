import { Box, BoxProps } from '@mui/material';
import { useLight } from '~/hooks/useLight';

export const CardContainer = ({ children }: BoxProps) => {
  const isLight = useLight();
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'card.background',
        borderRadius: 3,
        border: `1px solid ${isLight ? '#F3F3F3' : '#242424'}`,
        boxShadow: isLight ? '0px 0px 6px 0px rgba(0,0,0, 0.08)' : 'none',
      }}
    >
      {children}
    </Box>
  );
};
