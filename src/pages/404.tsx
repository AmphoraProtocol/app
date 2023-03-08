import { ReactElement } from 'react';

import { AppLayout } from '../components/partials/app-layout';
import { PageContainer } from '../components/util/pageContainer';
import { TitleTextCard } from '../components/util/cards';

const NotFound404Page = () => (
  <PageContainer
    containerProps={{
      mt: {
        xs: 20,
      },
      mb: {
        xs: 20,
      },
    }}
  >
    <TitleTextCard
      title='404'
      titleProps={{ variant: 'h3' }}
      caption="Whoops, this page doesn't exist"
      sx={{ maxWidth: '780px' }}
    />
  </PageContainer>
);

NotFound404Page.getLayout = (page: ReactElement) => {
  return <AppLayout>{page}</AppLayout>;
};

export default NotFound404Page;
