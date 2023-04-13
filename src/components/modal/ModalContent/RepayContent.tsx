import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { TransactionReceipt } from '@ethersproject/providers';
import { useContract } from 'wagmi';
import { utils } from 'ethers';

import { formatColor, neutral } from '~/theme';
import { DecimalInput } from '../../textFields';
import { DisableableModalButton } from '../../button/DisableableModalButton';
import { ModalInputContainer } from './ModalInputContainer';
import { locale, BN } from '~/utils';
import { useModalContext } from '../../libs/modal-content-provider/ModalContentProvider';
import { getConfig } from '~/config';
import { useAmphContracts } from '~/hooks';

interface RepayContent {
  tokenName: string;
  vaultBorrowPower: string;
  repayAmount: string;
  setRepayAmount: (e: string) => void;
  accountLiability: number;
  vaultID: number;
}

export const RepayContent = (props: RepayContent) => {
  const { tokenName, vaultBorrowPower, setRepayAmount, repayAmount, accountLiability, vaultID } = props;
  const { updateTransactionState } = useModalContext();
  const [newHealth, setNewHealth] = useState(100 * (accountLiability / Number(vaultBorrowPower)));
  const [loadmsg, setLoadmsg] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [focus, setFocus] = useState(false);
  const toggle = () => setFocus(!focus);
  const { VaultControllerContract } = useAmphContracts();
  const { USDA_DECIMALS } = getConfig();

  const VC = useContract(VaultControllerContract);

  useEffect(() => {
    setDisabled(Number(repayAmount) <= 0 || accountLiability === 0);
  }, [repayAmount]);

  useEffect(() => {
    const newHealth = (100 * (accountLiability - Number(repayAmount))) / Number(vaultBorrowPower);

    if (isNaN(newHealth)) {
      setNewHealth(0);
    } else {
      setNewHealth(newHealth);
    }
  }, [repayAmount]);

  const onInputChange = (e: string) => {
    const newLib = accountLiability - Number(e);
    if (newLib < 0) {
      setRepayAmount(accountLiability.toString());
    } else {
      setRepayAmount(e);
    }
  };

  const handleRepayAllRequest = async () => {
    const accountLiabilityString = accountLiability.toString();

    setRepayAmount(accountLiabilityString);

    try {
      if (VC) {
        const repayAllTransaction = await VC.repayAllUSDA(BN(vaultID));

        updateTransactionState(repayAllTransaction);

        const repayAllReceipt = await repayAllTransaction.wait();

        updateTransactionState(repayAllReceipt);
        setRepayAmount('');
        setLoadmsg('');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      updateTransactionState(err as TransactionReceipt);
    }
  };

  const handleRepayRequest = async (repayAmount: string) => {
    setLoading(true);
    setLoadmsg(locale('CheckWallet'));
    try {
      if (VC) {
        const formattedUSDAAmount = utils.parseUnits(repayAmount, USDA_DECIMALS);
        const repayTransaction = await VC.repayUSDA(BN(vaultID), formattedUSDAAmount);

        updateTransactionState(repayTransaction);

        const repayReceipt = await repayTransaction.wait();

        updateTransactionState(repayReceipt);
        setRepayAmount('');
        setLoadmsg('');
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      updateTransactionState(err as TransactionReceipt);
    }
  };

  return (
    <Box>
      <ModalInputContainer focus={focus}>
        <DecimalInput
          onFocus={toggle}
          onBlur={toggle}
          onChange={onInputChange}
          placeholder={`0 ${tokenName}`}
          value={repayAmount}
        />
        <Box sx={{ display: 'flex', paddingBottom: 0.5, alignItems: 'center' }}>
          <Typography
            variant='body3'
            sx={{
              color: formatColor(neutral.gray3),
              marginLeft: 1,
            }}
          >
            {`${Number(newHealth).toFixed(2)}%`}
          </Typography>
        </Box>
      </ModalInputContainer>
      <Box marginTop={2} display='grid' gridTemplateColumns='2fr 1fr' columnGap={0.5}>
        <DisableableModalButton
          text='Repay'
          onClick={() => handleRepayRequest(repayAmount)}
          disabled={disabled}
          loading={loading}
          load_text={loadmsg}
          shaking={shaking}
        />

        <DisableableModalButton
          text='Repay All'
          onClick={handleRepayAllRequest}
          loading={loading}
          shaking={shaking}
          disabled={accountLiability <= 0} // disable if account liability is lower than 0.01 and rounded up
        />
      </Box>
    </Box>
  );
};
