import { Box, Typography } from '@mui/material';
import { WrapContainer } from '../wrap';
import { CardContainer } from './CardContainer';

export const WrapUsdaCard = () => {
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
            Wrap or Unwrap USDA
          </Typography>
        </Box>
        <WrapContainer />
      </Box>
    </CardContainer>
  );
};
