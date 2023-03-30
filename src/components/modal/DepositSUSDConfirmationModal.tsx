import { useEffect, useState } from 'react';
import { Box, Button, Typography, Link as MuiLink } from '@mui/material';
import { TransactionReceipt } from '@ethersproject/providers';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';
import { DisableableModalButton } from '../button/DisableableModalButton';
import { ForwardIcon } from '../icons/misc/ForwardIcon';
import { BN } from '~/utils/bn';
import { ContractTransaction } from 'ethers';
import { locale } from '~/utils/locale';
import { Chains } from '~/utils/chains';
import SVGBox from '../icons/misc/SVGBox';
import { hasSUSDAllowance } from '~/utils/hasAllowance';
import { DEFAULT_APPROVE_AMOUNT, SUSD_ADDRESS, USDA_ADDRESS } from '~/constants';
import { useAppSelector } from '~/hooks/store';
import { useSigner, useContract, useAccount, useNetwork } from 'wagmi';
import { IUSDA__factory } from '~/chain/contracts';
import { getAddress } from 'viem';

export const DepositSUSDConfirmationModal = () => {
  const { type, setType, SUSD, updateTransactionState } = useModalContext();
  const { SUSD: SUSD_TOKEN } = useAppSelector((state) => state.stablecoins);
  const [loading, setLoading] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');

  const [hasAllowance, setHasAllowance] = useState(false);
  const [approvalTxn, setApprovalTxn] = useState<ContractTransaction>();
  const { chain: currentChain } = useNetwork();
  const chain = Chains.getInfo(currentChain?.id || 1);
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const SUSDContract = useContract({
    address: SUSD_ADDRESS,
    abi: IUSDA__factory.abi,
    signerOrProvider: signer,
  });

  const USDAContract = useContract({
    address: USDA_ADDRESS,
    abi: IUSDA__factory.abi,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (SUSD.amountToDeposit && address && SUSDContract) {
      SUSDContract.allowance(getAddress(address), getAddress(USDA_ADDRESS)).then((allowance) => {
        hasSUSDAllowance(
          SUSD.maxDeposit ? SUSD_TOKEN.wallet_amount! : SUSD.amountToDeposit,
          allowance,
          SUSD_TOKEN.decimals,
        ).then(setHasAllowance);
      });
    }
  }, [address, SUSD.amountToDeposit, loadmsg]);

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
      } catch (e) {
        const error = e as TransactionReceipt;

        updateTransactionState(error);
      }
      setApprovalTxn(undefined);
      setLoading(false);
    }
  };

  const handleApprovalRequest = async () => {
    if (SUSDContract && SUSD.amountToDeposit) {
      const depositAmount = BN(DEFAULT_APPROVE_AMOUNT).mul(BN(`1e${SUSD_TOKEN.decimals}`));

      setLoading(true);
      try {
        setLoadmsg(locale('CheckWallet'));
        const txn = await SUSDContract.approve(USDA_ADDRESS, depositAmount);

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
              {'$' +
                Number(SUSD.amountToDeposit).toLocaleString(undefined, {
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
                Number(SUSD.amountToDeposit).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
            </Typography>
          </Box>

          <SVGBox width={36} height={36} svg_name='USDA' alt='USDA' sx={{ ml: 3 }} />
        </Box>
      </Box>

      <Box textAlign='center' mb={5}>
        <Typography variant='body3_medium' color={formatColor(neutral.gray3)} fontStyle='italic'>
          1 sUSD = 1 USDA ($1)
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
