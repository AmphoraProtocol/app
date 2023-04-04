import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { TransactionReceipt } from '@ethersproject/providers';
import { useContract } from 'wagmi';
import { utils } from 'ethers';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useLight, useAppSelector, useAmphContracts } from '~/hooks';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { locale, round } from '~/utils';
import SVGBox from '../icons/misc/SVGBox';

export const WithdrawCollateralConfirmationModal = () => {
  const {
    type,
    setType,
    collateralToken,
    collateralWithdrawAmount,
    setCollateralWithdrawAmount,
    updateTransactionState,
    collateralWithdrawAmountMax,
    setCollateralWithdrawAmountMax,
  } = useModalContext();
  const { vaultAddress } = useAppSelector((state) => state.VC.userVault);
  const [loadmsg, setLoadmsg] = useState('');
  const [loading, setLoading] = useState(false);
  const isLight = useLight();
  const { vaultAbi } = useAmphContracts();
  const vaultContract = useContract({ ...vaultAbi, address: vaultAddress });

  const handleCollateralWithdraw = async () => {
    setLoading(true);
    setLoadmsg(locale('CheckWallet'));

    const amount = collateralWithdrawAmountMax ? collateralToken.vault_amount : collateralWithdrawAmount;
    try {
      if (vaultContract && amount) {
        const formattedAmount = utils.parseUnits(amount, collateralToken.decimals);
        const attempt = await vaultContract.withdrawERC20(collateralToken.address, formattedAmount);

        updateTransactionState(attempt);

        setLoadmsg(locale('TransactionPending'));
        const receipt = await attempt.wait();

        setCollateralWithdrawAmount('');
        setCollateralWithdrawAmountMax(false);

        setLoadmsg('');
        setLoading(false);

        updateTransactionState(receipt);
      }
    } catch (err) {
      const error = err as TransactionReceipt;
      updateTransactionState(error);
    }

    setLoadmsg('');
    setLoading(false);
  };

  return (
    <BaseModal
      open={type === ModalType.WithdrawCollateralConfirmation}
      setOpen={() => {
        setType(ModalType.WithdrawCollateral);
      }}
    >
      <Typography variant='body1' color={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)}>
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
          <SVGBox
            width={36}
            height={36}
            svg_name={collateralToken?.ticker}
            sx={{ mr: 3 }}
            alt={collateralToken?.ticker}
          />

          <Box>
            <Typography variant='body3' color='text.primary'>
              ${round(collateralToken.price * Number(collateralWithdrawAmount), 2)} (
              {round(collateralWithdrawAmount, 4)} {collateralToken?.ticker} )
            </Typography>
          </Box>
        </Box>
      </Box>

      <DisableableModalButton
        text='Confirm Withdraw'
        disabled={false}
        onClick={handleCollateralWithdraw}
        loading={loading}
        load_text={loadmsg}
      />
    </BaseModal>
  );
};
