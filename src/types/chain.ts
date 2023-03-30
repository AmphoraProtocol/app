import { Address } from 'wagmi';

export interface ChainInfo {
  id: number;
  name: string;
  symbol: string;
  logo: string;
  usda_address?: Address;
  susd_address?: Address;
  scan_url: string;
  scan_site: string;
}
