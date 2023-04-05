import { useSigner } from 'wagmi';
import {
  ICurveMaster__factory,
  IERC20Metadata__factory,
  IUSDA__factory,
  IVaultController__factory,
  IVault__factory,
} from '~/chain/contracts';

import { getConstants } from '~/config/constants';

export const useAmphContracts = () => {
  const { data: signer } = useSigner();
  const { VAULT_CONTROLLER, CURVE_MASTER, USDA, SUSD } = getConstants().ADDRESSES;

  const VaultControllerContract = {
    address: VAULT_CONTROLLER,
    abi: IVaultController__factory.abi,
    signerOrProvider: signer,
  };

  const CurveContract = {
    address: CURVE_MASTER,
    abi: ICurveMaster__factory.abi,
    signerOrProvider: signer,
  };

  const susdContract = {
    address: SUSD,
    abi: IERC20Metadata__factory.abi,
    signerOrProvider: signer,
  };

  const usdaContract = {
    address: USDA,
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
