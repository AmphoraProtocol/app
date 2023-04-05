import { createReducer } from '@reduxjs/toolkit';

import { StablecoinActions } from './stablecoin.actions';
import { initialStatus, StablecoinState } from '~/types';
import { initializeToken } from '~/utils';
import { getConfig } from '~/config';

const {
  USDA_DECIMALS,
  ADDRESSES: { USDA, SUSD },
} = getConfig();

export const stablecoinInitialState: StablecoinState = {
  USDA: initializeToken({
    name: 'Amphora USD',
    address: USDA,
    ticker: 'USDA',
    decimals: USDA_DECIMALS,
  }),
  SUSD: initializeToken({
    name: 'Synth sUSD',
    address: SUSD,
    ticker: 'sUSD',
    decimals: 18,
  }),
  status: initialStatus,
};

const { getStablesData } = StablecoinActions;

export const stablecoinReducer = createReducer(stablecoinInitialState, (builder) => {
  builder.addCase(getStablesData.fulfilled, (state, { payload: { USDA, SUSD } }) => {
    state.SUSD = SUSD;
    state.USDA = USDA;
    state.status.loading = false;
  });

  builder.addCase(getStablesData.pending, (state) => {
    state.status.loading = true;
  });

  builder.addCase(getStablesData.rejected, (state) => {
    state.status.loading = false;
  });
});
