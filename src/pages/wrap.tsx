import { Box } from '@mui/material';
import { WrapUsdaCard } from '~/components/cards';
import { formatColor, neutral } from '../theme';
import { useTheme } from '@mui/material';

const Buy = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        marginX: 'auto',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 5,
      }}
    >
      <Box
        color={formatColor(neutral.black)}
        textAlign='left'
        maxWidth='xl'
        pt={{ xs: 2, sm: 0 }}
        pb={{ xs: 5, sm: 10 }}
        px={{ xs: 2, md: 10 }}
        margin='auto'
        position='relative'
        sx={{
          [theme.breakpoints.down('md')]: {
            mb: 0,
            marginLeft: 'auto',
          },
        }}
      >
        <Box display='flex' flexDirection={{ xs: 'column-reverse', lg: 'column' }} sx={{ mb: 3 }}>
          <WrapUsdaCard />
        </Box>
      </Box>
    </Box>
  );
};

export default Buy;
