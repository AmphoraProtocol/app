import { GOV_PROPOSAL_CREATED_EVENTS, ANALYTICS_URL } from '~/constants';
import axios from 'axios';

export interface ProposalCreatedEvent {
  Block: number;
  Calldatas: string[];
  Description: string;
  EndBlock: number;
  ProposalId: number;
  Proposer: string;
  Signatures: string[];
  StartBlock: number;
  Targets: string[];
  Transaction: string;
  TransactionIndex: number;
  Values: number[];
}

const getProposalCreatedEvents = async () => {
  try {
    const proposalsUrl = `${ANALYTICS_URL}${GOV_PROPOSAL_CREATED_EVENTS}`;

    const response = await axios.get(proposalsUrl);
    return response.data as ProposalCreatedEvent[];
  } catch (err) {
    const error = err as Error;
    throw new Error(error.message);
  }
};

export default getProposalCreatedEvents;
