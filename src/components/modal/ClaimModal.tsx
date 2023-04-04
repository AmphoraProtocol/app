import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { utils } from 'ethers';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useLight } from '~/hooks';
import SVGBox from '../icons/misc/SVGBox';

export const ClaimModal = () => {
  const { type, setType } = useModalContext();
  const claimAmount = utils.parseEther('1');
  const isLight = useLight();

  const [formattedAmount, setFormattedAmount] = useState(0);

  useEffect(() => {
    setFormattedAmount(Number(utils.formatEther(claimAmount)));
  }, [claimAmount]);

  const handleClaimRequest = async () => {
    console.log('Claiming rewards...');
  };

  return (
    <BaseModal
      open={type === ModalType.Claim}
      setOpen={() => {
        setType(null);
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2.5,
          mt: 4,
          columnGap: 2,
        }}
      >
        <SVGBox svg_name={isLight ? 'USDA' : 'USDA'} width={80} height={80} alt='IPT' />

        <Box>
          <Typography variant='body2' color={formatColor(neutral.gray3)}>
            Unclaimed Rewards
          </Typography>
          <Typography variant='h5' color='text.primary' mb={1}>
            {formattedAmount.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}{' '}
            AMPH
          </Typography>
        </Box>
      </Box>

      <Box>
        <Button
          variant='contained'
          sx={{ color: formatColor(neutral.white), marginY: 2, width: '100%' }}
          onClick={handleClaimRequest}
          disabled={formattedAmount <= 0}
        >
          Claim
        </Button>
      </Box>
    </BaseModal>
  );
};
