import { createAction } from '@reduxjs/toolkit';

import { ThemeName } from '~/types';

const changeTheme = createAction<{ theme: ThemeName }>('theme/changeTheme');

export const ThemeActions = {
  changeTheme,
};
