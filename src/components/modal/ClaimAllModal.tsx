import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useContract } from 'wagmi';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useAmphContracts, useAppSelector, useLight } from '~/hooks';
import SVGBox from '../icons/misc/SVGBox';
import { getTotalAmount } from '~/utils';

export const ClaimAllModal = () => {
  const { type, setType } = useModalContext();
  // const rewards = useAppSelector((state) => state.collaterals.elements?.WETH.claimable_rewards);
  const isLight = useLight();

  const [formattedAmount, setFormattedAmount] = useState('0');
  const vaultAddress = useAppSelector((state) => state.VC.userVault.vaultAddress);
  const { vaultAbi } = useAmphContracts();
  const vaultContract = useContract({ ...vaultAbi, address: vaultAddress });

  const handleClaimRequest = async () => {
    if (vaultAddress && vaultContract) {
      console.log('Claiming rewards...');
    }
  };

  // useEffect(() => {
  //   if (rewards?.prices && rewards?.amounts) {
  //     setFormattedAmount(getTotalAmount(rewards.prices, rewards.amounts));
  //   }
  // }, [rewards]);

  return (
    <BaseModal
      open={type === ModalType.ClaimAll}
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
          columnGap: 1.5,
        }}
      >
        <SVGBox img_name='USDA.png' width={100} height={100} alt='USDA' />

        <Box>
          <Typography variant='body2' color={formatColor(neutral.gray3)}>
            Unclaimed Rewards (Claim All Modal)
          </Typography>

          {/* Amphora rewards */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant='h5' color='text.primary' mt={0.8}>
              {/* {rewards?.amounts[0].toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })} */}
            </Typography>
            <SVGBox
              svg_name=''
              width={50}
              height={50}
              alt='Amph'
              sx={{
                padding: 1,
              }}
            />
          </Box>

          {/* Curve rewards */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant='h5' color='text.primary' mt={0.8}>
              {/* {rewards?.amounts[1].toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })} */}
            </Typography>
            <SVGBox
              svg_name='CRV'
              width={50}
              height={50}
              alt='CRV'
              sx={{
                padding: 1.1,
              }}
            />
          </Box>

          {/* Convex rewards */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant='h5' color='text.primary' mt={0.8}>
              {/* {rewards?.amounts[2].toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })} */}
            </Typography>
            <SVGBox svg_name='CVX' width={50} height={50} alt='CVX' />
          </Box>
        </Box>
      </Box>

      <Box>
        <Button
          variant='contained'
          sx={{ color: formatColor(neutral.white), marginY: 2, width: '100%' }}
          onClick={handleClaimRequest}
          disabled={!!(Number.parseFloat(formattedAmount) <= 0 || !vaultAddress || !vaultContract)}
        >
          Claim ($ {formattedAmount})
        </Button>
      </Box>
    </BaseModal>
  );
};
