import { Typography } from '@mui/material';
import { blue, formatColor } from '~/theme';

export const Substat = ({ stat, suffix, days }: { stat: number | string; suffix: string; days: number }) => {
  return (
    <Typography
      ml={2}
      variant='label2_light'
      color={formatColor(blue.blue1)}
      sx={{ display: 'flex', alignItems: 'center' }}
    >
      {days}D: {stat || '-'}
      {suffix}
    </Typography>
  );
};
