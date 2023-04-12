import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { ClaimIcon } from '../icons/misc/ClaimIcon';
import { useAccount } from 'wagmi';

import { CardContainer } from './CardContainer';
import { ClaimsButton } from '../button';
import { useAppSelector } from '~/hooks';
import { formatNumber, getTotalRewardValue } from '~/utils';

export const ClaimsCard = () => {
  const [formattedAmount, setFormattedAmount] = useState('0');
  const { isConnected } = useAccount();
  const assets = useAppSelector((state) => state.collaterals.elements);

  useEffect(() => {
    let totalValue = 0;
    if (assets) totalValue = getTotalRewardValue(assets).value;

    setFormattedAmount(formatNumber(totalValue));
  }, [assets]);

  return (
    <CardContainer>
      <Box
        display='flex'
        justifyContent='space-between'
        py={{ xs: 2, lg: 3 }}
        px={{ xs: 2, lg: 4 }}
        flexDirection={{ xs: 'column', lg: 'row' }}
      >
        <Box display='flex' alignItems='center' mb={{ xs: 3, lg: 0 }}>
          <ClaimIcon
            sx={{
              width: 36,
              height: 36,
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2, rowGap: 0 }}>
            <Typography variant='label_semi' color='text.secondary'>
              Total Rewards
            </Typography>
            <Typography variant='h7_semi' lineHeight={{ xs: 1 }} color='text.primary'>
              $ {formattedAmount}
            </Typography>
          </Box>
        </Box>
        {isConnected && !!Number.parseFloat(formattedAmount) && <ClaimsButton text='Claim All' />}
      </Box>
    </CardContainer>
  );
};
