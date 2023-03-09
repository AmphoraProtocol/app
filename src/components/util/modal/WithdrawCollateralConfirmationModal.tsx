import { Box, Typography } from '@mui/material';
import { formatColor, neutral } from '../../../theme';
import { useState } from 'react';
import { ModalType, useModalContext } from '../../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useLight } from '../../../hooks/useLight';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import { useVaultDataContext } from '../../libs/vault-data-provider/VaultDataProvider';
import { locale } from '../../../locale';
import { TransactionReceipt } from '@ethersproject/providers';
import { round } from '../../../easy/bn';
import withdrawCollateral from '../../../contracts/Vault/withdrawCollateral';
import SVGBox from '../../icons/misc/SVGBox';

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
  const { provider, currentAccount } = useWeb3Context();
  const { vaultAddress } = useVaultDataContext();
  const [loadmsg, setLoadmsg] = useState('');
  const [loading, setLoading] = useState(false);
  const isLight = useLight();

  const handleCollateralWithdraw = async () => {
    setLoading(true);
    setLoadmsg(locale('CheckWallet'));

    const amount = collateralWithdrawAmountMax ? collateralToken.vault_amount : collateralWithdrawAmount;
    try {
      const attempt = await withdrawCollateral(
        amount!,
        collateralToken.capped_address ? collateralToken.capped_address : collateralToken.address,
        vaultAddress!,
        provider?.getSigner(currentAccount)!,
      );

      updateTransactionState(attempt);

      setLoadmsg(locale('TransactionPending'));
      const receipt = await attempt.wait();

      setCollateralWithdrawAmount('');
      setCollateralWithdrawAmountMax(false);

      setLoadmsg('');
      setLoading(false);

      updateTransactionState(receipt);
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
            svg_name={collateralToken.ticker}
            sx={{ mr: 3 }}
            alt={collateralToken.ticker}
          />

          <Box>
            <Typography variant='body3' color='text.primary'>
              ${round(collateralToken.price * Number(collateralWithdrawAmount), 2)} (
              {round(collateralWithdrawAmount, 4)} {collateralToken.ticker} )
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
