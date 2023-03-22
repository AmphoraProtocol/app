import { Box, Typography } from '@mui/material';
import { useLight } from '../../../hooks/useLight';
import { formatColor, neutral } from '../../../theme';
import { ThumbsUpIcon } from '../../icons/misc/ThumbsUpIcon';

export const Votes = ({ noVotes, yesVotes }: { noVotes: number; yesVotes: number }) => {
  const isLight = useLight();

  let upStrokeColor;
  let downStrokeColor;
  if (noVotes === 0 && yesVotes === 0) {
    upStrokeColor = formatColor(neutral.gray3);
    downStrokeColor = formatColor(neutral.gray3);
  } else if (yesVotes > noVotes) {
    upStrokeColor = formatColor(isLight ? neutral.black : neutral.white);
    downStrokeColor = formatColor(neutral.gray3);
  } else if (noVotes > yesVotes) {
    upStrokeColor = formatColor(neutral.gray3);
    downStrokeColor = formatColor(isLight ? neutral.black : neutral.white);
  } else {
    upStrokeColor = formatColor(neutral.gray3);
    downStrokeColor = formatColor(neutral.gray3);
  }

  return (
    <Box display='flex' flexWrap='nowrap' marginX={2}>
      <Box display='flex' alignItems='center' marginX={1}>
        <ThumbsUpIcon strokecolor={upStrokeColor} sx={{ width: 16, height: '100%', mr: 1 }} />
        <Typography color={upStrokeColor} variant='label_semi'>
          {yesVotes.toLocaleString()}
        </Typography>
      </Box>
      <Box display='flex' alignItems='center' marginX={1}>
        <ThumbsUpIcon
          strokecolor={downStrokeColor}
          sx={{ width: 16, height: '100%', mr: 1, transform: 'rotate(180deg)' }}
        />
        <Typography color={downStrokeColor} variant='label_semi'>
          {noVotes.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
};
