import { Button, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ForwardIcon } from '../../components/icons/misc/ForwardIcon';
import { formatColor, neutral } from '../../theme';

export const Splash: React.FC = () => {
  return (
    <Box
      sx={{
        maxWidth: '100%',
        paddingTop: { xs: 30, md: 40 },
        paddingLeft: { xs: 2, md: 10 },
        paddingBottom: { xs: 25, md: 50 },
        backgroundColor: formatColor(neutral.white),
        backgroundImage: 'url("images/landing_splash.png")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: { xs: 'cover', md: 'contain' },
        backgroundPositionY: 'center',
        backgroundPositionX: { xs: '35%', md: 'center' },
        display: 'flex',
        alignItems: 'left',
        justifyContent: 'left',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          maxWidth: 1250,
          alignItems: 'left',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'left',
        }}
      >
        <Box>
          <Typography flexBasis='50%' variant='h1' color='#202020'>
            Interest Protocol
          </Typography>
        </Box>
        <Box />
        <Box sx={{ flexBasis: '100%' }}>
          <Button
            href={'#/whitepaper'}
            sx={{
              marginTop: { xs: 2, md: 5 },
              border: '1px solid ' + formatColor(neutral.black),
              width: 'auto',
              px: 3,
            }}
          >
            <Typography variant='body1' whiteSpace='nowrap' color={formatColor(neutral.black)}>
              IP Whitepaper
            </Typography>
            <ForwardIcon
              sx={{
                width: 11,
                ml: 1,
                position: 'relative',
                stroke: 'black',
              }}
            />
          </Button>
        </Box>
        <Box />
      </Box>
    </Box>
  );
};
