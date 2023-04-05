import { createReducer } from '@reduxjs/toolkit';
import { initialStatus, VCState } from '~/types';

import { VCActions } from './vc.actions';

export const VCInitialState: VCState = {
  usdaSupply: 0,
  totalSUSDDeposited: 0,
  reserveRatio: 0,
  borrowAPR: undefined,
  depositAPR: undefined,
  userVault: {
    vaultAddress: undefined,
    vaultID: undefined,
    tokenAddresses: undefined,
    borrowingPower: 0,
    accountLiability: 0,
  },
  collaterals: undefined,
  status: initialStatus,
};

const { getVCData } = VCActions;

export const VCReducer = createReducer(VCInitialState, (builder) => {
  builder.addCase(
    getVCData.fulfilled,
    (
      state,
      { payload: { borrowAPR, depositAPR, totalSUSDDeposited, usdaSupply, reserveRatio, userVault, collaterals } },
    ) => {
      state.borrowAPR = borrowAPR;
      state.depositAPR = depositAPR;
      state.totalSUSDDeposited = totalSUSDDeposited;
      state.usdaSupply = usdaSupply;
      state.reserveRatio = reserveRatio;
      state.userVault = userVault;
      state.collaterals = collaterals;
      state.status.loading = false;
    },
  );

  builder.addCase(getVCData.pending, (state) => {
    state.status.loading = true;
  });

  builder.addCase(getVCData.rejected, (state) => {
    state.status.loading = false;
  });
});
