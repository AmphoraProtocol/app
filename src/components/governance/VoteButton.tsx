import { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { VoteModal } from './proposal/VoteModal';
import { useWeb3Context } from '../libs/web3-data-provider/Web3Provider';
import { useModalContext, ModalType } from '../libs/modal-content-provider/ModalContentProvider';
import { useAppGovernanceContext } from '../libs/app-governance-provider/AppGovernanceProvider';
import { ZERO_ADDRESS } from '~/constants';

interface VoteButtonProps {
  status: number;
  id: string;
  totalVotes: number;
  votingPower: number;
  isOptimistic: boolean;
  hasPriorVotes: boolean;
  hasVoted: boolean;
}

const VoteButton = (props: VoteButtonProps) => {
  const { id, totalVotes, votingPower, isOptimistic, hasPriorVotes, hasVoted } = props;

  const [open, setOpen] = useState(false);

  const { currentSigner } = useWeb3Context();
  const { setType } = useModalContext();
  const { delegatedTo } = useAppGovernanceContext();

  const handleVoteClick = () => {
    if (delegatedTo == ZERO_ADDRESS) {
      setType(ModalType.DelegateIPT);
    } else {
      setOpen(true);
    }
  };

  return (
    <Box>
      {' '}
      <Button
        sx={{ height: 43, width: '100%', backgroundColor: 'button.vote' }}
        variant='contained'
        onClick={handleVoteClick}
        disabled={(votingPower <= 0 && !(delegatedTo == ZERO_ADDRESS)) || hasVoted}
      >
        <Typography variant='body1' lineHeight={1}>
          Vote
        </Typography>
      </Button>
      <VoteModal
        isOptimistic={isOptimistic}
        open={open}
        setOpen={setOpen}
        id={id}
        totalVotes={totalVotes}
        votingPower={votingPower}
        signer={currentSigner!}
        hasPriorVotes={hasPriorVotes}
      />
    </Box>
  );
};

export default VoteButton;
