import { Box, Typography, Button, InputAdornment, Skeleton, Divider } from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { AppLayout } from '../../components/partials/app-layout';
import { useLight } from '../../hooks/useLight';
import { DecimalInput } from '../../components/util/textFields';
import { DisableableModalButton } from '../../components/util/button/DisableableModalButton';
import { ModalInputContainer } from '../../components/util/modal/ModalContent/ModalInputContainer';
import Cookies from 'universal-cookie';
import { PDFModal } from '../../components/util/pdfViewer/PDFModal';
import { useRolodexContext } from '../../components/libs/rolodex-data-provider/RolodexDataProvider';
import {
  getCurrentPrice,
  getAmountIPTForSale,
  commitUSDC,
  getEndTime,
  getBasePrice,
} from '../../contracts/IPTSale/slowRollMethods';
import { useWeb3Context } from '../../components/libs/web3-data-provider/Web3Provider';
import { useModalContext } from '../../components/libs/modal-content-provider/ModalContentProvider';
import { JsonRpcSigner, TransactionReceipt } from '@ethersproject/providers';
import { BN } from '../../easy/bn';
import { locale } from '../../locale';
import { BNtoHexNumber } from '../../components/util/helpers/BNtoHex';
import { ClockIcon } from '../../components/icons/misc/ClockIcon';
import { SwapIcon } from '../../components/icons/misc/SwapIcon';
import getSaleSummary, { SaleSummary } from '../../components/util/api/getSaleSummary';
import { SLOWROLL_ADDRESS } from '../../constants';
import SVGBox from '../../components/icons/misc/SVGBox';
import { hasUSDCAllowance } from '../../contracts/misc/hasAllowance';

const PurchasePage: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);
  const [saleSummary, setSaleSummary] = useState<SaleSummary>();
  const cookie = new Cookies();
  const { dataBlock } = useWeb3Context();

  const [open, setOpen] = useState(cookie.get('IP_ACCEPT_TERMS') != 'YES');
  const handleAgree = () => {
    cookie.set('IP_ACCEPT_TERMS', 'YES');
    setOpen(false);
  };

  const isLight = useLight();

  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.documentElement.scrollTop);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  useEffect(() => {
    getSaleSummary().then(setSaleSummary);
  }, [dataBlock]);

  const SaleSummaryStat = ({ stat, statValue }: { stat: string; statValue: string | undefined }) => (
    <Box display='flex' flexDirection={{ xs: 'column', lg: 'row' }}>
      <Typography variant='label_semi' color='text.secondary' mr={1}>
        {stat}:
      </Typography>
      {statValue ? (
        <Typography variant='label_semi'>{statValue}</Typography>
      ) : (
        <Skeleton
          variant='rectangular'
          width={70}
          height='14px'
          animation='wave'
          sx={{
            position: 'relative',
            display: 'inline-block',
          }}
        />
      )}
    </Box>
  );

  return (
    <AppLayout>
      <Box
        sx={{
          pt: 5,
          pb: 15,
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Box display='flex' columnGap={2} rowGap={1} alignItems='center' mb={{ xs: 2, lg: 4 }}>
          <SaleSummaryStat
            stat='Total IPT Sold'
            statValue={saleSummary?.IPTSold.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          />
          <Divider
            orientation='vertical'
            variant='middle'
            sx={{
              borderColor: 'text.secondary',
              margin: 'auto',
              position: 'relative',
              height: 16,
            }}
            flexItem
          />

          <SaleSummaryStat
            stat='USDC Raised'
            statValue={saleSummary?.USDCRaised.toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })}
          />
          <Divider
            orientation='vertical'
            variant='middle'
            sx={{
              borderColor: 'text.secondary',
              margin: 'auto',
              position: 'relative',
              height: 16,
            }}
            flexItem
          />

          <SaleSummaryStat
            stat='Avg. Price'
            statValue={saleSummary?.AveragePrice.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          />
        </Box>
        <Box
          sx={{
            marginX: 'auto',
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            py: { xs: 4 },
            maxWidth: 800,
            paddingX: { xs: 2, sm: 4 },
            backgroundColor: isLight ? '#fcfdff' : '#1C1D21',
            borderRadius: 2.5,
          }}
        >
          <PDFModal
            isOpen={open}
            setIsOpen={setOpen}
            pdf_src='ip_terms.pdf'
            must_agree={true}
            must_agree_handler={handleAgree}
          />
          <PurchaseBox setOpenTerms={setOpen} />
        </Box>
      </Box>
    </AppLayout>
  );
};

const formatSecondsTill = (n: number) => {
  if (n < 600) {
    return Math.floor(n) + ' second(s)';
  }
  if (n < 60 * 60 * 4) {
    return Math.floor(n / 60) + ' minute(s)';
  }

  return Math.round(n / (60 * 60)) + ' hour(s)';
};

const PurchaseBox = ({ setOpenTerms }: { setOpenTerms: (val: boolean) => void }) => {
  const isLight = useLight();
  const [amountToCommit, setAmountToCommit] = useState('');
  const [isIPTValue, setIsIPTValue] = useState(false);
  const [focus, setFocus] = useState(false);
  const toggle = () => setFocus(!focus);
  const rolodex = useRolodexContext();
  const { currentSigner, currentAccount, dataBlock, chainId, connected, signerOrProvider } = useWeb3Context();
  const { updateTransactionState } = useModalContext();
  const [iptForSale, setIptForSale] = useState<number | undefined>();
  const [iptSold, setIptSold] = useState<string | undefined>();

  const [basePrice, setBasePrice] = useState(0.25);
  const [salePrice, setSalePrice] = useState<number | undefined>();
  const [saleSummary, setSaleSummary] = useState<SaleSummary>();
  const [loading, setLoading] = useState(false);
  const [loadmsg, setLoadmsg] = useState('');

  const [hasAllowance, setHasAllowance] = useState(false);

  const [salePeriodRemaining, setSalePeriodRemaining] = useState<string | undefined>();
  const [secondaryValue, setSecondaryValue] = useState<string>('');
  const [secondaryValueUnit, setSecondaryValueUnit] = useState<string>('USDC');

  useEffect(() => {
    if (amountToCommit === '') {
      setSecondaryValue('');
    } else if (isIPTValue) {
      setSecondaryValue((Number(amountToCommit) * salePrice!).toString());
    } else {
      setSecondaryValue((Number(amountToCommit) / salePrice!).toString());
    }
  }, [amountToCommit]);

  useEffect(() => {
    const val = Number(secondaryValue);

    let secVal;

    if (isNaN(val)) {
      secVal = '';
    } else {
      secVal = secondaryValue;
    }

    setAmountToCommit(secVal);

    isIPTValue ? setSecondaryValueUnit('USDC') : setSecondaryValueUnit('IPT');
  }, [isIPTValue]);

  useEffect(() => {
    getEndTime(signerOrProvider as JsonRpcSigner).then((x) => {
      const remaining = x.toNumber() - new Date().valueOf() / 1000;
      let isNewDay = false;
      let srt = '';
      if (remaining <= 0) {
        isNewDay = true;
        srt = formatSecondsTill(22 * 60 * 60);
      } else {
        srt = formatSecondsTill(remaining);
      }
      setSalePeriodRemaining(srt);
      if (isNewDay) {
        setSalePrice(basePrice);
        setIptSold('0');
        setIptForSale(1000000);
        return;
      }
      getBasePrice(signerOrProvider as JsonRpcSigner).then((res) => {
        setBasePrice(res);
      });
      getAmountIPTForSale(signerOrProvider!).then((res) => {
        const sold = BNtoHexNumber(res.soldQuantity.div(1e14).div(1e4));
        setIptSold(sold.toLocaleString());
        const max = BNtoHexNumber(res.maxQuantity.div(1e14).div(1e4));
        setIptForSale(max - sold);
      });
      getCurrentPrice(signerOrProvider as JsonRpcSigner).then((res) => {
        setSalePrice(res.toNumber() / 1e6);
      });
    });
  }, [chainId, rolodex, loadmsg]);

  useEffect(() => {
    if (rolodex && amountToCommit) {
      const usdcAmount = isIPTValue ? secondaryValue : amountToCommit;

      hasUSDCAllowance(currentAccount, SLOWROLL_ADDRESS, usdcAmount, rolodex).then(setHasAllowance);
    }
  }, [rolodex, dataBlock, chainId, amountToCommit]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (hasAllowance) {
      usdcCommitHandler();
    } else {
      handleApprovalRequest();
    }
  };

  const handleApprovalRequest = async () => {
    if (rolodex && amountToCommit) {
      const usdcAmount = isIPTValue ? secondaryValue : amountToCommit;

      const formattedCommitAmount = BN(usdcAmount).mul(1e6);
      setLoading(true);
      try {
        setLoadmsg(locale('CheckWallet'));
        const approve = await rolodex.USDC?.connect(currentSigner!).approve(SLOWROLL_ADDRESS, formattedCommitAmount);

        setLoadmsg(locale('TransactionPending'));
        await approve?.wait();

        hasUSDCAllowance(currentAccount, SLOWROLL_ADDRESS, usdcAmount, rolodex).then(setHasAllowance);
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
  };

  const usdcCommitHandler = async () => {
    if (rolodex !== null && Number(amountToCommit) > 0) {
      const usdcAmount = isIPTValue ? secondaryValue : amountToCommit;

      const formattedCommitAmount = BN(usdcAmount).mul(1e6);
      setLoading(true);

      try {
        setLoadmsg(locale('CheckWallet'));

        const commitTransaction = await commitUSDC(formattedCommitAmount, currentSigner!);

        updateTransactionState(commitTransaction);
        setLoadmsg(locale('TransactionPending'));

        const commitReceipt = await commitTransaction.wait();

        updateTransactionState(commitReceipt);
      } catch (err) {
        const error = err as TransactionReceipt;
        updateTransactionState(error);
      }
      setLoading(false);
      setLoadmsg('');
    }
  };

  return (
    <Box>
      <Box>
        <Box display='flex' justifyContent='space-between' rowGap={2} flexDirection={{ xs: 'column', lg: 'row' }}>
          <Box display='flex' alignItems='center'>
            <SVGBox svg_name={`ipt_${isLight ? 'blue' : 'white'}`} width={32} height={32} sx={{ mr: 2 }} />

            <Typography variant='subtitle1'>IPT Sale</Typography>
          </Box>

          <Box display='flex' alignItems='center'>
            <ClockIcon sx={{ width: 14, height: 14, mr: 1, mb: 0.5 }} strokecolor={isLight ? '#25262C' : '#FFF'} />
            <Typography variant='body3' color='primary.dark'>
              Sale Renews in{' '}
              {salePeriodRemaining ? (
                salePeriodRemaining
              ) : (
                <Skeleton
                  variant='rectangular'
                  height='16px'
                  width='80px'
                  animation='wave'
                  sx={{
                    display: 'inline-block',
                  }}
                />
              )}
            </Typography>
          </Box>
        </Box>

        <Box display='flex' justifyContent='space-between' mt={{ xs: 2, lg: 3 }}>
          <Box
            display=''
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent='space-between'
            columnGap={4}
            rowGap={2}
          >
            <Box display='flex' mb={2} flexDirection={{ xs: 'column', lg: 'row' }}>
              <Typography variant='body3' fontWeight={400} color='#A3A9BA' mr={1}>
                Remaining IPT for cycle:{' '}
              </Typography>
              <Typography variant='body3' fontWeight={400} color='primary.dark'>
                {' '}
                {iptForSale ? (
                  iptForSale.toLocaleString()
                ) : (
                  <Skeleton
                    variant='rectangular'
                    height='16px'
                    width='50px'
                    animation='wave'
                    sx={{
                      display: 'inline-block',
                    }}
                  />
                )}
              </Typography>
            </Box>

            <Box display='flex' flexDirection={{ xs: 'column', lg: 'row' }}>
              <Typography variant='body3' fontWeight={400} color='#A3A9BA' mr={1}>
                Sale Price:
              </Typography>
              <Typography variant='body3' fontWeight={400} color='primary.dark'>
                {salePrice ? (
                  `${salePrice}`
                ) : (
                  <Skeleton
                    variant='rectangular'
                    height='16px'
                    width='50px'
                    animation='wave'
                    sx={{
                      display: 'inline-block',
                    }}
                  />
                )}
              </Typography>
            </Box>
          </Box>
          <Box display='flex' flexDirection={{ xs: 'column', lg: 'row' }}>
            <Typography variant='body3' fontWeight={400} color='#A3A9BA' mr={1}>
              IPT sold:{' '}
            </Typography>
            <Typography variant='body3' fontWeight={400} color='primary.dark'>
              {' '}
              {iptSold ? (
                iptSold
              ) : (
                <Skeleton
                  variant='rectangular'
                  height='16px'
                  width='50px'
                  animation='wave'
                  sx={{
                    display: 'inline-block',
                  }}
                />
              )}
            </Typography>
          </Box>
        </Box>
        <Box component='form' onSubmit={handleSubmit} mt={4}>
          <ModalInputContainer focus={focus}>
            <Box position='relative'>
              <Button
                sx={{
                  minWidth: 'auto',
                  borderRadius: '50%',

                  width: 30,
                  height: 30,
                  paddingY: 0,
                  paddingX: 2,
                  top: -3,
                  mr: 1,
                }}
                onClick={() => setIsIPTValue(!isIPTValue)}
              >
                <SwapIcon sx={{ width: 30, height: 30 }} />
              </Button>
            </Box>
            <DecimalInput
              onFocus={toggle}
              onBlur={toggle}
              value={amountToCommit}
              onChange={setAmountToCommit}
              startAdornment={
                <InputAdornment position='start'>
                  <Typography variant='label'>{isIPTValue ? 'IPT' : 'USDC'}</Typography>
                </InputAdornment>
              }
            />

            <Typography whiteSpace='nowrap' variant='label'>
              {secondaryValue} {secondaryValueUnit}
            </Typography>
          </ModalInputContainer>
          <Box height={8} />
          <DisableableModalButton
            disabled={Number(amountToCommit) <= 0 || !connected}
            type='submit'
            text={hasAllowance ? 'Commit' : 'Set Allowance'}
            loading={loading}
            load_text={loadmsg}
            onClick={handleSubmit}
          />
        </Box>

        <Box mt={4} display='flex' justifyContent='space-between' flexDirection={{ xs: 'column', md: 'row' }}>
          <Button
            href='./book/docs/IPTsale/index.html'
            target='_blank'
            sx={{ width: 'fit-content', left: { xs: 0, lg: -8 } }}
          >
            Token Sale Rules{' '}
            <Box
              component='img'
              src='images/up_arrow_blue.png'
              width={10}
              height={12}
              marginX={1}
              sx={{
                transform: 'rotate(90deg)',
              }}
            />
          </Button>

          <Button
            target='_blank'
            href='https://etherscan.io/address/0xFbD3060Fe1Ed10c34E236Cee837d82F019cF1D1d'
            sx={{ width: 'fit-content', right: { xs: 0, lg: -8 } }}
          >
            View Sales Contract{' '}
            <Box
              component='img'
              src='images/up_arrow_blue.png'
              width={10}
              height={12}
              marginX={1}
              sx={{
                transform: 'rotate(90deg)',
              }}
            />
          </Button>
        </Box>

        <Box mt={3}>
          <Typography
            variant='body3'
            sx={{
              mb: 1,
              position: 'relative',
              display: 'block',
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            The new mechanism offers one million (1%) tokens per period at a starting price of ${basePrice.toFixed(2)}{' '}
            and a maximum price of ${(basePrice * 2).toFixed(2)}. The sale has a minimum duration of 35 periods, a total
            of 32 days, to sell 35 million tokens (35% of the total supply) but will continue until the allocated supply
            is exhausted.
          </Typography>
          <br />
          <Typography
            variant='body3'
            sx={{
              mb: 1,
              position: 'relative',
              display: 'block',
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            Each period, the sale parameters will reset to the base price ($
            {basePrice.toFixed(2)}) and tokens offered (1m). The purchaser gets the same price regardless of the number
            of tokens purchased, but the price updates after each sale based on the number of total tokens purchased.
          </Typography>
          <br />
          <Typography
            variant='body3'
            sx={{
              mb: 2,
              position: 'relative',
              display: 'block',
              lineHeight: 1.25,
              fontWeight: 400,
            }}
          >
            Rather than doing a traditional 24 hours per period, we've chosen 22 hours. By selecting 22 hours, the start
            time will progressively change by two hours to make the sale more accessible across all time zones.
          </Typography>
        </Box>

        <Button onClick={() => setOpenTerms(true)}>View User Agreement</Button>
      </Box>
    </Box>
  );
};

export default PurchasePage;
