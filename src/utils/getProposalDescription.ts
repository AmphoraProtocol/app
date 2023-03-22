import { defaultAbiCoder } from '@ethersproject/abi';
import { ProposalCreatedEvent } from '~/components/api/getProposalCreatedEvents';

export interface ProposalDetails {
  target: string;
  functionSig: string;
  callData: string;
}

const FOUR_BYTES_DIR: { [sig: string]: string } = {
  '0x5ef2c7f0': 'setSubnodeRecord(bytes32,bytes32,address,address,uint64)',
  '0x10f13a8c': 'setText(bytes32,string,string)',
  '0xb4720477': 'sendMessageToChild(address,bytes)',
};

const getProposalDetails = ({
  targets,
  signatures,
  calldatas,
}: {
  targets: ProposalCreatedEvent['Targets'];
  signatures: ProposalCreatedEvent['Signatures'];
  calldatas: ProposalCreatedEvent['Calldatas'];
}): ProposalDetails[] => {
  const proposalDetails = [];

  for (let i = 0; i < targets.length; i++) {
    const signature = signatures[i];
    let calldata = calldatas[i];
    let name: string;
    let types: string;
    if (signature === '') {
      const fourbyte = calldata.slice(0, 10);
      const sig = FOUR_BYTES_DIR[fourbyte] ?? 'UNKNOWN()';
      if (!sig) throw new Error('Missing four byte sig');
      [name, types] = sig.substring(0, sig.length - 1).split('(');
      calldata = `0x${calldata.slice(10)}`;
    } else {
      [name, types] = signature.substring(0, signature.length - 1).split('(');
    }
    const decoded = defaultAbiCoder.decode(types.split(','), calldata);

    proposalDetails.push({
      target: targets[i],
      functionSig: name,
      callData: decoded.join(', '),
    });
  }

  return proposalDetails;
};

export default getProposalDetails;
