import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { Web3Data } from '~/components/libs/web3-data-provider/Web3Provider';
import { BACKUP_PROVIDER } from '~/constants';
import { Chains } from '../chains';

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
      const signer = await ctx.provider!.getSigner(ctx.currentAccount);
      provider = ctx.provider!;
      rolo = new Rolodex(signer!, token.usda_address!);
      // temporary
      // rolo.addressVC = await rolo.USDI?.getVaultController();
      rolo.addressVC = '0x773330693cb7d5D233348E25809770A32483A940';
      rolo.VC = IVaultController__factory.connect(rolo.addressVC!, signer!);
    } else {
      rolo = new Rolodex(provider!, token.usda_address!);
      // temporary
      // rolo.addressVC = await rolo.USDI?.getVaultController();
      rolo.addressVC = '0x773330693cb7d5D233348E25809770A32483A940';
      rolo.VC = IVaultController__factory.connect(rolo.addressVC, provider);
    }
    // connect
    if (!rolo.addressSUSD) {
      rolo.addressSUSD = await rolo.USDA.reserveAddress();
      rolo.SUSD = IERC20__factory.connect(rolo.addressSUSD!, provider!);
    }

    // if (!rolo.addressOracle) {
    //   rolo.addressOracle = await rolo.VC?.getOracleMaster();
    //   rolo.Oracle = OracleMaster__factory.connect(rolo.addressOracle!, provider!);
    // }

    if (!rolo.addressCurve) {
      rolo.addressCurve = await rolo.VC?.curveMaster();
      rolo.Curve = ICurveMaster__factory.connect(rolo.addressCurve!, provider!);
    }
  } catch (e) {
    throw new Error(`Error creating rolodex: ${e}`);
  }
  return rolo;
};
