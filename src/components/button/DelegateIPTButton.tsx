import { Button, Typography } from '@mui/material';
import { ForwardIcon } from '../../icons/misc/ForwardIcon';
import { useModalContext, ModalType } from '../../libs/modal-content-provider/ModalContentProvider';

export const DelegateIPTButton = ({ iptBalance }: { iptBalance: number }) => {
  const { setType } = useModalContext();

  return (
    <Button
      variant='contained'
      sx={{
        py: 1,
        px: 2,
        height: 'auto',
        backgroundColor: 'button.delegate',
        stroke: 'white',
        '&.Mui-disabled': {
          color: 'white',
        },
        '&:hover': {
          stroke: '#374252',
        },
      }}
      onClick={() => setType(ModalType.DelegateIPT)}
      disabled={iptBalance <= 0}
    >
      <Typography variant='body1'>Delegate</Typography>
      <ForwardIcon
        sx={{
          width: 12,
          height: 12,
          ml: 1,
        }}
      />
    </Button>
  );
};
