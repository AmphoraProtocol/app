import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import { formatColor, neutral } from '../../../theme';
import { useEffect, useState } from 'react';
import { ModalType, useModalContext } from '../../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { ForwardIcon } from '../../icons/misc/ForwardIcon';
import { useRolodexContext } from '../../libs/rolodex-data-provider/RolodexDataProvider';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import { BN } from '../../../easy/bn';
import { ContractTransaction } from 'ethers';
import { locale } from '../../../locale';
import { TransactionReceipt } from '@ethersproject/providers';
import { Chains } from '../../../chain/chains';
import { depositUSDC } from '../../../contracts/USDI/depositUSDC';
import SVGBox from '../../icons/misc/SVGBox';
import { hasUSDCAllowance } from '../../../contracts/misc/hasAllowance';
import { useStableCoinsContext } from '../../libs/stable-coins-provider/StableCoinsProvider';
import { DEFAULT_APPROVE_AMOUNT } from '../../../constants';

export const DepositUSDCConfirmationModal = () => {
  const { type, setType, USDC, updateTransactionState } = useModalContext();
  const { currentAccount, dataBlock, currentSigner, chainId } = useWeb3Context();
  const { USDC: USDC_TOKEN } = useStableCoinsContext();
  const [loading, setLoading] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');
  const rolodex = useRolodexContext();

  const [hasAllowance, setHasAllowance] = useState(false);
  const [approvalTxn, setApprovalTxn] = useState<ContractTransaction>();

  const chain = Chains.getInfo(chainId);

  useEffect(() => {
    if (rolodex && USDC.amountToDeposit) {
      hasUSDCAllowance(
        currentAccount,
        rolodex.addressUSDI,
        USDC.maxDeposit ? USDC_TOKEN.wallet_amount! : USDC.amountToDeposit,
        rolodex,
      ).then(setHasAllowance);
    }
  }, [rolodex, dataBlock, chainId, USDC.amountToDeposit, loadmsg]);

  const handleDepositConfirmationRequest = async () => {
    if (rolodex && USDC.amountToDeposit && currentSigner) {
      setLoading(true);
      setLoadmsg(locale('CheckWallet'));
      try {
        const depositTransaction = await depositUSDC(
          USDC.maxDeposit ? USDC_TOKEN.wallet_amount! : BN(USDC.amountToDeposit).mul(BN('1e6')),
          rolodex,
          currentSigner!,
        );

        updateTransactionState(depositTransaction);
        setLoadmsg(locale('TransactionPending'));

        const depositReceipt = await depositTransaction.wait();
        updateTransactionState(depositReceipt);
      } catch (e) {
        const error = e as TransactionReceipt;

        updateTransactionState(error);
      }
      setApprovalTxn(undefined);
      setLoading(false);
    }
  };
  const handleApprovalRequest = async () => {
    if (rolodex && USDC.amountToDeposit) {
      const depositAmount = BN(DEFAULT_APPROVE_AMOUNT).mul(BN('1e6'));

      setLoading(true);
      try {
        setLoadmsg(locale('CheckWallet'));
        const txn = await rolodex.USDC?.connect(currentSigner!).approve(rolodex.addressUSDI, depositAmount);

        setApprovalTxn(txn);

        setLoadmsg(locale('TransactionPending'));
        await txn?.wait();

        setLoadmsg('');
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={type === ModalType.DepositUSDCConfirmation}
      setOpen={() => {
        setType(null);
      }}
    >
      <Typography variant='body3' color='text.primary'>
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
          backgroundColor: 'background.overview',
        }}
      >
        <Box display='flex' alignItems='center'>
          <SVGBox width={36} height={36} svg_name='USDC' alt='USDC' sx={{ mr: 3 }} />
          <Box>
            <Typography variant='body3' color='text.primary'>
              {'$' +
                Number(USDC.amountToDeposit).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </Typography>
          </Box>
        </Box>

        <ForwardIcon sx={{ width: 15, height: 15 }} strokecolor={formatColor(neutral.gray3)} />

        <Box display='flex' alignItems='center'>
          <Box>
            <Typography variant='body3' color='text.primary'>
              {'$' +
                Number(USDC.amountToDeposit).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </Typography>
          </Box>

          <SVGBox width={36} height={36} svg_name='USDI' alt='USDI' sx={{ ml: 3 }} />
        </Box>
      </Box>

      <Box textAlign='center' mb={5}>
        <Typography variant='body3_medium' color={formatColor(neutral.gray3)} fontStyle='italic'>
          1 USDC = 1 USDi ($1)
        </Typography>
      </Box>

      <DisableableModalButton
        text={hasAllowance ? 'Confirm Deposit' : 'Set Allowance'}
        disabled={false}
        onClick={hasAllowance ? handleDepositConfirmationRequest : handleApprovalRequest}
        loading={loading}
        load_text={loadmsg}
      />
      {approvalTxn !== undefined && (
        <MuiLink mt={1} display='block' target='_blank' href={`${chain.scan_url}${approvalTxn.hash}`}>
          <Button variant='text'>View approval on {chain.scan_site}</Button>
        </MuiLink>
      )}
    </BaseModal>
  );
};
