import { useState, useEffect } from 'react';
import { ContractReceipt, utils } from 'ethers';
import { Box, Typography } from '@mui/material';
import { useSigner, useContract, useAccount } from 'wagmi';
import { getAddress } from 'viem';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { useLight } from '~/hooks/useLight';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { locale } from '~/utils/locale';
import { useAppSelector } from '~/hooks/store';
import { IERC20Metadata__factory, IVault__factory } from '~/chain/contracts';
import { formatBNtoPreciseStringAndNumber } from '~/hooks/formatBNWithDecimals';

export const DepositCollateralConfirmationModal = () => {
  const {
    type,
    setType,
    collateralToken,
    collateralDepositAmount,
    updateTransactionState,
    setCollateralDepositAmount,
    collateralDepositAmountMax,
    setCollateralDepositAmountMax,
  } = useModalContext();
  const [loading, setLoading] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');
  const { vaultAddress } = useAppSelector((state) => state.VC.userVault);
  const [hasAllowance, setHasAllowance] = useState(false);
  const [hasCollateralAllowance, setHasCollateralAllowance] = useState(false);
  const [allowance, setAllowance] = useState<string>('0');
  const isLight = useLight();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const amount = collateralDepositAmountMax ? collateralToken.wallet_amount : collateralDepositAmount;

  const collateralContract = useContract({
    address: collateralToken.address,
    abi: IERC20Metadata__factory.abi,
    signerOrProvider: signer,
  });

  const vaultContract = useContract({
    address: vaultAddress,
    abi: IVault__factory.abi,
    signerOrProvider: signer,
  });

  const handleDepositConfirmationRequest = async () => {
    try {
      if (vaultContract && amount) {
        const formattedERC20Amount =
          typeof amount === 'string' ? utils.parseUnits(amount, collateralToken.decimals) : amount;

        const attempt = await vaultContract.depositERC20(getAddress(collateralToken.address), formattedERC20Amount);

        updateTransactionState(attempt!);

        setLoadmsg(locale('TransactionPending'));
        const receipt = await attempt.wait();

        setCollateralDepositAmount('');
        setCollateralDepositAmountMax(false);

        updateTransactionState(receipt);
      }
    } catch (err) {
      const error = err as ContractReceipt;

      updateTransactionState(error);
    }

    setLoadmsg('');
    setLoading(false);
  };

  const handleAllowance = async () => {
    setLoading(true);
    setLoadmsg(locale('CheckWallet'));
    try {
      if (amount && collateralContract && vaultAddress) {
        const formattedERC20Amount =
          typeof amount === 'string' ? utils.parseUnits(amount, collateralToken.decimals) : amount;

        const attempt = await collateralContract.approve(getAddress(vaultAddress), formattedERC20Amount);

        await attempt.wait();
        setHasCollateralAllowance(true);
        setAllowance(amount.toString());
      }
    } catch (err) {
      const error = err as ContractReceipt;
      updateTransactionState(error);
    }

    setLoadmsg('');
    setLoading(false);
  };

  useEffect(() => {
    if (type === 'DEPOSIT_COLLATERAL_CONFIRMATION' && collateralContract && address && vaultAddress) {
      collateralContract.allowance(getAddress(address), getAddress(vaultAddress)).then((allowance) => {
        const formattedBalance = formatBNtoPreciseStringAndNumber(allowance, collateralToken.decimals);
        if (formattedBalance.num >= Number.parseFloat(collateralDepositAmount)) {
          setHasCollateralAllowance(true);
        } else {
          setHasCollateralAllowance(false);
        }
        setAllowance(formattedBalance.str);
      });
    }
  }, [type, allowance, hasCollateralAllowance]);

  return (
    <BaseModal
      open={type === ModalType.DepositCollateralConfirmation}
      setOpen={() => {
        setType(ModalType.DepositCollateral);
      }}
    >
      <Typography variant='body1' color={isLight ? formatColor(neutral.gray1) : formatColor(neutral.white)}>
        Confirm Deposit
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
          <Box
            component='img'
            width={36}
            height={36}
            src={`images/${collateralToken.ticker}.svg`}
            alt={collateralToken.ticker}
            marginRight={3}
          ></Box>
          <Box>
            <Typography variant='body3' color='text.primary'>
              ${(collateralToken.price * Number(collateralDepositAmount)).toFixed(2)} ({collateralDepositAmount}{' '}
              {collateralToken.ticker})
            </Typography>
          </Box>
        </Box>
      </Box>

      <DisableableModalButton
        text={
          !collateralToken.capped_token ||
          (collateralToken.capped_token && collateralToken.capped_address) ||
          hasAllowance
            ? hasCollateralAllowance
              ? 'Confirm Deposit'
              : 'Approve'
            : 'Set Allowance'
        }
        disabled={false}
        onClick={() => {
          hasCollateralAllowance ? handleDepositConfirmationRequest() : handleAllowance();
        }}
        loading={loading}
        load_text={loadmsg}
      />
    </BaseModal>
  );
};
