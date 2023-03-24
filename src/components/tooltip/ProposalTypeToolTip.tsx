import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { formatColor, neutral } from '~/theme';
import { ToolTipInfoIcon } from '../icons/misc/ToolTipInfoIcon';
import { IProposalType } from '../governance/ProposalCard';

const BaseToolTipContainer = styled(({ className, ...props }: TooltipProps) => {
  return <Tooltip arrow sx={{ cursor: 'pointer' }} {...props} classes={{ popper: className }} />;
})(({ theme }) => {
  const isLight = theme.palette.mode === 'light';
  return {
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: isLight ? formatColor(neutral.white) : '#374252',
      color: isLight ? '#374252' : formatColor(neutral.white),
      borderRadius: '20px',
      padding: '20px',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: isLight ? formatColor(neutral.white) : '#374252',
    },
  };
});

export const ProposalToolTip = (props: {
  content: TooltipProps['title'];
  text: string;
  text_variant?: 'body1' | 'body2' | 'body2_semi' | 'label_semi';
  type: IProposalType;
}) => {
  const { content, text, type } = props;

  const getStatusColor = (type: IProposalType) => {
    switch (type) {
      case 'standard':
        return '#00BB29';

      case 'optimistic':
        return '#3595FF';
      case 'emergency':
        return '#E742A1';
    }
  };

  return (
    <BaseToolTipContainer title={content}>
      <Box display='inline-flex' alignItems='center'>
        <Box
          sx={{
            height: 6,
            width: 6,
            backgroundColor: getStatusColor(type),
            borderRadius: '50%',
            display: 'inline-block',
            mr: 1,
          }}
        ></Box>
        <Typography variant='label_semi' color='text.secondary' whiteSpace='nowrap'>
          {text}
        </Typography>
      </Box>
    </BaseToolTipContainer>
  );
};
