import { Box } from '@mui/material';
import { CHART_INTEREST_RATE_OVERTIME } from '../../../constants';
import getAPIBaseUrl from '../helpers/getAPIBaseUrl';
import { CardContainer } from './CardContainer';
import { ChartContainerCard } from './ChartContainerCard';

export const InterestRateGraphCard = () => {
  return (
    <CardContainer>
      <ChartContainerCard
        style={{
          position: 'relative',
          padding: 20,
          height: 650,
          width: '100%',
        }}
        src={`${getAPIBaseUrl()}${CHART_INTEREST_RATE_OVERTIME}`}
      />
    </CardContainer>
  );
};
