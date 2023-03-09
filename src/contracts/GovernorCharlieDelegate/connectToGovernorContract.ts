import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { GovernorCharlieDelegate__factory } from '../../chain/contracts';
import { GOVERNOR_ADDRESS } from '../../constants';

const connectToGovernorContract = (signerOrProvider: JsonRpcSigner | JsonRpcProvider) =>
  GovernorCharlieDelegate__factory.connect(GOVERNOR_ADDRESS, signerOrProvider);

export default connectToGovernorContract;
