import { Button, Toolbar, Typography, Link } from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
import Cookies from 'universal-cookie';
import SVGBox from '../../components/icons/misc/SVGBox';
import { formatColor, neutral, blue } from '../../theme';

export const LandingDesktopToolbar = () => {
  const cookies = new Cookies();
  const nav = useNavigate();
  const toApp = () => {
    cookies.set('first-visit', 'not');
    nav('/', { replace: true });
  };

  const DesktopLinkTo = ({ url, label, newTarget }: { url: string; label: string; newTarget?: boolean }) => (
    <Typography
      sx={{
        color: formatColor(neutral.gray2),
        display: 'flex',
        zIndex: 10,
        variant: 'label',
        alignItems: 'center',
      }}
    >
      <Link href={url} sx={{ color: 'inherit' }} target={newTarget ? '_blank' : ''}>
        {label}
      </Link>
    </Typography>
  );

  return (
    <Toolbar>
      <SVGBox svg_name='ip_green' width={50} height={50} />

      <Box sx={{ gap: 5 }} display='flex' ml={5}>
        <DesktopLinkTo url='#/whitepaper' label='Whitepaper' />
        <DesktopLinkTo url='#/docs' label='Docs' />
      </Box>

      <Box ml='auto'>
        <Button
          onClick={toApp}
          variant='contained'
          sx={{
            '&:hover': {
              backgroundColor: formatColor(blue.blue10),
            },
          }}
        >
          Launch App ➝
        </Button>
      </Box>
    </Toolbar>
  );
};
