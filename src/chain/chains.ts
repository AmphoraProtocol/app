import { ChainInfo } from '../types/chain';

export enum ChainIDs {
  MAINNET = 1,
  ROPSTEN = 3,
  GOERLI = 5,
  POLYGON = 137,
  LOCAL = 1337,
}

const configs: Array<ChainInfo> = [
  {
    id: ChainIDs.MAINNET,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'ETH',
    usda_address: '0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae',
    scan_url: 'https://etherscan.io/tx/',
    scan_site: 'Etherscan',
  },
  {
    id: ChainIDs.LOCAL,
    name: 'Ethereum Local',
    symbol: 'ETH Local',
    logo: 'ETH',
    // temporary: set all addresses in one place
    usda_address: '0x40A633EeF249F21D95C8803b7144f19AAfeEF7ae',
    scan_url: 'https://etherscan.io/tx/',
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
