import { Box, Typography, useTheme, Link as MuiLink } from '@mui/material';
import { Link } from '~/components/link';
import { useLight } from '~/hooks';
import footerLinks from './footerLinks';
import SVGBox from '~/components/icons/misc/SVGBox';

export const Footer = () => {
  return (
    <Box
      paddingTop={{ xs: 8, sm: 5 }}
      paddingBottom={{ xs: 7, sm: 3 }}
      px={{ xs: 4, md: 4 }}
      sx={{
        backgroundColor: 'footer.background',
      }}
    >
      <FooterContent />
    </Box>
  );
};

const FooterContent = () => {
  const isLight = useLight();
  const theme = useTheme();
  return (
    <Box
      sx={{
        maxWidth: 1300,
        margin: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: 4,
          justifyContent: { xs: 'space-evenly', md: 'space-evenly' },
          maxWidth: 900,
          margin: 'auto',
          [theme.breakpoints.down('md')]: {
            marginBottom: 12,
          },
        }}
      >
        {footerLinks.map((navItem, index) => {
          return (
            <Box
              key={index}
              sx={{
                marginLeft: 'auto',
                marginRight: { xs: 'unset', md: 'auto' },
                width: { xs: '40%', md: 'fit-content' },
              }}
            >
              <Typography variant='body1'>{navItem.title}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start',
                  marginTop: 2,
                }}
              >
                {navItem.links.map((link) => {
                  return (
                    <MuiLink
                      target='_blank'
                      key={link.label}
                      href={link.href}
                      variant='label_semi'
                      color='footer.color'
                      paddingBottom={1}
                      sx={{
                        '&:hover': {
                          color: 'text.primary',
                        },
                      }}
                    >
                      {link.label}
                    </MuiLink>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'space-between',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column-reverse',
            rowGap: 2,
            alignItems: 'center',
          },
        }}
      >
        <Typography color='footer.color' variant='label_semi'>
          Amphora Protocol {new Date().getFullYear()}: By using this product you agree you are not based in the US or a
          US Person, acknowledge this is a decentralized product with no ownership or liability, that such products are
          legal in your jurisdiction, and that no promises of future value are being made.
        </Typography>
        <Box>
          <MuiLink component={Link} to='#' target='_blank' paddingBottom={2}>
            <SVGBox
              svg_name={isLight ? 'discord_icon_black' : 'discord_icon_grey'}
              width={24}
              height={24}
              sx={{ marginX: 3 }}
            />
          </MuiLink>
          <MuiLink component={Link} to='#' target='_blank' paddingBottom={2}>
            <SVGBox
              svg_name={isLight ? 'twitter_bird_icon_black' : 'twitter_bird_icon_grey'}
              width={25}
              height={26}
              sx={{ marginX: 3 }}
            />
          </MuiLink>
          <MuiLink component={Link} to='#' target='_blank' paddingBottom={2}>
            <SVGBox
              svg_name={isLight ? 'medium_icon_black' : 'medium_icon_grey'}
              width={24}
              height={24}
              sx={{ marginX: 3 }}
            />
          </MuiLink>
        </Box>
      </Box>
    </Box>
  );
};
