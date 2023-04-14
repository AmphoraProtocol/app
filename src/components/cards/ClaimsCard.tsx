import { useState, useEffect } from 'react';
import { Typography, Box, Button, CircularProgress } from '@mui/material';
import { useAccount, useContract } from 'wagmi';
import { ContractReceipt } from 'ethers';

import { ClaimIcon } from '../icons/misc/ClaimIcon';
import { CardContainer } from './CardContainer';
import { useAmphContracts, useAppSelector } from '~/hooks';
import { formatNumber, getTotalRewardValue } from '~/utils';
import { blue, formatColor } from '~/theme';
import { useModalContext } from '../libs/modal-content-provider/ModalContentProvider';

export const ClaimsCard = () => {
  const [formattedAmount, setFormattedAmount] = useState('0');
  const [loading, setLoading] = useState(false);
  const [hasRewards, setHasRewards] = useState(false);
  const { isConnected } = useAccount();
  const vaultAddress = useAppSelector((state) => state.VC.userVault.vaultAddress);
  const assets = useAppSelector((state) => state.collaterals.elements);
  const { vaultAbi } = useAmphContracts();
  const vaultContract = useContract({ ...vaultAbi, address: vaultAddress });
  const { updateTransactionState } = useModalContext();

  const handleClaimRequest = async () => {
    setLoading(true);
    if (vaultAddress && vaultContract && assets) {
      const claimableTokens = Object.entries(assets).filter((token) => !!token[1].claimable_rewards);

      try {
        const attempt = await vaultContract.claimRewards(claimableTokens.map((token) => token[1].address));
        updateTransactionState(attempt!);

        const receipt = await attempt.wait();
        updateTransactionState(receipt);
      } catch (err) {
        const error = err as ContractReceipt;
        updateTransactionState(error);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    let totalValue = 0;
    if (assets) {
      const total = getTotalRewardValue(assets);
      totalValue = total.value;
      setHasRewards(!!total.amount);
    }
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
              {isConnected && `$ ${formattedAmount}`}
              {!isConnected && '-'}
            </Typography>
          </Box>
        </Box>
        {isConnected && hasRewards && (
          <Button
            onClick={handleClaimRequest}
            sx={{
              width: { xs: '100%', lg: 150 },
              backgroundColor: 'button.claim',
              color: '#FFFFFF',
              padding: 1.5,
              '&:hover': {
                backgroundColor: formatColor(blue.blue14),
              },
            }}
            disabled={loading}
          >
            {loading && <CircularProgress size={20} />}
            {!loading && 'Claim All'}
          </Button>
        )}
      </Box>
    </CardContainer>
  );
};
