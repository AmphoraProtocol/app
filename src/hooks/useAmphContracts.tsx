import { useSigner } from 'wagmi';
import {
  ICurveMaster__factory,
  IERC20Metadata__factory,
  IUSDA__factory,
  IVaultController__factory,
  IVault__factory,
} from '~/contracts';

import { getConstants } from '~/config/constants';

export const useAmphContracts = () => {
  const { data: signer } = useSigner();
  const { VAULT_CONTROLLER_ADDRESS, CURVE_MASTER_ADDRESS, USDA_ADDRESS, SUSD_ADDRESS } = getConstants().ADDRESSES;

  const VaultControllerContract = {
    address: VAULT_CONTROLLER_ADDRESS,
    abi: IVaultController__factory.abi,
    signerOrProvider: signer,
  };

  const CurveContract = {
    address: CURVE_MASTER_ADDRESS,
    abi: ICurveMaster__factory.abi,
    signerOrProvider: signer,
  };

  const susdContract = {
    address: SUSD_ADDRESS,
    abi: IERC20Metadata__factory.abi,
    signerOrProvider: signer,
  };

  const usdaContract = {
    address: USDA_ADDRESS,
    abi: IUSDA__factory.abi,
    signerOrProvider: signer,
  };

  const tokenAbi = {
    abi: IERC20Metadata__factory.abi,
    signerOrProvider: signer,
  };

  const vaultAbi = {
    abi: IVault__factory.abi,
    signerOrProvider: signer,
  };

  return {
    VaultControllerContract,
    CurveContract,
    susdContract,
    usdaContract,
    tokenAbi,
    vaultAbi,
  };
};
