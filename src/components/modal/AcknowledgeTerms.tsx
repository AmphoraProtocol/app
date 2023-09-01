import { Box, Typography, Button } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';

import { formatColor, neutral } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';
import { BaseModal } from './BaseModal';

export const AcknowledgeTerms = () => {
  const { type, setType } = useModalContext();
  const { openConnectModal } = useConnectModal();

  const handleAgree = () => {
    localStorage.setItem('acknowledgeTerms', new Date().toString());
    setType(null);
    if (openConnectModal) openConnectModal();
  };

  return (
    <BaseModal
      open={type === ModalType.AcknowledgeTerms}
      setOpen={() => {
        setType(null);
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          mb: 2.5,
          mt: 2,
          columnGap: 1.5,
          maxHeight: '70vh',
        }}
      >
        <Typography mt={0} variant='h5' color='text.primary'>
          Acknowledge terms
        </Typography>

        <Typography variant='body1' color='text.primary' my={3.2}>
          By clicking “I Agree” below, you agree to be bound by the terms of this Agreement. As such, you fully
          understand that:{' '}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'slider.background',
            columnGap: 1.5,
            borderRadius: 2,
            padding: 2.4,
            overflowY: 'auto',
          }}
        >
          <Typography variant='body2' color='text.primary' mt={0}>
            • Amphora is a blockchain-based decentralized project. You are participating at your own risk.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • Amphora is offered for use “as is” and without any guarantees regarding security. The protocol is made up
            of immutable code and can be accessed through a variety of user interfaces.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • No central entity operates the Amphora protocol. Decisions related to the protocol are governed by a
            dispersed group of participants who collectively govern and maintain the protocol.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • Amphora does not unilaterally offer, maintain, operate, administer, or control any trading interfaces. The
            only user interfaces maintained by Amphora are the governance and staking interfaces herein.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • You can participate in the governance process by staking AMPH tokens in accordance with the rules and
            parameters, and/or joining the Amphora Discord and contributing to the conversation.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • The rules and parameters associated with the Amphora protocol and Amphora DAO governance are subject to
            change at any time.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • Your use of Amphora is conditioned upon your acceptance to be bound by the Amphora Term of Use.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • The laws that apply to your use of Amphora may vary based upon the jurisdiction in which you are located.
            We strongly encourage you to speak with legal counsel in your jurisdiction if you have any questions
            regarding your use of Amphora.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • By entering into this agreement, you are not agreeing to enter into a partnership. You understand that
            Amphora is a decentralized protocol provided on an “as is” basis.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • You hereby release all present and future claims against Amphora DAO related to your use of the protocol,
            the AMPH token, Amphora DAO governance, and any other facet of the protocol.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • You agree to indemnify and hold harmless Amphora DAO and its affiliates for any costs arising out of or
            relating to your use of the Amphora protocol.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • You are not accessing the protocol from Burma (Myanmar), Cuba, Iran, Sudan, Syria, the Western Balkans,
            Belarus, Côte d&apos;Ivoire, Democratic Republic of the Congo, Iraq, Lebanon, Liberia, Libya, North Korea,
            Russia, certain sanctioned areas of Ukraine, Somalia, Venezuela, Yemen, or Zimbabwe (collectively,
            “Prohibited Jurisdictions”), or any other jurisdiction listed as a Specially Designated National by the
            United States Office of Foreign Asset Control (“OFAC”).
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • You are not an American or based in the United States of America, or otherwise subject to US law in a
            manner that prohibits you from partaking in such products or offerings.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • You understand &apos;debt&apos; &apos;lend&apos; &apos;borrow&apos; &apos;collateral&apos;
            &apos;credit&apos; &apos;borrow&apos; &apos;yield&apos; &apos;invest&apos; &apos;earn&apos; and
            &apos;apy&apos; terms on this site are not meant to be interpreted literally but instead such terms are used
            to draw rough, fuzzy-logic analogies between heavily automated and deterministic operations of a
            decentralized finance smart contract system, and more familiar and accessible concepts related to
            traditional finance.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • The stated APR or APY for any given token or deposit on this site is a measurement of a specific tokens,
            forward-looking, projected, rate of earning of that token or another reward token, in good faith belief over
            a relevant period, but subject to numerous assumptions, risks and uncertainties, including smart contract
            security and third party actions.
          </Typography>
          <Typography variant='body2' color='text.primary' mt={2.4}>
            • Rates are not offers, promises, agreements, guarantees or undertakings, but instead measurements of an
            autonomous system. Even if a particular rate is achieved, you may still suffer a financial loss in
            fiat-denominated terms.
          </Typography>
        </Box>
      </Box>

      <Box>
        <Button
          variant='contained'
          sx={{ color: formatColor(neutral.white), mt: 2, width: '100%' }}
          onClick={handleAgree}
        >
          I Agree
        </Button>
      </Box>
    </BaseModal>
  );
};
