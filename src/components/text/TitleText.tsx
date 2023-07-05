import { Typography, Box, BoxProps, Skeleton } from '@mui/material';
import { formatColor, neutral } from '~/theme';
export interface TitleTextProps extends BoxProps {
  title: string;
  text: string | null;
}

export const TitleText = (props: TitleTextProps) => {
  const { title, text } = props;
  return (
    <Box {...props}>
      <Typography variant='label_semi' color={formatColor(neutral.gray3)} mb={1}>
        {title}
      </Typography>

      {text !== null ? (
        <Typography variant='subtitle1' color='text.primary'>
          {text}
        </Typography>
      ) : (
        <Skeleton variant='rectangular' height='28px' animation='wave' />
      )}
    </Box>
  );
};
