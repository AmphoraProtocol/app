import { useSigner, useNetwork, erc20ABI } from 'wagmi';

import { getConfig } from '~/config';
import {
  IVaultController__factory,
  IVault__factory,
  IUSDA__factory,
  IWUSDA__factory,
  ICurveMaster__factory,
} from '@amphora-protocol/interfaces/ethers-v5/factories';

export const useAmphContracts = () => {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { DEFAULT_CHAIN_ID } = getConfig();

  const { VAULT_CONTROLLER, CURVE_MASTER, USDA, SUSD, WUSDA } = getConfig().ADDRESSES[chain?.id || DEFAULT_CHAIN_ID];

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
    abi: erc20ABI,
    signerOrProvider: signer,
  };

  const usdaContract = {
    address: USDA,
    abi: IUSDA__factory.abi,
    signerOrProvider: signer,
  };

  const wUsdaContract = {
    address: WUSDA,
    abi: IWUSDA__factory.abi,
    signerOrProvider: signer,
  };

  const tokenAbi = {
    abi: erc20ABI,
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
    wUsdaContract,
    tokenAbi,
    vaultAbi,
  };
};
