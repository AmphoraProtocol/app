import { useNetwork, useSigner } from 'wagmi';
import {
  ICurveMaster__factory,
  IERC20Metadata__factory,
  IUSDA__factory,
  IVaultController__factory,
  IVault__factory,
} from '~/chain/contracts';
import { getConfig } from '~/config';

import { getConstants } from '~/config/constants';

export const useAmphContracts = () => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { DEFAULT_CHAIN_ID } = getConfig();

  const { VAULT_CONTROLLER, CURVE_MASTER, USDA, SUSD } = getConstants().ADDRESSES[chain?.id || DEFAULT_CHAIN_ID];

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
