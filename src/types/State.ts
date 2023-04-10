import { Address } from 'wagmi';
import { Status } from './Status';
import { Token } from './Token';

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
  collaterals: Address[] | undefined;
}

export interface UserVault {
  vaultID: number | undefined;
  vaultAddress: Address | undefined;
  tokenAddresses: Address[] | undefined;
  borrowingPower: number;
  accountLiability: number;
  rewards:
    | {
        prices: number[];
        amounts: number[];
      }
    | undefined;
}

export interface RootState {
  collaterals: CollateralState;
  stablecoins: StablecoinState;
  VC: VCState;
}
