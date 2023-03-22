import { Button, Typography } from '@mui/material';
import { blue, formatColor } from '~/theme';
import { ModalType, useModalContext } from '../libs/modal-content-provider/ModalContentProvider';

export const ClaimsButton = () => {
  const { setType } = useModalContext();

  return (
    <Button
      onClick={() => setType(ModalType.Claim)}
      sx={{
        maxWidth: { xs: '100%', lg: 150 },
        backgroundColor: 'button.claim',
        color: '#FFFFFF',
        padding: 2,
        '&:hover': {
          backgroundColor: formatColor(blue.blue14),
        },
      }}
    >
      <Typography variant='body1'>Claim</Typography>
    </Button>
  );
};
