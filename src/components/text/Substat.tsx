import { Typography } from '@mui/material';
import { blue, formatColor, green, pink } from '~/theme';
import { ArrowDownIcon } from '../icons/misc/ArrowDownIcon';
import { ArrowUpIcon } from '../icons/misc/ArrowUpIcon';

export const Substat = ({ stat, suffix, days }: { stat: number | string; suffix: string; days: number }) => {
  const getArrow = (stat: number) => {
    return stat > 0 ? (
      <ArrowUpIcon strokecolor={formatColor(green.green2)} sx={{ width: 10, height: 14, mx: 0.5 }} />
    ) : (
      <ArrowDownIcon sx={{ width: 10, height: 14, mx: 0.5 }} strokecolor={formatColor(pink.pink1)} />
    );
  };

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
