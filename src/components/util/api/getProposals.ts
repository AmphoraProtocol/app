import { BN } from '~/utils/bn';
import { Voter } from '../governance/proposal/VoteCount';
import getProposalDetails, { ProposalDetails } from '../helpers/getProposalDescription';
import getProposalCreatedEvents from './getProposalCreatedEvents';
import getProposalVoteCastEvents from './getProposalVoteCastEvents';

export interface Proposal {
  body: string;
  id: string;
  proposer: string;
  endBlock: number;
  startBlock: number;
  transactionHash: string;
  details: ProposalDetails[];
  votes: {
    for: Voter[];
    against: Voter[];
  };
}

const getProposals = async () => {
  const proposals = new Map<number, Proposal>();

  try {
    const voteEvents = await getProposalVoteCastEvents();

    const createdEvents = await getProposalCreatedEvents();
    const votes: { [id: number]: { for: Voter[]; against: Voter[] } } = voteEvents.reduce((acc, voteEvent) => {
      const { ProposalId, Support, Voter, Votes } = voteEvent;
      const voter: Voter = {
        address: Voter,
        votingPower: BN(Votes).div(BN('1e16')).toNumber() / 100,
        direction: Support,
      };

      if (acc[ProposalId]) {
        if (Support === 1) {
          acc[ProposalId].for.push(voter);
        } else {
          acc[ProposalId].against.push(voter);
        }
      } else {
        acc[ProposalId] = {
          for: Support === 1 ? [voter] : [],
          against: Support === 0 ? [voter] : [],
        };
      }

      return acc;
    }, {} as { [id: number]: { for: Proposal['votes']['for']; against: Proposal['votes']['against'] } });

    createdEvents.forEach((val) => {
      proposals.set(val.ProposalId, {
        id: val.ProposalId.toString(),
        proposer: val.Proposer,
        body: val.Description,
        endBlock: val.EndBlock,
        startBlock: val.StartBlock,
        transactionHash: val.Transaction,
        details: getProposalDetails({
          targets: val.Targets,
          signatures: val.Signatures,
          calldatas: val.Calldatas,
        }),
        votes: votes[val.ProposalId] ? { ...votes[val.ProposalId] } : { for: [], against: [] },
      });
    });

    return proposals;
  } catch (err) {
    return proposals;
  }
};

export default getProposals;
