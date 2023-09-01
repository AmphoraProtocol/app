import { Box, Typography } from '@mui/material';

import { formatColor, neutral } from '~/theme';
import SVGBox from '../icons/misc/SVGBox';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseSwitch } from '../switch';
import { BaseModal } from './BaseModal';
import { DepositSUSDContent } from './ModalContent/DepositSUSDContent';
import { WithdrawSUSDContent } from './ModalContent/WithdrawSUSDContent';

export const DepositWithdrawSUSDModal = () => {
  const { type, setType } = useModalContext();

  const isDepositType = type === ModalType.DepositSUSD;

  const onSwitch = (val: boolean) => setType(val ? ModalType.DepositSUSD : ModalType.WithdrawSUSD);

  return (
    <BaseModal
      open={type === ModalType.DepositSUSD || type === ModalType.WithdrawSUSD}
      setOpen={() => {
        setType(null);
      }}
    >
      <BaseSwitch option1='Deposit' option2='Withdraw' onOptionChange={onSwitch} defaultIsOption1={isDepositType} />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2.5,
          mt: 4,
          columnGap: 2,
        }}
      >
        <SVGBox width={80} height={80} svg_name='sUSD' alt='sUSD' />
        <Box>
          <Typography variant='body1' color={formatColor(neutral.gray3)}>
            1 snxUSD
          </Typography>
          <Typography variant='h3' color='text.primary' mb={1}>
            $1
          </Typography>
        </Box>
      </Box>

      {isDepositType ? <DepositSUSDContent /> : <WithdrawSUSDContent />}
    </BaseModal>
  );
};
