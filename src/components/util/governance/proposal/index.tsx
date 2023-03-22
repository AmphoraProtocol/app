import { useEffect, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { formatColor, neutral } from '../../../../theme';
import { VoteCount, Voter } from './VoteCount';
import { useWeb3Context } from '../../../libs/web3-data-provider/Web3Provider';
import { BNtoDec } from '../../../../utils/bn';
import { getProposalVoters } from '../../../../contracts/GovernorCharlieDelegate/getProposalVoters';
import { IProposalType } from '../ProposalCard';
import { Proposal } from '../../api/getProposals';

export interface ProposalDetailsProps {
  id: string;
  proposalType?: IProposalType;
  votes: Proposal['votes'];
}

const totalVotesDependentOnType = (proposalType: IProposalType) => {
  switch (proposalType) {
    case 'optimistic':
      return { for: 0, against: 2500000 };
    case 'emergency':
      return { for: 10000000, against: 10000000 };
    case 'standard':
      return { for: 10000000, against: 10000000 };
  }
};

const ProposalDetails: React.FC<ProposalDetailsProps> = ({
  proposalType = 'standard',
  votes,
}: ProposalDetailsProps) => {
  const theme = useTheme();

  const [votersFor, setVotersFor] = useState<Array<Voter>>([]);
  const [votersBad, setVotersBad] = useState<Array<Voter>>([]);

  const votesTotal = totalVotesDependentOnType(proposalType);

  useEffect(() => {
    setVotersFor(votes.for);
    setVotersBad(votes.against);
  }, [votes]);

  return (
    <Box
      color={formatColor(neutral.black)}
      textAlign='left'
      maxWidth='xl'
      margin='auto'
      position='relative'
      sx={{
        [theme.breakpoints.down('md')]: {
          mb: 0,
          marginLeft: 'auto',
        },
      }}
    >
      <Box display='flex' columnGap={2} mt={3} flexDirection={{ xs: 'column', md: 'row' }}>
        <VoteCount
          forOrAgainst='For'
          votes={proposalType !== 'optimistic' ? votersFor.reduce((a, b) => (a += b.votingPower), 0) : 0}
          voters={votersFor}
          totalVotes={votesTotal.for}
        />
        <VoteCount
          forOrAgainst='Against'
          votes={votersBad.reduce((a, b) => (a += b.votingPower), 0)}
          voters={votersBad}
          totalVotes={votesTotal.against}
        />
      </Box>
    </Box>
  );
};

export default ProposalDetails;
