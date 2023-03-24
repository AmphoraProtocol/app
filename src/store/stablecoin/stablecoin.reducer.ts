import { createReducer } from '@reduxjs/toolkit';
import { getStablecoins } from '~/utils/tokens';
import { initialStatus, StablecoinState } from '~/types';

import { StablecoinActions } from './stablecoin.actions';

export const stablecoinInitialState: StablecoinState = {
  USDA: getStablecoins().USDA,
  SUSD: getStablecoins().SUSD,
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
