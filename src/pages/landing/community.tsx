import { Typography, Link } from '@mui/material';
import { Box } from '@mui/system';
import SVGBox from '../../components/icons/misc/SVGBox';
import { formatColor, neutral } from '../../theme';
export const Community: React.FC = () => {
  return (
    <Box
      sx={{
        maxWidth: '100%',
        paddingTop: 10,
        paddingX: 10,
        paddingBottom: 30,
        backgroundColor: formatColor(neutral.white),
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'nowrap',
          flexBasis: '100%',
          width: '100%',
          maxWidth: 1250,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography display='inline' variant='h2' textAlign='center' color={formatColor(neutral.black)}>
          Join the Community
        </Typography>
      </Box>
      <Box sx={{ flexBasis: '100%' }} />
      <Box
        sx={{
          flexBasis: '100%',
          flexWrap: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ flexBasis: '30%' }} />
        <Link href='https://discord.gg/s9Wja2tb6k' target='_blank'>
          <SVGBox
            svg_name='discord_icon_black'
            width={{ xs: 36, md: 48 }}
            height={{ xs: 36, md: 48 }}
            sx={{ mx: 2, textAlign: 'center' }}
          />
        </Link>
        <Link href='https://twitter.com/InterestDeFi' target='_blank'>
          <SVGBox
            svg_name='twitter_bird_icon_black'
            width={{ xs: 36, md: 48 }}
            height={{ xs: 36, md: 48 }}
            sx={{ mx: 2, textAlign: 'center' }}
          />
        </Link>
        <Link href='https://medium.com/interest-protocol' target='_blank'>
          <SVGBox
            svg_name='medium_icon_black'
            width={{ xs: 36, md: 30 }}
            height={{ xs: 36, md: 30 }}
            sx={{ mx: 2, textAlign: 'center' }}
          />
        </Link>
        <Box sx={{ flexBasis: '30%' }} />
      </Box>
      <Box sx={{ flexBasis: '100%' }} />
      <Box sx={{ flexBasis: '100%' }} />
      <Box sx={{ flexBasis: '100%' }} />
      <Box sx={{ flexBasis: '100%' }} />
      <Typography
        display='inline'
        variant='h3'
        sx={{
          color: formatColor(neutral.gray3),
        }}
      >
        See you soon!
      </Typography>
    </Box>
  );
};
