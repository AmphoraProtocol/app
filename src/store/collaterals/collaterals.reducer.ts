import { createReducer } from '@reduxjs/toolkit';
import { CollateralState } from '~/types';

import { CollateralActions } from './collaterals.actions';

export const collateralInitialState: CollateralState = {
  elements: undefined,
};

const { getCollateralData } = CollateralActions;

export const collateralReducer = createReducer(collateralInitialState, (builder) => {
  builder.addCase(getCollateralData.fulfilled, (state, { payload: { tokens } }) => {
    state.elements = tokens;
  });
});
