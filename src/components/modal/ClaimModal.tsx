import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { utils } from 'ethers';
import { useContract } from 'wagmi';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useAmphContracts, useAppSelector, useLight } from '~/hooks';
import SVGBox from '../icons/misc/SVGBox';

export const ClaimModal = () => {
  const { type, setType } = useModalContext();
  const claimAmount = utils.parseEther('1.23');
  const isLight = useLight();

  const [formattedAmount, setFormattedAmount] = useState(0);
  const vaultAddress = useAppSelector((state) => state.VC.userVault.vaultAddress);
  const { amphClaimerContract, vaultAbi } = useAmphContracts();
  const amphClaimer = useContract(amphClaimerContract);
  const vaultContract = useContract({ ...vaultAbi, address: vaultAddress });

  useEffect(() => {
    setFormattedAmount(Number(utils.formatEther(claimAmount)));
  }, [claimAmount]);

  const handleClaimRequest = async () => {
    if (amphClaimer && vaultAddress && vaultContract) {
      console.log('Claiming rewards...');
      const rewards = await vaultContract.claimableRewards('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
    }
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
          columnGap: 1.5,
        }}
      >
        <SVGBox svg_name={isLight ? 'USDA' : 'USDA'} width={100} height={100} alt='USDA' />

        <Box>
          <Typography variant='body2' color={formatColor(neutral.gray3)}>
            Unclaimed Rewards (Claim Modal)
          </Typography>

          {/* Convex rewards */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant='h5' color='text.primary' mt={0.8}>
              {formattedAmount.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
            </Typography>
            <SVGBox
              svg_name=''
              width={50}
              height={50}
              alt='USDA'
              sx={{
                padding: 1,
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
              1.70
            </Typography>
            <SVGBox svg_name='CVX' width={50} height={50} alt='CVX' />
          </Box>

          {/* Curve rewards */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant='h5' color='text.primary' mt={0.8}>
              7.00
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
