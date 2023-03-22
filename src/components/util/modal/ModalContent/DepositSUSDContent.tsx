import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { formatColor, neutral } from '../../../../theme';
import { DecimalInput } from '../../textFields';
import { DisableableModalButton } from '../../button/DisableableModalButton';
import { ModalInputContainer } from './ModalInputContainer';
import { ModalType, useModalContext } from '../../../libs/modal-content-provider/ModalContentProvider';
import { useLight } from '../../../../hooks/useLight';
import { round } from '../../../../utils/bn';
import { useAppSelector } from '~/hooks/store';

export const DepositSUSDContent = () => {
  const { SUSD: SUSDToken } = useAppSelector((state) => state.stablecoins);
  const { setType, updateSUSD, SUSD } = useModalContext();
  const [disabled, setDisabled] = useState(true);
  const [focus, setFocus] = useState(false);
  const [isMoneyValue, setIsMoneyValue] = useState(false);
  const toggle = () => setFocus(!focus);
  const setMax = () => updateSUSD('amountToDeposit', SUSDToken.wallet_amount!.toString());
  const numAmountToDeposit = Number(SUSD.amountToDeposit);
  const isLight = useLight();
  useEffect(() => {
    setDisabled(numAmountToDeposit <= 0);
  }, [SUSD.amountToDeposit]);

  return (
    <Box>
      <Box textAlign='right' mb={2}>
        <Typography variant='label_semi' color={formatColor(neutral.gray3)}>
          {' '}
          Wallet Balance: {round(SUSDToken.wallet_balance || 0, 2)} sUSD
        </Typography>
      </Box>

      <ModalInputContainer focus={focus}>
        <DecimalInput
          onFocus={toggle}
          onBlur={toggle}
          onChange={(amount) => updateSUSD('amountToDeposit', amount)}
          placeholder={`0 ${isMoneyValue ? 'USD' : SUSDToken.ticker}`}
          value={SUSD.amountToDeposit}
          isMoneyValue={isMoneyValue}
        />

        <Box sx={{ display: 'flex', paddingBottom: 0.5, alignItems: 'center' }}>
          <Button
            onClick={setMax}
            sx={{
              minWidth: 'auto',
              height: 30,
              paddingY: 2,
              paddingX: 1,
              '&:hover': {
                backgroundColor: 'transparent',
                '.MuiTypography-root.MuiTypography-body1': {
                  color: formatColor(neutral.gray1),
                },
              },
            }}
          >
            <Typography
              variant='body3'
              color={formatColor(neutral.gray3)}
              sx={{
                '&:hover': {
                  color: isLight ? formatColor(neutral.gray1) : formatColor(neutral.white),
                },
              }}
            >
              Max
            </Typography>
          </Button>
        </Box>
      </ModalInputContainer>

      <Box marginTop={2}>
        <DisableableModalButton
          text='Deposit'
          disabled={disabled}
          onClick={() => setType(ModalType.DepositSUSDConfirmation)}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          marginTop: 2,
        }}
      >
        <Typography variant='caption'>Borrowing Power</Typography>
        <Box component='img' src='images/up_arrow_blue.png' width={10} height={12} marginX={1} />
        <Typography variant='caption'>$0</Typography>
      </Box>
    </Box>
  );
};
