import { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { addressShortener } from '../../text';
import { formatColor, neutral } from '~/theme';
import { useLight } from '~/hooks/useLight';
import { BaseModal } from '../../modal';

export interface Voter {
  address: string;
  votingPower: number;
  direction: number;
}

interface VoteCountProps {
  votes: number;
  totalVotes: number;
  voters: Array<Voter>;
  forOrAgainst: string;
}

export const VoteCount = (props: VoteCountProps) => {
  const { votes, totalVotes, voters, forOrAgainst } = props;
  const isLight = useLight();

  const barColor = forOrAgainst == 'For' ? 'success' : 'error';
  const [seeAllOpen, setSeeAllOpen] = useState(false);

  const [votePercent, setVotePercent] = useState(0);

  useEffect(() => {
    const votePercent = (votes / totalVotes) * 100 > 100 ? 100 : (votes / totalVotes) * 100;

    setVotePercent(votePercent);
  }, [votes]);

  const seeAllHandler = () => {
    setSeeAllOpen(true);
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'accordionCard.background',
          borderColor: 'accordionCard.border',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 2,
          p: { xs: 2 },
        }}
      >
        <Box display='flex' justifyContent='space-between'>
          <Typography color='text.primary' variant='body1' mb={1}>
            {forOrAgainst}
          </Typography>

          <Typography textAlign='right' variant='body1' color='text.primary'>
            {votes.toLocaleString()} / {totalVotes.toLocaleString()}
          </Typography>
        </Box>

        <LinearProgress
          color={barColor as any}
          variant='determinate'
          value={votePercent}
          sx={{
            marginTop: 1,
            backgroundColor: isLight ? formatColor(neutral.gray6) : formatColor(neutral.white),
          }}
        />
      </Box>

      <Box
        sx={{
          width: '100%',
          backgroundColor: 'accordionCard.background',
          borderColor: 'accordionCard.border',
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 2,
          p: { xs: 2, md: 3 },
          paddingBottom: { xs: 0, md: 0 },
          my: 2,
          height: 'fill-available',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {voters.map((voter, index) => (
          <Box key={index} display='flex' justifyContent='space-between' mb={2}>
            <Typography variant='body3_medium' color='text.secondary'>
              {addressShortener(voter.address)}
            </Typography>
            <Typography variant='body3_medium' color='text.secondary'>
              {voter.votingPower.toLocaleString()}
            </Typography>
          </Box>
        ))}

        <Button variant='text' onClick={seeAllHandler} sx={{ marginTop: 'auto' }}>
          <Typography variant='label'>See All</Typography>
        </Button>
      </Box>
      <BaseModal setOpen={setSeeAllOpen} open={seeAllOpen}>
        <Box pt={5}>
          {voters.map((voter, index) => (
            <Box key={index} display='flex' justifyContent='space-between' mb={3}>
              <Typography variant='body3' color='text.secondary'>
                {addressShortener(voter.address)}
              </Typography>
              <Typography variant='body3' color='text.secondary'>
                {voter.votingPower.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Box>
      </BaseModal>
    </Box>
  );
};
