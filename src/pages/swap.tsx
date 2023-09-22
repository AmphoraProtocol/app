import { Box } from '@mui/material';
import { WrapUsdaCard } from '~/components/cards';

const Swap = () => {
  return (
    <Box display='flex' flexDirection={{ xs: 'column-reverse', lg: 'column' }} sx={{ mb: 3 }}>
      <WrapUsdaCard />
    </Box>
  );
};

export default Swap;
