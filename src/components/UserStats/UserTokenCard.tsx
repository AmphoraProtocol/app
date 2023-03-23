import { ContractReceipt } from 'ethers';
import { Box, BoxProps, Button, LinearProgress, Link, Typography } from '@mui/material';

import { formatColor, neutral } from '~/theme';
import { useLight } from '~/hooks/useLight';
import { UserTokenMobileDropdown } from './UserTokenMobileDropdown';
import SVGBox from '../icons/misc/SVGBox';
import { useAppGovernanceContext } from '../libs/app-governance-provider/AppGovernanceProvider';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { useRolodexContext } from '../libs/rolodex-data-provider/RolodexDataProvider';
import { useWalletModalContext } from '../libs/wallet-modal-provider/WalletModalProvider';
import { useWeb3Context } from '../libs/web3-data-provider/Web3Provider';
import { ToolTip } from '../tooltip/ToolTip';
import { useAppSelector } from '~/hooks/store';
import { OracleType } from '~/types';

interface UserTokenCardProps extends BoxProps {
  tokenName: string;
  tokenTicker: string;
  tokenPrice: string;
  vaultBalance: string;
  tokenAmount: string;
  image: {
    src: string;
    alt: string;
  };
  LTVPercent: string;
  penaltyPercent: string;
  canDelegate: boolean | undefined;
  index: number;
  cappedToken: boolean | undefined;
  tokenAddress: string | undefined;
  cappedPercent: number | undefined;
  oracleAddress: string | undefined;
  oracleType: OracleType | undefined;
}

export const UserTokenCard = (props: UserTokenCardProps) => {
  const isLight = useLight();
  const rolodex = useRolodexContext();
  const { connected } = useWeb3Context();
  const { setIsWalletModalOpen } = useWalletModalContext();
  const tokens = useAppSelector((state) => state.collaterals.elements);

  const { setType, setCollateralToken, updateTransactionState } = useModalContext();
  const { setDelegateToken } = useAppGovernanceContext();
  const userVault = useAppSelector((state) => state.VC.userVault);

  const {
    tokenName,
    tokenTicker,
    tokenPrice,
    vaultBalance,
    tokenAmount,
    image,
    LTVPercent,
    penaltyPercent,
    canDelegate = false,
    index,
    cappedToken,
    tokenAddress,
    cappedPercent,
    oracleAddress,
    oracleType,
  } = props;

  const openVault = async () => {
    try {
      const mintVaultRes = await rolodex!.VC!.mintVault();
      updateTransactionState(mintVaultRes);
      const mintVaultReceipt = await mintVaultRes.wait();
      updateTransactionState(mintVaultReceipt);
      return mintVaultRes;
    } catch (err) {
      updateTransactionState(err as ContractReceipt);
      throw new Error('Error creating vault');
    }
  };

  const handleDWClick = (modalType: ModalType) => {
    if (!connected) {
      setIsWalletModalOpen(true);
    } else if (!userVault.vaultID && !userVault.vaultAddress) {
      openVault();
    } else {
      setCollateralToken((tokens as any)[tokenTicker]);
      setType(modalType);
    }
  };

  const setAndOpenDelegate = () => {
    setDelegateToken((tokens as any)[tokenTicker]);
    setType(ModalType.Delegate);
  };

  return (
    <Box
      sx={{
        paddingY: 2,
        paddingX: { xs: 2, lg: 2.5 },
        backgroundColor: index % 2 === 0 ? 'card.list' : 'transparent',
        ...props.sx,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1.5fr 1fr 1fr',
            lg: '1.5fr 0.5fr 1fr 0.5fr 0.5fr 1fr 0.6fr 0.8fr',
          },
          mb: 0,
          columnGap: 2,
          alignItems: 'center',
        }}
      >
        <Box display='flex' alignItems='center' columnGap={2}>
          <SVGBox width={{ xs: 24, lg: 40 }} height={{ xs: 24, lg: 40 }} svg_name={image.src} alt={image.alt} />
          <Link href={`https://etherscan.io/token/${tokenAddress}`} target='_blank'>
            <Box display='flex' flexDirection='column'>
              <Typography variant='body1' color='text.primary' display={{ xs: 'none', lg: 'block' }}>
                {tokenName}
              </Typography>
              <Typography variant='label_semi' fontWeight={400} color='text.secondary'>
                {tokenTicker}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Link href={`https://etherscan.io/address/${oracleAddress}`} target='_blank'>
          <Typography display={{ xs: 'none', lg: 'block' }} variant='body1' color='text.primary' textAlign='end'>
            {oracleType}
          </Typography>
        </Link>
        <Typography display={{ xs: 'none', lg: 'block' }} variant='body1' color='text.primary' textAlign='end'>
          {tokenPrice}
        </Typography>

        <Box display={{ xs: 'none', lg: 'flex' }} justifyContent='end'>
          <ToolTip
            content={<Typography variant='body3'>Maximum Loan-To-Value for this asset</Typography>}
            text={`${LTVPercent}%
          `}
            text_variant='body2'
          />
        </Box>
        <Box display={{ xs: 'none', lg: 'flex' }} justifyContent='end'>
          <ToolTip
            content={
              <Typography variant='body3'>
                Liquidation penalty paid by vault to the liquidator for liquidating this asset
              </Typography>
            }
            text={`${penaltyPercent}%
          `}
            text_variant='body2'
          />
        </Box>
        <Box display={{ xs: 'none', lg: 'flex' }} justifyContent='center'>
          {cappedToken && (
            <LinearProgress
              color='success'
              variant='determinate'
              sx={{
                width: 80,
                height: 11,
                borderRadius: 1,
                backgroundColor: isLight ? formatColor(neutral.gray6) : formatColor(neutral.white),
              }}
              value={cappedPercent}
            />
          )}
        </Box>
        <Box display='flex' flexDirection='column' textAlign='end'>
          <Typography variant='body1' color='text.primary'>
            {vaultBalance}
          </Typography>

          <Typography variant='label_semi' color='text.secondary'>
            {tokenAmount} {tokenTicker}
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            columnGap: 1.5,
            justifySelf: 'flex-end',
          }}
        >
          <Button
            onClick={() => handleDWClick(ModalType.DepositCollateral)}
            sx={{
              borderRadius: 2,
              border: '1.5px solid #A3A9BA',
              width: { xs: 32, lg: 40 },
              height: { xs: 32, lg: 40 },
              minWidth: { xs: 20, lg: 40 },
            }}
          >
            <SVGBox width={16} height={16} svg_name='plus' />
          </Button>
          <Button
            onClick={() => handleDWClick(ModalType.WithdrawCollateral)}
            sx={{
              borderRadius: 2,
              border: '1.5px solid #A3A9BA',
              width: { xs: 32, lg: 40 },
              height: { xs: 32, lg: 40 },
              minWidth: { xs: 20, lg: 40 },
            }}
          >
            <SVGBox width={16} height={16} svg_name='minus' />
          </Button>
        </Box>
        <Box display={{ xs: 'flex', lg: 'none' }} justifySelf='flex-end' width='fit-content'>
          <UserTokenMobileDropdown
            onClickDeposit={() => handleDWClick(ModalType.DepositCollateral)}
            onClickWithdraw={() => handleDWClick(ModalType.WithdrawCollateral)}
            canDelegate={canDelegate}
            onClickDelegate={setAndOpenDelegate}
          />
        </Box>
      </Box>
    </Box>
  );
};
