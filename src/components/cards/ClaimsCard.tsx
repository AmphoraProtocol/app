import { Typography, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { ClaimIcon } from '../icons/misc/ClaimIcon';
import { useAccount } from 'wagmi';

import { CardContainer } from './CardContainer';
import { ClaimsButton } from '../button';
import { useAppSelector } from '~/hooks';
import { getTotalAmount } from '~/utils';

export const ClaimsCard = () => {
  // const rewards = useAppSelector((state) => state.VC.userVault.rewards);
  const [formattedAmount, setFormattedAmount] = useState('0');
  const { isConnected } = useAccount();

  // useEffect(() => {
  //   if (rewards?.prices && rewards?.amounts) {
  //     setFormattedAmount(getTotalAmount(rewards.prices, rewards.amounts));
  //   }
  // }, [rewards]);

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
        {isConnected && <ClaimsButton text='Claim All' />}
      </Box>
    </CardContainer>
  );
};
