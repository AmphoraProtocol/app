import { useEffect } from 'react';
import { Box, useTheme, Button } from '@mui/material';
import { useAccount } from 'wagmi';
import { utils } from 'ethers';

import { useAppSelector, useLight } from '~/hooks';
import { formatColor, neutral } from '~/theme';
import { ForwardIcon } from '../icons/misc/ForwardIcon';
import { useSwapTokenContext } from '../libs/swap-token-provider/SwapTokenProvider';
import { TokenSelect } from './TokenSelect';
import { useTokenAmountInput } from './useTokenAmountInput';
import { useModalContext, ModalType } from '../libs/modal-content-provider/ModalContentProvider';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { BN } from '~/utils';

export const SwapContainer = () => {
  const theme = useTheme();
  const isLight = useLight();
  const { isConnected } = useAccount();
  const totalSUSDDeposited = useAppSelector((state) => state.VC.totalSUSDDeposited);
  const [token1Amount, setToken1Amount, token2Amount, setToken2Amount, swapTokenAmount] = useTokenAmountInput();
  const [token1, token2, swapTokenPositions] = useSwapTokenContext();

  const { openConnectModal } = useConnectModal();
  const { setType, updateSUSD } = useModalContext();

  const swapTokens = () => {
    if (token1.ticker === 'sUSD') {
      updateSUSD('amountToWithdraw', token1Amount);
    } else {
      updateSUSD('amountToDeposit', token1Amount);
    }
    swapTokenAmount();
    swapTokenPositions();
    updateSUSD('maxDeposit', false);
    updateSUSD('maxWithdraw', false);
    setToken1Amount('');
  };

  const token1MaxBalance = () => {
    if (token1.ticker === 'sUSD') {
      updateSUSD('maxDeposit', true);
    } else {
      updateSUSD('maxWithdraw', true);
    }
  };

  const token1Input = (amount: string) => {
    setToken1Amount(amount);
    updateSUSD('maxDeposit', false);
    updateSUSD('maxWithdraw', false);
  };

  const token2Input = (amount: string) => {
    setToken2Amount(amount);
    updateSUSD('maxDeposit', false);
    updateSUSD('maxWithdraw', false);
  };

  useEffect(() => {
    if (token1.ticker === 'sUSD') {
      updateSUSD('amountToDeposit', token1Amount);
    } else {
      updateSUSD('amountToWithdraw', token1Amount);
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

      {isConnected ? (
        token1.ticker === 'sUSD' ? (
          <Button
            variant='contained'
            sx={{
              backgroundColor: 'button.mintRedeem',
              color: formatColor(neutral.white),
              width: '100%',
            }}
            disabled={
              Number(token1Amount) <= 0 ||
              !token1.wallet_balance ||
              BN(utils.parseEther(token1Amount)).gt(BN(token1.wallet_amount))
            }
            onClick={() => {
              if (Number(token1Amount) > 0) {
                setType(ModalType.DepositSUSDConfirmation);
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
            disabled={
              !token1.wallet_balance ||
              Number(token1Amount) <= 0 ||
              BN(utils.parseEther(token1Amount)).gt(BN(token1.wallet_amount)) ||
              totalSUSDDeposited < Number(token1Amount)
            }
            onClick={() => setType(ModalType.WithdrawSUSDConfirmation)}
          >
            Redeem USDA
          </Button>
        )
      ) : (
        <Button
          variant='contained'
          onClick={() => openConnectModal && openConnectModal()}
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
