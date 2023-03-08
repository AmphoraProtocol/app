import { Box, Typography } from '@mui/material';
import { useLight } from '../../../hooks/useLight';
import { ClockIcon } from '../../icons/misc/ClockIcon';

type statusColor = string;

const statuses: { [key: number]: string } = {
  0: 'Pending',
  1: 'Active',
  2: 'Cancelled',
  3: 'Defeated',
  4: 'Succeeded',
  5: 'Queued',
  6: 'Expired',
  7: 'Executed',
};

const StatusContainerColor = (status: number): statusColor => {
  const isLight = useLight();

  switch (status) {
    // Pending
    case 0:
      return '#3595FF';

    // Active
    case 1:
      return '#00BB29';

    // Canceled
    case 2:
      return isLight ? '#6B7687' : '#B0B4C2';

    // Defeated
    case 3:
      return '#E742A1';

    // Succeeded
    case 4:
      return '#00BB29';

    // Queued
    case 5:
      return isLight ? '#6B7687' : '#B0B4C2';

    // Expired
    case 6:
      return isLight ? '#6B7687' : '#B0B4C2';

    // Executed
    case 7:
      return '#00BB29';
    default:
      return isLight ? '#6B7687' : '#B0B4C2';
  }
};

const StatusContainer = ({ status, timeLeft }: { status: number; timeLeft: string }) => {
  const statusColor = StatusContainerColor(status);
  const statusText: string = statuses[status as number];

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: { xs: 'center', lg: 'space-between' },
        alignItems: 'center',
        py: 1,
        px: { xs: 1, lg: 2 },
        width: { xs: 87, md: 208 },
        border: `1px solid ${statusColor}`,
        color: statusColor,
        borderRadius: 20,
      }}
    >
      <Typography variant='body2' lineHeight={{ xs: 1 }} fontSize={{ xs: 12, lg: 16 }}>
        {statusText}
      </Typography>

      <Box display={{ xs: 'none', lg: 'flex', alignItems: 'center' }}>
        <ClockIcon
          strokecolor={statusColor}
          sx={{
            width: 12,
            height: 12,
            mr: 0.5,
            bottom: 1,
            position: 'relative',
            display: status === 0 || status === 1 || status === 5 ? 'block' : 'none',
          }}
        />
        <Typography variant='body2' lineHeight={1}>
          {timeLeft}
        </Typography>
      </Box>
    </Box>
  );
};

export const Status = ({ status, timeLeft }: { status: number; timeLeft: string }) => {
  return (
    <Box display='flex' alignItems='center'>
      <StatusContainer status={status} timeLeft={timeLeft} />
    </Box>
  );
};
