import { createReducer } from '@reduxjs/toolkit';

import { StablecoinActions } from './stablecoin.actions';
import { initialStatus, StablecoinState } from '~/types';
import { initializeToken } from '~/utils';
import { getConfig } from '~/config';

const { USDA, WUSDA, SUSD } = getConfig().ADDRESSES[1];

export const stablecoinInitialState: StablecoinState = {
  USDA: initializeToken({
    name: 'Amphora USD',
    address: USDA,
    ticker: 'USDA',
    decimals: 18,
  }),
  wUSDA: initializeToken({
    name: 'Wrapped USDA',
    address: WUSDA,
    ticker: 'wUSDA',
    decimals: 18,
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
  builder.addCase(getStablesData.fulfilled, (state, { payload: { USDA, wUSDA, SUSD } }) => {
    state.SUSD = SUSD;
    state.USDA = USDA;
    state.wUSDA = wUSDA;
    state.status.loading = false;
  });

  builder.addCase(getStablesData.pending, (state) => {
    state.status.loading = true;
  });

  builder.addCase(getStablesData.rejected, (state) => {
    state.status.loading = false;
  });
});
