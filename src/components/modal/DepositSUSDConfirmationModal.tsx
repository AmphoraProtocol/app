import { useEffect, useState } from 'react';
import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import { useContract, useAccount, useNetwork, useContractRead } from 'wagmi';
import { ContractReceipt, ContractTransaction, utils } from 'ethers';

import { BN, locale, formatNumber } from '~/utils';
import { useAppSelector, useAmphContracts } from '~/hooks';
import { formatColor, neutral } from '~/theme';
import { getConfig, Chains } from '~/config';
import { BaseModal } from './BaseModal';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { ForwardIcon } from '../icons/misc/ForwardIcon';
import SVGBox from '../icons/misc/SVGBox';

export const DepositSUSDConfirmationModal = () => {
  const { type, setType, SUSD, updateTransactionState } = useModalContext();
  const { SUSD: SUSD_TOKEN } = useAppSelector((state) => state.stablecoins);
  const [loading, setLoading] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');

  const [hasAllowance, setHasAllowance] = useState(false);
  const [approvalTxn, setApprovalTxn] = useState<ContractTransaction>();
  const { chain: currentChain } = useNetwork();
  const { DEFAULT_CHAIN_ID } = getConfig();
  const chain = Chains.getInfo(currentChain?.id || DEFAULT_CHAIN_ID);
  const { address } = useAccount();
  const { susdContract, usdaContract } = useAmphContracts();
  const SUSDContract = useContract(susdContract);
  const USDAContract = useContract(usdaContract);
  const { USDA } = getConfig().ADDRESSES[currentChain?.id || DEFAULT_CHAIN_ID];

  const sUSDAllowance = useContractRead({
    ...susdContract,
    functionName: 'allowance',
    args: address && [address, USDA],
  });

  useEffect(() => {
    if (SUSD.amountToDeposit && address && SUSDContract && sUSDAllowance.data) {
      const amount = SUSD.maxDeposit
        ? SUSD_TOKEN.wallet_amount!
        : utils.parseUnits(SUSD.amountToDeposit, SUSD_TOKEN.decimals);
      setHasAllowance(sUSDAllowance.data.gte(amount));
    }
  }, [address, SUSD.amountToDeposit, loadmsg, sUSDAllowance.data]);

  const handleDepositConfirmationRequest = async () => {
    if (SUSD.amountToDeposit && USDAContract) {
      setLoading(true);
      setLoadmsg(locale('CheckWallet'));
      try {
        const depositTransaction = await USDAContract.deposit(
          SUSD.maxDeposit
            ? BN(SUSD_TOKEN.wallet_amount!)
            : BN(SUSD.amountToDeposit).mul(BN(`1e${SUSD_TOKEN.decimals}`)),
        );

        updateTransactionState(depositTransaction);
        setLoadmsg(locale('TransactionPending'));

        const depositReceipt = await depositTransaction.wait();
        updateTransactionState(depositReceipt);
        await sUSDAllowance.refetch();
      } catch (err) {
        updateTransactionState(err as ContractReceipt);
      }
      setApprovalTxn(undefined);
      setLoading(false);
    }
  };

  const handleApprovalRequest = async () => {
    if (SUSDContract && SUSD.amountToDeposit) {
      const depositAmount = BN(SUSD.amountToDeposit).mul(BN(`1e${SUSD_TOKEN.decimals}`));

      setLoading(true);
      try {
        setLoadmsg(locale('CheckWallet'));
        const txn = await SUSDContract.approve(USDA, depositAmount);

        setApprovalTxn(txn);

        setLoadmsg(locale('TransactionPending'));
        await txn?.wait();

        setLoadmsg('');
        await sUSDAllowance.refetch();
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  };

  return (
    <BaseModal
      open={type === ModalType.DepositSUSDConfirmation}
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
          <SVGBox width={36} height={36} svg_name='sUSD' alt='sUSD' sx={{ mr: 3 }} />
          <Box>
            <Typography variant='body3' color='text.primary'>
              {'$' + formatNumber(Number(SUSD.amountToDeposit))}
            </Typography>
          </Box>
        </Box>

        <ForwardIcon sx={{ width: 15, height: 15 }} strokecolor={formatColor(neutral.gray3)} />

        <Box display='flex' alignItems='center'>
          <Box>
            <Typography variant='body3' color='text.primary'>
              {'$' + formatNumber(Number(SUSD.amountToDeposit))}
            </Typography>
          </Box>

          <SVGBox width={36} height={36} img_name='USDA.png' alt='USDA' sx={{ ml: 3 }} />
        </Box>
      </Box>

      <Box textAlign='center' mb={5}>
        <Typography variant='body3_medium' color={formatColor(neutral.gray3)} fontStyle='italic'>
          1 snxUSD = 1 USDA ($1)
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
        <MuiLink mt={1} display='block' target='_blank' href={`${chain.scan_url}tx/${approvalTxn.hash}`}>
          <Button variant='text'>View approval on {chain.scan_site}</Button>
        </MuiLink>
      )}
    </BaseModal>
  );
};
