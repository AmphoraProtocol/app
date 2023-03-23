import { createReducer } from '@reduxjs/toolkit';

import { ThemeState } from '~/types';
import { ThemeActions } from './theme.actions';

export const themeInitialState: ThemeState = {
  current: 'light',
};

const { changeTheme } = ThemeActions;

const themeReducer = createReducer(themeInitialState, (builder) => {
  builder.addCase(changeTheme, (state, { payload: { theme } }) => {
    state.current = theme;
  });
});

export default themeReducer;
