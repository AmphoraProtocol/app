import { JsonRpcProvider } from '@ethersproject/providers';

export const proposalTimeRemaining = async (
  startingBlock: number,
  endingBlock: number,
  currentBlock: number,
  status: number,
  provider: JsonRpcProvider,
) => {
  try {
    let blocksRemaining;
    if (status === 0) {
      blocksRemaining = startingBlock - currentBlock;

      return getTimeRemaining(blocksRemaining);
    } else if (status === 1) {
      blocksRemaining = endingBlock - currentBlock;

      return getTimeRemaining(blocksRemaining);
    } else if (status === 5) {
      const endingBlockTime = await provider.getBlock(endingBlock).then((res) => {
        const currentTimestamp = Date.now();

        const timelockPeriod = 172800;
        return getTimeRemaining((res.timestamp + timelockPeriod - currentTimestamp) / 13.5);
      });
      return endingBlockTime;
    }

    return 'N/A';
  } catch (err) {
    console.error(err);
    return 'N/A';
  }
};

const getTimeRemaining = (blockDiff: number): string => {
  const secs = blockDiff * 13.5;

  const hrdiff = Math.abs(Math.round((100 * secs) / (60 * 60)) / 100);

  if (hrdiff >= 24) {
    return `${Math.floor(hrdiff / 24)} day(s)`;
  } else if (hrdiff > 1) {
    return `${Math.floor(hrdiff)} hour(s)`;
  } else {
    return `${Math.floor(hrdiff * 60)} minute(s)`;
  }
};
