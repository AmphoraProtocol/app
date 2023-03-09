import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { SlowRoll__factory } from '../../chain/contracts/factories/IPTsale/slowroll.sol';
import { SLOWROLL_ADDRESS } from '../../constants';

// connect to slowroll contract

const getSlowRollContract = (signer: JsonRpcProvider | JsonRpcSigner) =>
  SlowRoll__factory.connect(SLOWROLL_ADDRESS, signer);

export default getSlowRollContract;
