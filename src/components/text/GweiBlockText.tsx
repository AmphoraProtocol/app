import { Box, Typography } from '@mui/material';
import { useWeb3Context } from '../libs/web3-data-provider/Web3Provider';

export const GweiBlockText = () => {
  const { gasPrice, dataBlock } = useWeb3Context();

  return (
    <Box px={{ xs: 3, md: 10 }} mb={2} display='flex' columnGap={2} justifyContent='flex-end'>
      <Box>
        <Typography variant='label'>Gwei: </Typography>
        <Typography variant='label2_medium'>{gasPrice}</Typography>
      </Box>

      <Box>
        <Typography variant='label'>Block: </Typography>
        <Typography variant='label2_medium'>{dataBlock}</Typography>
      </Box>
    </Box>
  );
};
