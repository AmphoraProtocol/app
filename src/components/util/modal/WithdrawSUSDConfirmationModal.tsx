import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { ContractReceipt } from 'ethers';

import { formatColor, neutral } from '../../../theme';
import { ModalType, useModalContext } from '../../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useLight } from '../../../hooks/useLight';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { ForwardIcon } from '../../icons/misc/ForwardIcon';
import { useRolodexContext } from '../../libs/rolodex-data-provider/RolodexDataProvider';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import { locale } from '../../../locale';
import { withdrawSUSD } from '../../../contracts/USDI/withdrawSUSD';
import SVGBox from '../../icons/misc/SVGBox';
import { useStableCoinsContext } from '../../libs/stable-coins-provider/StableCoinsProvider';

export const WithdrawSUSDConfirmationModal = () => {
  const { type, setType, SUSD, updateTransactionState } = useModalContext();
  const rolodex = useRolodexContext();
  const [loading, setLoading] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');
  const { currentSigner } = useWeb3Context();
  const isLight = useLight();

  const { USDA } = useStableCoinsContext();

  const handleWithdrawSUSD = async () => {
    if (rolodex && currentSigner) {
      setLoading(true);
      try {
        setLoadmsg(locale('CheckWallet'));

        const withdrawTxn = await withdrawSUSD(
          SUSD.maxWithdraw ? USDA.wallet_amount! : SUSD.amountToWithdraw,
          rolodex,
          currentSigner,
        );

        setLoadmsg(locale('TransactionPending'));
        updateTransactionState(withdrawTxn);
        const receipt = await withdrawTxn?.wait();
        updateTransactionState(receipt);
      } catch (e) {
        const error = e as ContractReceipt;
        updateTransactionState(error);
      }
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={type === ModalType.WithdrawSUSDConfirmation}
      setOpen={() => {
        setType(null);
      }}
    >
      <Typography variant='body3' color={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)}>
        Confirm Withdraw
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
          mt: 3,
          py: 2,
          borderRadius: '10px',
          columnGap: 4,
          backgroundColor: isLight ? formatColor(neutral.gray5) : formatColor(neutral.gray7),
        }}
      >
        <Box display='flex' alignItems='center'>
          <Box>
            <Typography variant='body3' color='text.secondary'>
              {'$' +
                Number(SUSD.amountToWithdraw).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </Typography>
          </Box>

          <SVGBox width={36} height={36} svg_name='USDA' alt='USDA' sx={{ ml: 3 }} />
        </Box>

        <ForwardIcon sx={{ width: 15, height: 15 }} strokecolor={formatColor(neutral.gray3)} />

        <Box display='flex' alignItems='center'>
          <SVGBox width={36} height={36} sx={{ mr: 3 }} svg_name='sUSD' alt='sUSD' />

          <Box>
            <Typography variant='body3' color='text.secondary'>
              {'$' +
                Number(SUSD.amountToWithdraw).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box textAlign='center'>
        <Typography variant='body3_medium' color={formatColor(neutral.gray3)} fontStyle='italic'>
          1 {SUSD.token?.ticker} = 1 USDA ($1){' '}
        </Typography>
      </Box>

      <Box my={5} color={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)}></Box>
      <DisableableModalButton
        text='Confirm Withdraw'
        disabled={false}
        onClick={handleWithdrawSUSD}
        loading={loading}
        load_text={loadmsg}
      />
    </BaseModal>
  );
};
