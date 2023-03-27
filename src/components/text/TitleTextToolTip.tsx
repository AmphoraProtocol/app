import { Typography, Box, BoxProps, Skeleton } from '@mui/material';
import { ReactElement } from 'react';
import { formatColor, neutral } from '~/theme';
import { ToolTip } from '../tooltip/ToolTip';
export interface TitleTextProps extends BoxProps {
  title: string;
  text: string | null;
  tooltipcontent: string;
  substat?: ReactElement;
}

export const TitleTextToolTip = (props: TitleTextProps) => {
  const { title, text, tooltipcontent, substat } = props;

  return (
    <Box {...props}>
      <Box mb={0.5}>
        <ToolTip
          content={<Typography variant='body3'>{tooltipcontent}</Typography>}
          text={title}
          text_variant='label_semi'
        />
      </Box>
      {text !== null ? (
        <Box display='flex' alignItems='flex-end'>
          <>
            <Typography variant='subtitle1' color='text.primary'>
              {text}
            </Typography>
            {substat && substat}
          </>
        </Box>
      ) : (
        <Skeleton variant='rectangular' height='28px' animation='wave' />
      )}
    </Box>
  );
};
