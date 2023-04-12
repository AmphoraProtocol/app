import { ChainInfo } from '../types';

export enum ChainIDs {
  LOCAL = 1337,
  SEPOLIA = 11155111,
}

const configs: Array<ChainInfo> = [
  // {
  //   id: ChainIDs.MAINNET,
  //   name: 'Ethereum',
  //   symbol: 'ETH',
  //   logo: 'ETH',
  //   scan_url: 'https://etherscan.io/tx/',
  //   scan_site: 'Etherscan',
  // },
  {
    id: ChainIDs.LOCAL,
    name: 'Ethereum Local',
    symbol: 'ETH Local',
    logo: 'ETH',
    scan_url: 'https://etherscan.io/',
    scan_site: 'Etherscan',
  },
  {
    id: ChainIDs.SEPOLIA,
    name: 'Sepolia',
    symbol: 'SETH',
    logo: 'ETH',
    scan_url: 'https://sepolia.etherscan.io/',
    scan_site: 'Etherscan',
  },
];

class chainHolder {
  m: Map<number, ChainInfo>;
  constructor() {
    this.m = new Map();
  }
  addChain(v: ChainInfo) {
    this.m.set(v.id, v);
  }
  getInfo(id: number | string): ChainInfo {
    if (this.m.has(Number(id))) {
      return this.m.get(Number(id))!;
    }
    return {
      id: 0,
      name: 'NOT SUPPORTED',
      symbol: 'N/A',
      logo: 'ETH',
      scan_url: 'N/A',
      scan_site: 'N/A',
    };
  }
}
const chains = new chainHolder();
for (const e of configs) {
  chains.addChain(e);
}
export const Chains = chains;
