import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useNetwork } from 'wagmi';

import { Chains } from '~/config';
import { useLight } from '~/hooks';
import SVGBox from '../icons/misc/SVGBox';
import { getConfig } from '~/config';

export const SelectedChainButton = () => {
  const { chain: currentChain } = useNetwork();
  const { DEFAULT_CHAIN_ID } = getConfig();
  const chain = Chains.getInfo(currentChain?.id || DEFAULT_CHAIN_ID);

  const theme = useTheme();
  const isLight = useLight();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const name = isMobile ? chain.symbol : chain.name;

  return (
    <Button
      sx={{
        color: 'text.primary',
        paddingX: 2,
        paddingY: 1,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.03)',
        backgroundColor: 'button.header',
        border: isLight ? '1px solid #F4F4F4' : 'none',
        minWidth: 'auto',
        '&:hover': {
          backgroundColor: 'button.hover',
        },
        [theme.breakpoints.down('md')]: {
          paddingX: 2,
          minWidth: 'auto',
        },
      }}
    >
      <SVGBox svg_name={chain.logo} height={24} sx={{ mr: 1 }} />

      <Typography variant='label'>{name}</Typography>
    </Button>
  );
};
