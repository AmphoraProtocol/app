import { ChainInfo } from '~/types';

export enum ChainIDs {
  LOCAL = 1337,
  GOERLI = 5,
  MAINNET = 1,
}

const configs: Array<ChainInfo> = [
  {
    id: ChainIDs.MAINNET,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'ETH',
    scan_url: 'https://etherscan.io/tx/',
    scan_site: 'Explorer',
  },
  {
    id: ChainIDs.LOCAL,
    name: 'Ethereum Local',
    symbol: 'ETH Local',
    logo: 'ETH',
    scan_url: 'https://etherscan.io/',
    scan_site: 'Explorer',
  },
  {
    id: ChainIDs.GOERLI,
    name: 'Goerli',
    symbol: 'GETH',
    logo: 'ETH',
    scan_url: 'https://goerli.etherscan.io/',
    scan_site: 'Explorer',
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
