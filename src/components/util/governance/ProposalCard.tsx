import { Box, Divider, Link, Skeleton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Votes } from './Votes';
import { Status } from './Status';
import { Spinner } from '../loading';

import ReactMarkdown from 'react-markdown';
import { NormalComponents } from 'react-markdown/lib/complex-types';
import { SpecialComponents } from 'react-markdown/lib/ast-to-react';
import remarkGfm from 'remark-gfm';
import { useWeb3Context } from '../../libs/web3-data-provider/Web3Provider';
import ProposalDetails from './proposal';
import { useFormatBNWithDecimals } from '../../../hooks/useFormatBNWithDecimals';
import VoteButton from './VoteButton';
import { getProposalInfo, ProposalInfo, getProposalState } from '../../../contracts/GovernorCharlieDelegate';
import { useLight } from '../../../hooks/useLight';
import { useParams } from 'react-router';
import { useRef } from 'react';
import { COMMON_CONTRACT_NAMES } from '../../../constants';
import { formatEther, formatUnits, getAddress } from 'ethers/lib/utils';
import { getProposalIsOptimistic } from '../../../contracts/GovernorCharlieDelegate/getProposerWhiteListed';
import { proposalTimeRemaining } from './proposalTimeRemaining';
import { CaratUpIcon } from '../../icons/misc/CaratUpIcon';
import { ProposalTypeToolTip } from './ProposalTypeToolTip';
import { getPriorVotes } from '../../../contracts/IPTDelegate/getPriorVotes';
import { getReceiptOf } from '../../../contracts/GovernorCharlieDelegate/getReceiptOf';
import SVGBox from '../../icons/misc/SVGBox';
import { Proposal } from '../api/getProposals';

export interface ProposalCardProps {
  proposal: Proposal;
  votingPower: number;
}

export type IProposalType = 'standard' | 'optimistic' | 'emergency';

// returns the checksummed address if the address is valid, otherwise returns false
const isAddress = (value: any): string | false => {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
};

export const ProposalCard = (props: ProposalCardProps) => {
  const { dataBlock, provider, currentAccount, signerOrProvider } = useWeb3Context();
  const { votingPower } = props;
  const { id, body, endBlock, transactionHash, details, startBlock, votes } = props.proposal;
  const isLight = useLight();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedContent, setExpandedContent] = useState<string | undefined>(undefined);
  const param = useParams();
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const getTitle = (body: string) => {
    const splitBody = body.split('\n');
    let title = splitBody.find((n) => n[0] === '#');
    if (title !== undefined) {
      title = title.substring(1);
    } else {
      title = splitBody[0].replace(/[#]/g, '');
    }

    return title;
  };

  function containsWhitespace(str: string) {
    return /\s/.test(str);
  }

  const linkIfAddress = (content: string) => {
    if (isAddress(content.trim())) {
      const commonName = COMMON_CONTRACT_NAMES[content.trim()] ?? content;
      return (
        <Link href={`https://etherscan.io/address/${content.trim()}`} target='_blank'>
          {containsWhitespace(content) ? ' ' : ''}
          {commonName}
        </Link>
      );
    }
    return <span>{content}</span>;
  };

  const [proposal, setProposal] = useState<ProposalInfo>();
  const [status, setStatus] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [forVotes, setForVotes] = useState(0);
  const [againstVotes, setAgainstVotes] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [proposalType, setProposalType] = useState<IProposalType | undefined>();
  const [hasPriorVotes, setHasPriorVotes] = useState(false);

  useEffect(() => {
    getProposalInfo(id, signerOrProvider!).then((res) => {
      getProposalIsOptimistic(res.proposer, signerOrProvider!).then((isWhitelisted) => {
        const pType = isWhitelisted ? 'optimistic' : res.emergency ? 'emergency' : 'standard';
        setProposalType(pType);
      });

      setProposal(res);
    });

    getProposalState(id, signerOrProvider!).then((res) => {
      setStatus(res);
    });
  }, [id]);

  useEffect(() => {
    if (votes.for.length || votes.against.length) {
      const forVotes = proposalType !== 'optimistic' ? votes.for.reduce((a, b) => a + b.votingPower, 0) : 0;

      const againstVotes = votes.against.reduce((a, b) => a + b.votingPower, 0);

      const totalVotes = forVotes + againstVotes;
      setAgainstVotes(againstVotes);
      setForVotes(forVotes);
      setTotalVotes(totalVotes);
    }
  }, [votes, proposal]);

  useEffect(() => {
    const bdiff = endBlock - dataBlock;
    const secs = bdiff * 13.5;
    setIsActive(secs > 0);

    if (bdiff < 0) {
      provider?.getBlock(endBlock).then((res) => {
        const endDate = new Date(res.timestamp * 1000);
        setTimeLeft(endDate.toLocaleDateString());
      });
      return;
    }
    if (proposalType && provider) {
      proposalTimeRemaining(startBlock, endBlock, dataBlock, status, provider).then((res) => setTimeLeft(res));
    }

    if (status === 1 && provider) {
      getPriorVotes(currentAccount, startBlock, provider).then((res) => {
        if (!res.isZero()) {
          setHasPriorVotes(true);
        } else {
          setHasPriorVotes(false);
        }
      });

      getReceiptOf(id, currentAccount, signerOrProvider).then((receipt) => {
        setHasVoted(receipt.hasVoted);
      });
    }
  }, [dataBlock, proposalType]);

  useEffect(() => {
    if (param.id === id) {
      setExpandedContent(body);
      setIsExpanded(true);

      setTimeout(() => {
        if (ref && ref.current) {
          ref.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      return;
    }
    setIsExpanded(false);
  }, [param.id]);

  const expandCard = () => {
    setIsExpanded(!isExpanded);
    setExpandedContent(body);
  };

  return (
    <Box
      sx={{
        backgroundColor: 'accordion.background',
        borderRadius: 2,
        paddingX: { xs: 2, md: 3 },
        paddingY: { xs: 2, md: 3 },
        cursor: 'pointer',
        borderColor: 'accordion.border',
        borderWidth: 1,
        borderStyle: 'solid',
      }}
      ref={ref}
    >
      <Box onClick={expandCard} display='flex' justifyContent='space-between'>
        <Box display='flex' alignItems='start'>
          <Typography variant='h8' color='text.primary' mr={{ xs: 1, md: 3 }}>
            {id}
          </Typography>
          <Box position='relative'>
            <Box>
              <Typography variant='h8' mr={2}>
                {getTitle(body)}
              </Typography>
            </Box>

            <Box display='flex' alignItems='center' columnGap={{ xs: 1, md: 1.5 }}>
              {proposalType ? (
                ProposalTypeToolTip(proposalType)
              ) : (
                <Skeleton
                  variant='rectangular'
                  width={70}
                  height='14px'
                  animation='wave'
                  sx={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                />
              )}

              <Divider
                orientation='vertical'
                variant='middle'
                sx={{
                  borderColor: 'text.secondary',
                  display: isMobile ? 'none' : 'block',
                  height: 10,
                }}
                flexItem
              />
              <Link
                href={`https://etherscan.io/tx/${transactionHash}`}
                target='_blank'
                onClick={(e) => e.stopPropagation()}
                sx={{
                  borderColor: 'text.secondary',
                  display: isMobile ? 'none' : 'flex',
                  alignItems: 'center',
                }}
              >
                <SVGBox
                  svg_name={isLight ? 'etherscan-logo-dark' : 'etherscan-logo-light'}
                  width={12}
                  height={12}
                  sx={{ mr: 1 }}
                />
                <Typography color='text.secondary' variant='label_semi'>
                  Etherscan
                </Typography>
              </Link>
            </Box>
          </Box>
        </Box>
        <Box display='flex' alignItems='center'>
          <Box display={{ xs: 'none', md: 'flex' }}>
            <Votes noVotes={againstVotes} yesVotes={forVotes} />
          </Box>
          <Box textAlign='center'>
            <Status status={status} timeLeft={timeLeft} />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CaratUpIcon
              strokecolor={isLight ? '#A3A9BA' : '#FFF'}
              sx={{
                width: 16,
                height: 16,
                ml: 2,
                transform: `${!isExpanded ? 'rotate(180deg)' : 'none'}`,
                transition: 'transform 0.2s',
              }}
            />
          </Box>
        </Box>
      </Box>

      {isExpanded ? (
        <Box
          sx={{
            cursor: 'auto',
          }}
        >
          {expandedContent ? (
            <Box>
              {status === 1 && (
                <Box mt={2}>
                  <VoteButton
                    id={id}
                    status={status}
                    votingPower={votingPower}
                    totalVotes={totalVotes}
                    isOptimistic={proposalType === 'optimistic'}
                    hasPriorVotes={hasPriorVotes}
                    hasVoted={hasVoted}
                  />
                </Box>
              )}

              <ProposalDetails id={id} proposalType={proposalType} votes={votes} />
              <Box my={2}>
                <Typography variant='h6_midi' display='block' mb={2}>
                  Details
                </Typography>
                {details.map((d, i) => (
                  <Box
                    sx={{
                      wordBreak: 'break-all',
                      mb: 1,
                      fontSize: 16,
                      fontWeight: 400,
                    }}
                    key={i}
                  >
                    {i + 1}: {linkIfAddress(d.target)}.{d.functionSig}(
                    {d.callData.split(',').map((content, i) => {
                      return (
                        <span key={i}>
                          {linkIfAddress(content)}
                          {d.callData.split(',').length - 1 === i ? '' : ','}
                        </span>
                      );
                    })}
                    )
                  </Box>
                ))}
              </Box>

              <Typography variant='h6_midi' my={2}>
                Description
              </Typography>
              <Box fontWeight={400} sx={{ '& h1': { lineHeight: 1 } }}>
                <ReactMarkdown
                  children={expandedContent}
                  components={markdownComponentConfig}
                  remarkPlugins={[remarkGfm]}
                />
              </Box>
              {status === 1 && (
                <VoteButton
                  isOptimistic={proposalType === 'optimistic'}
                  id={id}
                  status={status}
                  votingPower={votingPower}
                  totalVotes={totalVotes}
                  hasPriorVotes={hasPriorVotes}
                  hasVoted={hasVoted}
                />
              )}
              <Box display='flex' justifyContent='flex-end' mt={3} onClick={expandCard} sx={{ cursor: 'pointer' }}>
                <CaratUpIcon
                  strokecolor={isLight ? '#A3A9BA' : '#FFF'}
                  sx={{
                    width: 16,
                    height: 16,
                    transform: `${!isExpanded ? 'rotate(180deg)' : 'none'}`,
                    transition: 'transform 0.2s',
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Spinner />
          )}
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

const markdownComponentConfig: Partial<Omit<NormalComponents, keyof SpecialComponents> & SpecialComponents> = {
  a: ({ node, style, children, ...props }) => {
    return (
      <Link
        {...props}
        style={{
          ...style,
        }}
      >
        {children}
      </Link>
    );
  },
  table: ({ node, style, children, ...props }) => {
    return (
      <table
        {...props}
        style={{
          borderRadius: 10,
          backgroundColor: '#fcfcfc',
          color: '#303030',
          border: '1px solid black',
          borderCollapse: 'collapse',
          padding: 8,
          ...style,
        }}
      >
        {children}
      </table>
    );
  },
  th: ({ node, style, children, ...props }) => {
    return (
      <th
        style={{
          border: '1px solid black',
          padding: 12,
          ...style,
        }}
      >
        {children}
      </th>
    );
  },
  p: ({ node, style, children, ...props }) => {
    return <p style={{ ...style, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{children}</p>;
  },
  td: ({ node, style, children, isHeader, ...props }) => {
    if (isHeader) {
      return (
        <th
          style={{
            border: '1px solid black',
            padding: '12px',

            ...style,
          }}
        >
          {children}
        </th>
      );
    }
    return (
      <td
        style={{
          border: '1px solid black',
          padding: 12,
          paddingTop: 8,
          paddingBottom: 8,
          ...style,
        }}
      >
        {children}
      </td>
    );
  },
  tr: ({ node, style, children, isHeader, ...props }) => {
    return (
      <tr
        {...props}
        style={{
          border: '1px solid black',
          padding: 8,
          ...style,
        }}
      >
        {children}
      </tr>
    );
  },
  img: ({ node, ...props }) => {
    return (
      <img
        {...props}
        style={{
          display: 'block',
          margin: 'auto',
          width: '66%',
        }}
      ></img>
    );
  },
  pre: ({ node, ...props }) => {
    return (
      <pre
        {...props}
        style={{
          border: '1px solid #CCCCCC',
          borderRadius: 3,
          backgroundColor: '#fafafa',
          color: '#303030',
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          margin: '1em 0',
          overflow: 'auto',
          padding: '6px 10px',
        }}
      ></pre>
    );
  },
  code: ({ node, inline, className, children, ...props }) => {
    return (
      <code
        className={className}
        {...props}
        style={{
          fontFamily: 'monospace',
          borderRadius: 3,
          backgroundColor: '#fafafa',
          color: '#303030',
          border: inline ? '1px solid #EAEAEA' : 'none',
        }}
      >
        {children}
      </code>
    );
  },
};
