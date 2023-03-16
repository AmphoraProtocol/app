import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';

import { formatColor, neutral } from '../../../../theme';
import { DecimalInput } from '../../textFields';
import { DisableableModalButton } from '../../button/DisableableModalButton';
import { ModalInputContainer } from './ModalInputContainer';
import { ContractReceipt } from 'ethers';
import { useRolodexContext } from '../../../libs/rolodex-data-provider/RolodexDataProvider';
import { useWeb3Context } from '../../../libs/web3-data-provider/Web3Provider';
import { locale } from '../../../../locale';
import { useModalContext } from '../../../libs/modal-content-provider/ModalContentProvider';
import { borrowUsda } from '~/contracts/VaultController';

interface BorrowContent {
  tokenName: string;
  vaultBorrowPower: string;
  borrowAmount: string;
  setBorrowAmount: (e: string) => void;
  vaultID: number;
  accountLiability: number;
}

export const BorrowContent = (props: BorrowContent) => {
  const { tokenName, vaultBorrowPower, borrowAmount, setBorrowAmount, vaultID, accountLiability } = props;
  const { updateTransactionState } = useModalContext();
  const rolodex = useRolodexContext();

  const { currentSigner } = useWeb3Context();
  const [disabled, setDisabled] = useState(true);
  const [focus, setFocus] = useState(false);

  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');

  const [newHealth, setNewHealth] = useState(100 * (accountLiability / Number(vaultBorrowPower)));

  const toggle = () => setFocus(!focus);
  useEffect(() => {
    setDisabled(Number(borrowAmount) < 1);
  }, [borrowAmount]);
  const onInputChange = (e: string) => {
    const newLib = (accountLiability + Number(e)) / Number(vaultBorrowPower);
    if (newLib >= 1) {
      setBorrowAmount((0.95 * (Number(vaultBorrowPower) - accountLiability)).toFixed(2));
    } else {
      setBorrowAmount(e);
    }
  };

  useEffect(() => {
    const newHealth = (100 * (accountLiability + Number(borrowAmount))) / Number(vaultBorrowPower);

    if (isNaN(newHealth)) {
      setNewHealth(0);
    } else {
      setNewHealth(newHealth);
    }
  }, [borrowAmount]);

  const handleBorrowRequest = async () => {
    setLoading(true);
    setLoadmsg(locale('CheckWallet'));
    try {
      const borrowTransaction = await borrowUsda(vaultID, borrowAmount, rolodex!, currentSigner!);

      updateTransactionState(borrowTransaction);

      const borrowReceipt = await borrowTransaction.wait();

      updateTransactionState(borrowReceipt);

      setLoadmsg('');
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      updateTransactionState(e as ContractReceipt);
    }
  };

  return (
    <Box>
      <ModalInputContainer focus={focus}>
        <DecimalInput
          onBlur={toggle}
          onFocus={toggle}
          onChange={onInputChange}
          placeholder={`0 ${tokenName}`}
          value={borrowAmount}
        />
        <Box sx={{ display: 'flex', paddingBottom: 0.5, alignItems: 'center' }}>
          <Typography
            variant='body3'
            sx={{
              color: formatColor(neutral.gray3),

              marginLeft: 1,
            }}
          >
            {`${newHealth.toFixed(2)}%`}
          </Typography>
        </Box>
      </ModalInputContainer>
      <Box marginTop={2}>
        <DisableableModalButton
          text={'Borrow'}
          disabled={disabled}
          onClick={handleBorrowRequest}
          loading={loading}
          load_text={loadmsg}
          shaking={shaking}
        />
      </Box>
    </Box>
  );
};
