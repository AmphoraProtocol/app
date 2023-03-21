import { Status } from './Status';
import { Token } from './token';

export type ThemeName = 'system-prefs' | 'light' | 'dark';

export interface ThemeState {
  current: ThemeName;
}

export interface CollateralState {
  elements?: { [key: string]: Token };
}

export interface StablecoinState {
  USDA: Token | undefined;
  SUSD: Token | undefined;
  status: Status;
}

export interface RootState {
  theme: ThemeState;
  collaterals: CollateralState;
  stablecoins: StablecoinState;
}
