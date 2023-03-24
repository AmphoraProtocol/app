import { Box, Typography } from '@mui/material';
import { SwapContainer } from '../swap';
import { CardContainer } from './CardContainer';

export const ProtocolStatsCard = () => {
  return (
    <CardContainer>
      <Box
        sx={{
          padding: { xs: 2, lg: 3 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box lineHeight={0} mb={3}>
          <Typography variant='body1' color='text.primary'>
            Mint or Redeem USDA
          </Typography>
        </Box>
        <SwapContainer />
      </Box>
    </CardContainer>
  );
};
