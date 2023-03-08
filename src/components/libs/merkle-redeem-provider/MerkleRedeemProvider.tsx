import { BigNumber } from 'ethers';
import { createContext, useContext, useEffect, useState } from 'react';
import createClaimOf, { Claim } from '../../../contracts/MerkleRedeem/createClaim';
import getSpecificWeekClaim, { SPECIFIC_WEEKS } from '../../../contracts/MerkleRedeem/getSpecificWeekClaim';
import getClaimStatusOf from '../../../contracts/MerkleRedeem/getClaimStatus';
import { BN } from '../../../easy/bn';
import { useWeb3Context } from '../web3-data-provider/Web3Provider';

export type MerkleRedeemContextType = {
  claims: Claim[];
  claimStatus: boolean[];
  claimAmount: BigNumber;
};

export const MerkleRedeemContext = createContext<MerkleRedeemContextType>({} as MerkleRedeemContextType);

export const MerkleRedeemContextProvider = ({ children }: { children: React.ReactElement }) => {
  const { currentAccount, chainId, currentSigner } = useWeb3Context();
  const [claimStatus, setClaimStatus] = useState([true]);
  const [claimAmount, setClaimAmount] = useState(BN('0'));
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    if (currentSigner && currentAccount) {
      getClaimStatusOf(currentAccount, currentSigner!).then((claimStatus) => {
        setClaimStatus(claimStatus);
        const claims = createClaimOf(currentAccount, claimStatus);

        SPECIFIC_WEEKS.forEach((week) => {
          getSpecificWeekClaim(currentAccount, currentSigner, week).then((claimRes) => {
            if (claimRes) {
              claims.push(claimRes);
            }

            setClaims(claims);

            const iptToClaim = claims.reduce((iptToClaim, claim) => {
              return iptToClaim.add(claim.balance);
            }, BN(0));
            setClaimAmount(iptToClaim);
          });
        });
      });
    }
  }, [chainId, currentAccount, currentSigner]);

  return (
    <MerkleRedeemContext.Provider value={{ claimStatus, claims, claimAmount }}>{children}</MerkleRedeemContext.Provider>
  );
};

export const useMerkleRedeemContext = () => {
  const context = useContext(MerkleRedeemContext);

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }

  return context;
};
