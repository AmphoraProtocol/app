import { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useContract } from 'wagmi';
import { ContractReceipt } from 'ethers';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useAmphContracts, useAppSelector, useLight } from '~/hooks';
import SVGBox from '../icons/misc/SVGBox';
import TokenIcon from '../icons/misc/TokenIcon';
import { getRewardAmount, formatNumber } from '~/utils';

export const ClaimModal = () => {
  const { type, setType, collateralToken } = useModalContext();
  const isLight = useLight();
  const [rewardsInUsd, setRewardsInUsd] = useState(getRewardAmount(collateralToken.claimable_rewards).value);
  const vaultAddress = useAppSelector((state) => state.VC.userVault.vaultAddress);
  const { vaultAbi } = useAmphContracts();
  const vaultContract = useContract({ ...vaultAbi, address: vaultAddress });
  const [loading, setLoading] = useState(false);
  const { updateTransactionState } = useModalContext();

  const handleClaimRequest = async () => {
    setLoading(true);
    if (vaultAddress && vaultContract) {
      try {
        const attempt = await vaultContract.claimRewards([collateralToken.address]);
        updateTransactionState(attempt!);

        const receipt = await attempt.wait();
        updateTransactionState(receipt);
      } catch (err) {
        const error = err as ContractReceipt;
        updateTransactionState(error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    setRewardsInUsd(getRewardAmount(collateralToken.claimable_rewards).value);
  }, [collateralToken.claimable_rewards]);

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
        <SVGBox img_name='AMPHORA.png' width={100} height={100} alt='USDA' />

        <Box>
          <Typography variant='body2' color={formatColor(neutral.gray3)}>
            Unclaimed Rewards
          </Typography>
          {collateralToken.claimable_rewards?.map((rewards) => (
            <Box display='flex' alignItems='center' key={rewards.token} columnGap={1}>
              <TokenIcon height={34} width={34} address={rewards.token} symbol={rewards.symbol} />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'start',
                  justifyItems: 'start',
                }}
              >
                <Typography variant='body1' color='text.primary' mt={0.8}>
                  {formatNumber(Number.parseFloat(rewards.amount))} {rewards.symbol}
                </Typography>{' '}
                <Typography variant='body2' color='text.secondary' mt={0.8} ml={1}>
                  ($
                  {formatNumber(Number.parseFloat(rewards.amount) * rewards.price)})
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Box>
        <Button
          variant='contained'
          sx={{ color: formatColor(neutral.white), marginY: 2, width: '100%' }}
          onClick={handleClaimRequest}
          disabled={loading}
        >
          {loading && <CircularProgress size={20} />}
          {!loading && <>Claim (${formatNumber(rewardsInUsd)})</>}
        </Button>
      </Box>
    </BaseModal>
  );
};
