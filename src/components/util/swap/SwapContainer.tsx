import { Box, useTheme, Button } from '@mui/material';
import { useEffect } from 'react';

import { useLight } from '../../../hooks/useLight';
import { formatColor, neutral } from '../../../theme';
import { ForwardIcon } from '../../icons/misc/ForwardIcon';
import { useSwapTokenContext } from '../../libs/swap-token-provider/SwapTokenProvider';
import { TokenSelect } from './TokenSelect';
import { useTokenAmountInput } from './useTokenAmountInput';
import { useWalletModalContext } from '../../libs/wallet-modal-provider/WalletModalProvider';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import { useModalContext, ModalType } from '../../libs/modal-content-provider/ModalContentProvider';

export const SwapContainer = () => {
  const isLight = useLight();

  const theme = useTheme();

  const [token1, token2, swapTokenPositions] = useSwapTokenContext();
  const { setIsWalletModalOpen } = useWalletModalContext();
  const { setType, updateUSDC } = useModalContext();

  const { connected } = useWeb3Context();

  const [token1Amount, setToken1Amount, token2Amount, setToken2Amount, swapTokenAmount] = useTokenAmountInput();

  const swapTokens = () => {
    if (token1.ticker === 'sUSD') {
      updateUSDC('amountToWithdraw', token1Amount);
    } else {
      updateUSDC('amountToDeposit', token1Amount);
    }
    swapTokenAmount();
    swapTokenPositions();
    updateUSDC('maxDeposit', false);
    updateUSDC('maxWithdraw', false);
  };

  const token1MaxBalance = () => {
    if (token1.ticker === 'sUSD') {
      updateUSDC('maxDeposit', true);
    } else {
      updateUSDC('maxWithdraw', true);
    }
  };

  const token1Input = (amount: string) => {
    setToken1Amount(amount);
    updateUSDC('maxDeposit', false);
    updateUSDC('maxWithdraw', false);
  };

  const token2Input = (amount: string) => {
    setToken2Amount(amount);
    updateUSDC('maxDeposit', false);
    updateUSDC('maxWithdraw', false);
  };

  useEffect(() => {
    if (token1.ticker === 'sUSD') {
      updateUSDC('amountToDeposit', token1Amount);
    } else {
      updateUSDC('amountToWithdraw', token1Amount);
    }
  }, [token1Amount]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          columnGap: 2,
          rowGap: 1,
          mb: 3,
          borderRadius: 2,
          position: 'relative',
          [theme.breakpoints.down('md')]: {
            flexDirection: 'column',
          },
        }}
      >
        <TokenSelect
          token={token1}
          tokenAmount={token1Amount}
          setTokenAmount={token1Input}
          onMaxBalanceClick={token1MaxBalance}
        />

        <Button
          sx={{
            padding: 0,
            minWidth: 'auto',
            backgroundColor: isLight ? formatColor(neutral.gray6) : formatColor(neutral.gray7),
            position: 'absolute',
            width: 42,
            height: 30,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 2,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: isLight ? formatColor(neutral.gray6) : formatColor(neutral.gray8),
          }}
          onClick={swapTokens}
        >
          <ForwardIcon
            stroke={isLight ? formatColor(neutral.black) : formatColor(neutral.white)}
            sx={{
              width: 14,
              height: 13,
              [theme.breakpoints.down('md')]: {
                transform: 'rotate(90deg)',
              },
            }}
          />
        </Button>

        <TokenSelect token={token2} tokenAmount={token2Amount} setTokenAmount={token2Input} disableSetMax={true} />
      </Box>

      {connected ? (
        token1.ticker === 'sUSD' ? (
          <Button
            variant='contained'
            sx={{
              backgroundColor: 'button.mintRedeem',
              color: formatColor(neutral.white),
              width: '100%',
            }}
            disabled={Number(token1Amount) <= 0 || !token1.wallet_balance}
            onClick={() => {
              if (Number(token1Amount) > 0) {
                setType(ModalType.DepositUSDCConfirmation);
              }
            }}
          >
            Mint USDA
          </Button>
        ) : (
          <Button
            variant='contained'
            sx={{
              backgroundColor: 'button.mintRedeem',
              color: formatColor(neutral.white),
              width: '100%',
            }}
            disabled={!token1.wallet_balance || Number(token1Amount) <= 0}
            onClick={() => setType(ModalType.WithdrawUSDCConfirmation)}
          >
            Redeem USDA
          </Button>
        )
      ) : (
        <Button
          variant='contained'
          onClick={() => setIsWalletModalOpen(true)}
          sx={{
            backgroundColor: 'button.mintRedeem',
            color: formatColor(neutral.white),
            width: '100%',
          }}
        >
          Connect Wallet
        </Button>
      )}
    </>
  );
};
