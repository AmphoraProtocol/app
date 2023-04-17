import { ContractReceipt } from 'ethers';
import { Box, BoxProps, Button, LinearProgress, Link, Typography } from '@mui/material';
import { useAccount, useContract, useNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { blue, formatColor, neutral } from '~/theme';
import { useLight, useAppSelector, useAmphContracts } from '~/hooks';
import { UserTokenMobileDropdown } from './UserTokenMobileDropdown';
import SVGBox from '../icons/misc/SVGBox';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { ToolTip } from '../tooltip/ToolTip';
import { OracleType } from '~/types';
import { Chains } from '~/utils';
import { getConfig } from '~/config';

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
  index: number;
  cappedToken: boolean | undefined;
  tokenAddress: string | undefined;
  cappedPercent: number | undefined;
  oracleAddress: string | undefined;
  oracleType: OracleType | undefined;
  curve_lp: boolean | undefined;
  rewards: string | undefined;
}

export const UserTokenCard = (props: UserTokenCardProps) => {
  const isLight = useLight();
  const { setType, setCollateralToken, updateTransactionState } = useModalContext();
  const userVault = useAppSelector((state) => state.VC.userVault);
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const tokens = useAppSelector((state) => state.collaterals.elements);
  const { VaultControllerContract } = useAmphContracts();
  const VC = useContract(VaultControllerContract);
  const { chain: currentChain } = useNetwork();
  const { DEFAULT_CHAIN_ID } = getConfig();
  const chain = Chains.getInfo(currentChain?.id || DEFAULT_CHAIN_ID);

  const {
    tokenName,
    tokenTicker,
    tokenPrice,
    vaultBalance,
    tokenAmount,
    image,
    LTVPercent,
    penaltyPercent,
    index,
    cappedToken,
    tokenAddress,
    cappedPercent,
    oracleAddress,
    oracleType,
    curve_lp,
    rewards,
  } = props;

  const openVault = async () => {
    try {
      if (VC) {
        const mintVaultRes = await VC?.mintVault();
        updateTransactionState(mintVaultRes);
        const mintVaultReceipt = await mintVaultRes.wait();
        updateTransactionState(mintVaultReceipt);
        return mintVaultRes;
      }
    } catch (err) {
      updateTransactionState(err as ContractReceipt);
      throw new Error('Error creating vault');
    }
  };

  const handleDWClick = (modalType: ModalType) => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else if (!userVault.vaultID && !userVault.vaultAddress) {
      openVault();
    } else {
      setCollateralToken((tokens as any)[tokenTicker]);
      setType(modalType);
    }
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
            lg: '1.55fr 0.5fr 0.7fr 0.45fr 0.45fr 0.7fr 0.6fr 0.95fr 0.7fr',
          },
          mb: 0,
          columnGap: 2,
          alignItems: 'center',
        }}
      >
        {/* Token icon and name */}
        <Box display='flex' alignItems='center' columnGap={2}>
          <SVGBox width={{ xs: 24, lg: 40 }} height={{ xs: 24, lg: 40 }} svg_name={image.src} alt={image.alt} />
          <Link href={`${chain.scan_url}token/${tokenAddress}`} target='_blank'>
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

        {/* Oracle type */}
        <Link display={{ xs: 'none', lg: 'block' }} href={`${chain.scan_url}address/${oracleAddress}`} target='_blank'>
          <Typography variant='body1' color='text.primary' textAlign='end'>
            {oracleType}
          </Typography>
        </Link>

        {/* Token price */}
        <Typography display={{ xs: 'none', lg: 'block' }} variant='body1' color='text.primary' textAlign='end'>
          {tokenPrice}
        </Typography>

        {/* LTV */}
        <Box display={{ xs: 'none', lg: 'flex' }} justifyContent='end'>
          <ToolTip
            content={<Typography variant='body3'>Maximum Loan-To-Value for this asset</Typography>}
            text={`${LTVPercent}%
          `}
            text_variant='body2'
          />
        </Box>

        {/* Liquitation penalty */}
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

        {/* Capped Bar */}
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

        {/* Vault Balance */}
        <Box display='flex' flexDirection='column' textAlign='end'>
          <Typography variant='body1' color='text.primary'>
            {isConnected && vaultBalance}
            {!isConnected && '-'}
          </Typography>

          <Typography variant='label_semi' color='text.secondary'>
            {isConnected ? tokenAmount : '- '} {tokenTicker}
          </Typography>
        </Box>

        {/* Claim button */}
        <Box pl={2} display={{ xs: 'none', lg: 'flex' }}>
          {curve_lp && isConnected && userVault.vaultAddress && (
            <Button
              onClick={() => handleDWClick(ModalType.Claim)}
              variant='contained'
              sx={{
                maxWidth: { xs: '100%', lg: 150 },
                backgroundColor: 'button.claim',
                color: '#FFFFFF',
                padding: 1.5,
                '&:hover': {
                  backgroundColor: formatColor(blue.blue14),
                },
              }}
              disabled={!(rewards && Number.parseFloat(rewards) > 0)}
            >
              <Typography variant='body1'>Claim Rewards</Typography>
            </Button>
          )}
        </Box>

        {/* Deposit and Withdraw button */}
        <Box
          sx={{
            display: { xs: 'none', lg: 'flex' },
            columnGap: 1.5,
            justifySelf: 'center',
          }}
        >
          {!userVault.vaultAddress && (
            <ToolTip
              content={<Typography variant='body3'>You must create a Vault in order to make a deposit</Typography>}
              text_variant='body2'
            >
              <Button
                onClick={() => handleDWClick(ModalType.DepositCollateral)}
                disabled={!userVault.vaultAddress}
                sx={{
                  borderRadius: 2,
                  border: '1.5px solid #A3A9BA',
                  width: { xs: 32, lg: 40 },
                  height: { xs: 32, lg: 40 },
                  minWidth: { xs: 20, lg: 40 },
                }}
              >
                <SVGBox width={16} height={16} svg_name={'lock'} />
              </Button>
            </ToolTip>
          )}

          {userVault.vaultAddress && (
            <>
              <Button
                onClick={() => handleDWClick(ModalType.DepositCollateral)}
                disabled={!userVault.vaultAddress}
                sx={{
                  borderRadius: 2,
                  border: '1.5px solid #A3A9BA',
                  width: { xs: 32, lg: 40 },
                  height: { xs: 32, lg: 40 },
                  minWidth: { xs: 20, lg: 40 },
                }}
              >
                <SVGBox width={16} height={16} svg_name={'plus'} />
              </Button>
              <Button
                onClick={() => handleDWClick(ModalType.WithdrawCollateral)}
                disabled={!userVault.vaultAddress}
                sx={{
                  borderRadius: 2,
                  border: '1.5px solid #A3A9BA',
                  width: { xs: 32, lg: 40 },
                  height: { xs: 32, lg: 40 },
                  minWidth: { xs: 20, lg: 40 },
                }}
              >
                <SVGBox width={16} height={16} svg_name={'minus'} />
              </Button>
            </>
          )}
        </Box>

        <Box display={{ xs: 'flex', lg: 'none' }} justifySelf='flex-end' width='fit-content'>
          <UserTokenMobileDropdown
            onClickDeposit={() => handleDWClick(ModalType.DepositCollateral)}
            onClickWithdraw={() => handleDWClick(ModalType.WithdrawCollateral)}
            onClickClaim={() => handleDWClick(ModalType.Claim)}
            isCurveLP={curve_lp}
            rewards={rewards}
          />
        </Box>
      </Box>
    </Box>
  );
};
