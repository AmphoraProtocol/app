import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { formatColor, neutral } from '~/theme';
import { ToolTipInfoIcon } from '../icons/misc/ToolTipInfoIcon';

const BaseToolTipContainer = styled(({ className, ...props }: TooltipProps) => {
  return <Tooltip arrow sx={{ cursor: 'pointer' }} {...props} classes={{ popper: className }} />;
})(({ theme }) => {
  const isLight = theme.palette.mode === 'light';
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: isLight ? formatColor(neutral.white) : formatColor(neutral.black5),
      color: isLight ? formatColor(neutral.black5) : formatColor(neutral.white),
      borderRadius: '20px',
      border: '1px solid',
      borderColor: isLight ? formatColor(neutral.gray3) : '#1a1a1e',
      padding: '24px',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: isLight ? formatColor(neutral.white) : formatColor(neutral.black5),
    },
  };
});

export const ToolTip = (props: {
  content: TooltipProps['title'];
  text?: string;
  text_variant?: 'body1' | 'body2' | 'body2_semi' | 'label_semi';
  icon?: boolean;
  children?: any;
}) => {
  const { content, text, text_variant = 'body1', icon = false, children } = props;

  return (
    <>
      <BaseToolTipContainer title={content}>
        <Box display='flex' alignItems='center'>
          {!children && (
            <Typography variant={text_variant} color='text.secondary' whiteSpace='nowrap'>
              {text}
            </Typography>
          )}
          {children}
          {icon && <ToolTipInfoIcon sx={{ width: 14, ml: 0.5 }} strokecolor={formatColor(neutral.gray3)} />}
        </Box>
      </BaseToolTipContainer>
    </>
  );
};
