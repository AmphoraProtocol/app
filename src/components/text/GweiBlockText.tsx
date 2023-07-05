import { Box, Typography } from '@mui/material';
import { useBlockNumber, useFeeData } from 'wagmi';
import { utils } from 'ethers';

export const GweiBlockText = () => {
  const { data } = useBlockNumber();
  const { data: feeData } = useFeeData();
  return (
    <Box px={{ xs: 3, md: 10 }} mb={2} display='flex' columnGap={2} justifyContent='flex-end'>
      <Box>
        <Typography variant='label'>Gwei: </Typography>
        <Typography variant='label2_medium'>
          {Number.parseFloat(utils.formatUnits(feeData?.formatted.gasPrice || '0', 9)).toFixed(2)}
        </Typography>
      </Box>

      <Box>
        <Typography variant='label'>Block: </Typography>
        <Typography variant='label2_medium'>{data}</Typography>
      </Box>
    </Box>
  );
};
