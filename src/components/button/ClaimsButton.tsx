import { Button, Typography } from '@mui/material';
import { blue, formatColor } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';

export const ClaimsButton = ({ text, claimAll }: { text: string; claimAll?: boolean }) => {
  const { setType } = useModalContext();

  return (
    <Button
      onClick={() => {
        if (claimAll) {
          setType(ModalType.ClaimAll);
        } else {
          setType(ModalType.Claim);
        }
      }}
      sx={{
        maxWidth: { xs: '100%', lg: 150 },
        backgroundColor: 'button.claim',
        color: '#FFFFFF',
        padding: 1.5,
        '&:hover': {
          backgroundColor: formatColor(blue.blue14),
        },
      }}
    >
      <Typography variant='body1'>{text}</Typography>
    </Button>
  );
};
