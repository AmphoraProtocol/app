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
  USDA: Token;
  SUSD: Token;
  status: Status;
}

export interface VCState {
  usdaSupply: number;
  totalSUSDDeposited: number;
  reserveRatio: number;
  borrowAPR: number | undefined;
  depositAPR: number | undefined;
  status: Status;
  userVault: UserVault;
}

export interface UserVault {
  vaultID: number | undefined;
  vaultAddress: string | undefined;
  tokenAddresses: string[] | undefined;
  borrowingPower: number;
  accountLiability: number;
}

export interface RootState {
  theme: ThemeState;
  collaterals: CollateralState;
  stablecoins: StablecoinState;
  VC: VCState;
}
