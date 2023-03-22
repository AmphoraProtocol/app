import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { Web3Data } from '~/components/libs/web3-data-provider/Web3Provider';
import { BACKUP_PROVIDER, CURVE_MASTER_ADDRESS, VAULT_CONTROLLER_ADDRESS } from '~/constants';
import { Chains } from '~/utils/chains';

import {
  IUSDA,
  IVaultController__factory,
  IVaultController,
  IUSDA__factory,
  ICurveMaster,
  ICurveMaster__factory,
  IERC20,
  IERC20__factory,
  IGovernorCharlieDelegate,
} from '../newContracts';

export const backupProvider = new JsonRpcProvider(BACKUP_PROVIDER);

export class Rolodex {
  provider: JsonRpcProvider;

  charlie?: IGovernorCharlieDelegate;

  addressUSDA: string;
  USDA: IUSDA;

  addressVC?: string;
  VC?: IVaultController;

  // addressOracle?: string;
  // Oracle?: IOracleMaster;

  addressCurve?: string;
  Curve?: ICurveMaster;

  addressSUSD?: string;
  SUSD?: IERC20;

  constructor(signerOrProvider: JsonRpcSigner | JsonRpcProvider, usda: string) {
    if (signerOrProvider instanceof JsonRpcSigner) {
      this.provider = signerOrProvider.provider;
    } else {
      this.provider = signerOrProvider;
    }
    this.addressUSDA = usda;
    this.USDA = IUSDA__factory.connect(this.addressUSDA, signerOrProvider);
  }
}

export const NewRolodex = async (ctx: Web3Data) => {
  // default to ethereum mainnet 1
  const token = Chains.getInfo(ctx.chainId || 1);
  let rolo: Rolodex;
  let provider = backupProvider;

  try {
    if (ctx.currentAccount) {
      const signer = ctx.provider!.getSigner(ctx.currentAccount);
      provider = ctx.provider!;
      rolo = new Rolodex(signer!, token.usda_address!);
      rolo.addressVC = VAULT_CONTROLLER_ADDRESS;
      rolo.VC = IVaultController__factory.connect(rolo.addressVC!, signer!);
    } else {
      rolo = new Rolodex(provider!, token.usda_address!);
      rolo.addressVC = VAULT_CONTROLLER_ADDRESS;
      rolo.VC = IVaultController__factory.connect(rolo.addressVC, provider);
    }
    // connect
    if (!rolo.addressSUSD) {
      rolo.addressSUSD = token.susd_address!;
      rolo.SUSD = IERC20__factory.connect(token.susd_address!, provider!);
    }

    if (!rolo.addressCurve) {
      rolo.addressCurve = CURVE_MASTER_ADDRESS;
      rolo.Curve = ICurveMaster__factory.connect(rolo.addressCurve!, provider!);
    }
  } catch (e) {
    throw new Error(`Error creating rolodex: ${e}`);
  }
  return rolo;
};
