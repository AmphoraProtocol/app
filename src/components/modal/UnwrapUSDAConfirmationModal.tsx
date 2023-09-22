import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ContractReceipt, utils } from 'ethers';
import { useAccount, useContract } from 'wagmi';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useLight, useAppSelector, useAmphContracts } from '~/hooks';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { ForwardIcon } from '../icons/misc/ForwardIcon';
import { BN, formatNumber, locale } from '~/utils';
import SVGBox from '../icons/misc/SVGBox';

export const UnwrapUSDAConfirmationModal = () => {
  const { type, setType, USDA, updateTransactionState } = useModalContext();
  const [loading, setLoading] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');
  const isLight = useLight();
  const { wUSDA } = useAppSelector((state) => state.stablecoins);
  const { address } = useAccount();
  const { wUsdaContract } = useAmphContracts();
  const WUSDAContract = useContract(wUsdaContract);

  const handleUnwrapUSDA = async () => {
    if (address && WUSDAContract) {
      setLoading(true);
      try {
        setLoadmsg(locale('CheckWallet'));

        const usda_amount = USDA.maxWrap ? wUSDA.wallet_amount! : utils.parseUnits(USDA.amountToUnwrap, 18);
        const withdrawTxn = await WUSDAContract.unwrap(BN(usda_amount));

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
      open={type === ModalType.UnwrapUSDAConfirmation}
      setOpen={() => {
        setType(null);
      }}
    >
      <Typography variant='body3' color={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)}>
        Confirm Unwrap
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
              {'$' + formatNumber(Number(USDA.amountToUnwrap))}
            </Typography>
          </Box>

          <SVGBox width={36} height={36} img_name='wUSDA.png' alt='wUSDA' sx={{ ml: 3 }} />
        </Box>

        <ForwardIcon sx={{ width: 15, height: 15 }} strokecolor={formatColor(neutral.gray3)} />

        <Box display='flex' alignItems='center'>
          <SVGBox width={36} height={36} img_name='USDA.png' alt='USDA' sx={{ mr: 3 }} />

          <Box>
            <Typography variant='body3' color='text.secondary'>
              {'$' + formatNumber(Number(USDA.amountToUnwrap))}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box textAlign='center'>
        <Typography variant='body3_medium' color={formatColor(neutral.gray3)} fontStyle='italic'>
          1 {USDA.token?.ticker} = 1 wUSDA ($1){' '}
        </Typography>
      </Box>

      <Box my={5} color={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)}></Box>
      <DisableableModalButton
        text='Confirm Unwrap'
        disabled={false}
        onClick={handleUnwrapUSDA}
        loading={loading}
        load_text={loadmsg}
      />
    </BaseModal>
  );
};
