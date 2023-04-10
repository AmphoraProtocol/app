import { Box, Typography, Button } from '@mui/material';
import { useContract } from 'wagmi';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useAmphContracts, useAppSelector, useLight } from '~/hooks';
import SVGBox from '../icons/misc/SVGBox';
import TokenIcon from '../icons/misc/TokenIcon';

export const ClaimModal = () => {
  const { type, setType, collateralToken } = useModalContext();
  const isLight = useLight();

  const vaultAddress = useAppSelector((state) => state.VC.userVault.vaultAddress);
  const { vaultAbi } = useAmphContracts();
  const vaultContract = useContract({ ...vaultAbi, address: vaultAddress });

  const handleClaimRequest = async () => {
    if (vaultAddress && vaultContract) {
      vaultContract.claimRewards([collateralToken.address]);
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
            Unclaimed Rewards
          </Typography>
          {collateralToken.claimable_rewards?.map((rewards) => (
            <Box
              key={rewards.token}
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <TokenIcon height={35} width={35} address={rewards.token} />

              <Typography variant='h5' color='text.primary' mt={0.8}>
                {Number.parseFloat(rewards.amount).toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}{' '}
                {rewards.price.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Button
          variant='contained'
          sx={{ color: formatColor(neutral.white), marginY: 2, width: '100%' }}
          onClick={handleClaimRequest}
        >
          Claim
        </Button>
      </Box>
    </BaseModal>
  );
};
