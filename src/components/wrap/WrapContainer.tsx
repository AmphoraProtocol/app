import { useEffect } from 'react';
import { Box, useTheme, Button } from '@mui/material';
import { useAccount } from 'wagmi';
import { utils } from 'ethers';

import { useAppSelector, useLight } from '~/hooks';
import { formatColor, neutral } from '~/theme';
import { ForwardIcon } from '../icons/misc/ForwardIcon';
import { TokenSelect } from './TokenSelect';
import { useTokenAmountInput } from './useTokenAmountInput';
import { useModalContext, ModalType } from '../libs/modal-content-provider/ModalContentProvider';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { BN } from '~/utils';
import { useWrapTokenContext } from '../libs/wrap-token-provider/WrapTokenProvider';

export const WrapContainer = () => {
  const theme = useTheme();
  const isLight = useLight();
  const { isConnected } = useAccount();
  const totalUSDAWrapped = useAppSelector((state) => state.VC.totalUSDAWrapped);
  const [token1Amount, setToken1Amount, token2Amount, setToken2Amount, swapTokenAmount] = useTokenAmountInput();
  const [token1, token2, swapPositions] = useWrapTokenContext();

  const { openConnectModal } = useConnectModal();
  const { setType, updateUSDA } = useModalContext();

  const swapTokens = () => {
    if (token1.ticker === 'USDA') {
      updateUSDA((old) => {
        return { ...old, amountToWrap: token1Amount };
      });
    } else {
      updateUSDA((old) => {
        return { ...old, amountToUnwrap: token1Amount };
      });
    }
    swapTokenAmount();
    swapPositions();
    updateUSDA((old) => {
      return { ...old, maxWrap: false, maxUnwrap: false };
    });
    setToken1Amount('');
  };

  const handleConnect = () => {
    const hasAcknowledgedTerms = localStorage.getItem('acknowledgeTerms');
    if (!hasAcknowledgedTerms) {
      setType(ModalType.AcknowledgeTerms);
    } else {
      openConnectModal && openConnectModal();
    }
  };

  const token1MaxBalance = () => {
    if (token1.ticker === 'USDA') {
      updateUSDA((old) => {
        return { ...old, maxWrap: true };
      });
    } else {
      updateUSDA((old) => {
        return { ...old, maxUnwrap: true };
      });
    }
  };

  const token1Input = (amount: string) => {
    setToken1Amount(amount);
    updateUSDA((old) => {
      return { ...old, maxWrap: false, maxUnwrap: false };
    });
  };

  const token2Input = (amount: string) => {
    setToken2Amount(amount);
    updateUSDA((old) => {
      return { ...old, maxWrap: false, maxUnwrap: false };
    });
  };

  useEffect(() => {
    if (token1.ticker === 'USDA') {
      updateUSDA((old) => {
        return { ...old, amountToWrap: token1Amount };
      });
    } else {
      updateUSDA((old) => {
        return { ...old, amountToUnwrap: token1Amount };
      });
    }
  }, [token1.ticker, token1Amount, updateUSDA]);

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
        token1.ticker === 'USDA' ? (
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
                setType(ModalType.WrapUSDAConfirmation);
              }
            }}
          >
            Wrap USDA
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
              totalUSDAWrapped < Number(token1Amount)
            }
            onClick={() => setType(ModalType.UnwrapUSDAConfirmation)}
          >
            Unwrap wUSDA
          </Button>
        )
      ) : (
        <Button
          variant='contained'
          onClick={handleConnect}
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
