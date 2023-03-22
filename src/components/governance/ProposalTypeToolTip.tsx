import { Typography, Box } from '@mui/material';
import { ProposalToolTip } from '../tooltip/ProposalTypeToolTip';

const TooltipValue = ({ text, mleft = true }: { text: string; mleft?: boolean }) => (
  <Box component='span' sx={{ ml: mleft ? 1 : 0, fontWeight: 400, color: 'text.secondary' }}>
    {text}
  </Box>
);

export const proposalTypeDiction = {
  emergency: (
    <ProposalToolTip
      content={
        <>
          <Typography variant='label' color='text.primary'>
            Emergency Voting
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Proposal Threshold: <TooltipValue text='1,000,000' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Quorum Threshold: <TooltipValue text='50,000,000' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Voting Period: <TooltipValue text='6570 blocks' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Timelock Period: <TooltipValue text='2 days ' />
          </Typography>
        </>
      }
      text='Emergency'
      text_variant='label_semi'
      type='emergency'
    />
  ),
  optimistic: (
    <ProposalToolTip
      content={
        <>
          <Typography variant='label' color='text.primary'>
            Optimistic Voting
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Proposal Threshold: <br />
            <TooltipValue mleft={false} text='Governance Whitelist' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Quorum Threshold:
            <TooltipValue text='2,000,000' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Review Period:
            <TooltipValue text='25600 blocks' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Voting Period: <TooltipValue text='40320 blocks' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Timelock Period: <TooltipValue text='2 days ' />
          </Typography>
        </>
      }
      text='Optimistic'
      text_variant='label_semi'
      type='optimistic'
    />
  ),
  standard: (
    <ProposalToolTip
      content={
        <>
          <Typography variant='label' color='text.primary'>
            Standard Voting
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Proposal Threshold:
            <TooltipValue text='1,000,000' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Quorum Threshold:
            <TooltipValue text='10,000,000' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Review Period:
            <TooltipValue text='13140 blocks' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Voting Period:
            <TooltipValue text='40320 blocks' />
          </Typography>{' '}
          <br />
          <Typography variant='body3' whiteSpace='nowrap'>
            Timelock Period:
            <TooltipValue text='2 days ' />
          </Typography>
        </>
      }
      text='Standard'
      text_variant='label_semi'
      type='standard'
    />
  ),
};

export const ProposalTypeToolTip = (type: 'emergency' | 'standard' | 'optimistic') =>
  proposalTypeDiction[type] as JSX.Element;
