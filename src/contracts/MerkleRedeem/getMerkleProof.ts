import MerkleTree from 'merkletreejs';
import { keccak256, solidityKeccak256 } from 'ethers/lib/utils';

import weeks from './whitelists';
interface LiquidityProvider {
  minter: string;
  amount: string;
}

const initMerkle = (week: number) => {
  // @ts-ignore
  const selectedWeek: { [address: string]: string } = weeks[week];
  const leafNodes = [];
  for (const addr in selectedWeek) {
    leafNodes.push(solidityKeccak256(['address', 'uint256'], [addr, selectedWeek[addr]]));
  }

  const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  const root = merkleTree.getHexRoot();
  return { tree: merkleTree, root: root };
};

const getMinterAmount = (currentAccount: string, week: number) => {
  // @ts-ignore
  const selectedWeek: { [address: string]: string } = weeks[week];
  return selectedWeek[currentAccount];
};

export const getMerkleProof = (
  lpAddress: string,
  week: number,
): { proof: string[]; minter: LiquidityProvider } | undefined => {
  try {
    const { tree, root } = initMerkle(week);
    const minterAmount = getMinterAmount(lpAddress, week);
    if (!minterAmount) {
      return undefined;
    }
    const leaf = solidityKeccak256(['address', 'uint256'], [lpAddress, minterAmount]);
    const proof = tree.getHexProof(leaf);
    return {
      proof,
      minter: {
        minter: lpAddress,
        amount: minterAmount,
      },
    };
  } catch (err) {
    throw new Error('Could not find Proof');
  }
};
