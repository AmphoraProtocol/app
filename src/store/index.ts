import { configureStore, combineReducers, Reducer } from '@reduxjs/toolkit';

import { RootState } from '~/types';

import { createLogger } from 'redux-logger';
import { cloneDeep } from 'lodash';

// Collaterals state
import { collateralReducer, collateralInitialState } from './collaterals/collaterals.reducer';
import { CollateralActions } from './collaterals/collaterals.actions';

// Stablecoins state
import { stablecoinReducer, stablecoinInitialState } from './stablecoin/stablecoin.reducer';
import { StablecoinActions } from './stablecoin/stablecoin.actions';

// VaultController state
import { VCReducer, VCInitialState } from './vaultController/vc.reducer';
import { VCActions } from './vaultController/vc.actions';
import { getEnv } from '~/config/env';

export const rootReducer: Reducer<RootState> = combineReducers({
  collaterals: collateralReducer,
  stablecoins: stablecoinReducer,
  VC: VCReducer,
});

// Actions
export { CollateralActions, StablecoinActions, VCActions };

// initialStates
export { collateralInitialState, stablecoinInitialState, VCInitialState };

export function getStore() {
  const isDev = getEnv().VITE_ALLOW_DEV_MODE;

  const initialState = {
    collaterals: cloneDeep(collateralInitialState),
    stablecoins: cloneDeep(stablecoinInitialState),
    VC: cloneDeep(VCInitialState),
  };

  const logger = createLogger({ collapsed: true });
  const middlewareOptions = {
    immutableCheck: { warnAfter: 300 },
    serializableCheck: { warnAfter: 200 },
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
      const middleware = getDefaultMiddleware(middlewareOptions);
      if (isDev) {
        middleware.push(logger);
      }
      return middleware;
    },
    devTools: isDev,
    preloadedState: initialState,
  });
  return store;
}

const store = getStore();

export type Store = ReturnType<typeof getStore>;
export type AppDispatch = Store['dispatch'];

export interface ThunkAPI {
  dispatch: AppDispatch;
  state: RootState;
}
export default store;
