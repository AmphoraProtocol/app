import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { CappedGovToken__factory } from '../../chain/contracts/factories/CappedGovToken__factory';

const getCappedPercentOf = async (capped_token_address: string, signerOrProvider: JsonRpcSigner | JsonRpcProvider) => {
  try {
    const cappedTokenContract = CappedGovToken__factory.connect(capped_token_address, signerOrProvider);

    const maximumCap = await cappedTokenContract.getCap();
    const totalSupply = await cappedTokenContract.totalSupply();

    return totalSupply.div(maximumCap).toNumber() * 100;
  } catch (err) {
    console.log(err);
    throw new Error('Could not get capped percent');
  }
};

export default getCappedPercentOf;
