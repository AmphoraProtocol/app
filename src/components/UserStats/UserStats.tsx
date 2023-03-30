import { Box, Typography, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';

import { UserTokenCard } from './UserTokenCard';
import { CardContainer } from '../cards/CardContainer';
import { useAppSelector } from '~/hooks/store';

export const UserStats = () => {
  const [token_cards, setTokenCards] = useState<JSX.Element | undefined>(undefined);

  const theme = useTheme();
  const tokens = useAppSelector((state) => state.collaterals.elements);

  useEffect(() => {
    if (tokens) {
      const el: Array<any> = [];
      for (const [key, val] of Object.entries(tokens)) {
        el.push(
          <UserTokenCard
            key={key}
            index={el.length}
            tokenName={val.name}
            tokenTicker={val.ticker}
            tokenPrice={
              '$' +
              val.price?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            }
            vaultBalance={'$' + val.vault_balance?.toLocaleString()}
            tokenAmount={Number(val.vault_amount_str).toLocaleString()}
            image={{
              src: val.ticker,
              alt: val.ticker,
            }}
            LTVPercent={val.token_LTV!.toLocaleString()}
            penaltyPercent={val.token_penalty!.toLocaleString()}
            cappedToken={val.capped_token}
            tokenAddress={val.address}
            cappedPercent={val.capped_percent}
            oracleType={val.oracle_type}
            oracleAddress={val.oracle_address}
          />,
        );
      }
      setTokenCards(<>{el}</>);
    }
  }, [tokens]);

  return (
    <CardContainer>
      <Box
        sx={{
          paddingTop: 2.5,
          [theme.breakpoints.down('md')]: {
            paddingTop: 2,
          },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            px: { xs: 2, lg: 3 },
            gridTemplateColumns: {
              xs: '1.5fr 1fr 1fr',
              lg: '1.5fr 0.5fr 1fr 0.5fr 0.5fr 1fr 0.6fr  0.8fr',
            },
            mb: 0,
            columnGap: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant='label'>Assets</Typography>
          <Typography display={{ xs: 'none', lg: 'block' }} textAlign='end' variant='label'>
            Oracle
          </Typography>
          <Typography display={{ xs: 'none', lg: 'block' }} textAlign='end' variant='label'>
            Price
          </Typography>
          <Typography display={{ xs: 'none', lg: 'flex' }} variant='label' justifyContent='end'>
            LTV
          </Typography>
          <Typography display={{ xs: 'none', lg: 'flex' }} variant='label' justifyContent='end'>
            Penalty
          </Typography>
          <Typography variant='label' whiteSpace='nowrap' display={{ xs: 'none', lg: 'flex' }} justifyContent='center'>
            Capped Token
          </Typography>
          <Typography variant='label' whiteSpace='nowrap' textAlign='end'>
            Vault Balance
          </Typography>
          <Box></Box>
          <Box display={{ xs: 'none', lg: 'block' }}></Box>
        </Box>
        <Box
          sx={{
            mt: { xs: 2 },
            display: 'grid',
            gridTemplateColumns: {
              sm: '1fr',
            },
            columnGap: 3,
            '&:nth-of-type(odd) .MuiBox-root': {
              backgroundColor: 'red',
            },
          }}
        >
          {token_cards}
        </Box>
      </Box>
    </CardContainer>
  );
};
