import React from 'react';
import { Box, IconButton, Modal, Paper, SvgIcon } from '@mui/material';

import { useLight } from '~/hooks/useLight';
import { CloseIcon } from '../icons/misc/CloseIcon';

export interface BaseModalProps {
  open: boolean;
  children: React.ReactNode;
  setOpen: (value: boolean) => void;
  withCloseButton?: boolean;
  contentMaxWidth?: number;
}

export const BaseModal: React.FC<BaseModalProps> = ({
  open,
  setOpen,
  withCloseButton = true,
  contentMaxWidth = 520,
  children,
  ...props
}: BaseModalProps) => {
  const handleClose = () => setOpen(false);

  const isLight = useLight();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        '.MuiPaper-root': {
          outline: 'none',
        },
      }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...props}
      data-cy={'Modal'}
    >
      <Paper
        sx={{
          position: 'relative',
          margin: '10px',
          width: '100%',
          maxWidth: { xs: '359px', sm: `${contentMaxWidth}px` },
          maxHeight: 'calc(100vh - 20px)',
          p: 4,
          borderRadius: '10px',
          backgroundColor: 'modal.background',
          backgroundImage: 'none',
        }}
      >
        {children}

        <Box sx={{ position: 'absolute', top: '24px', right: '38px', zIndex: 5 }}>
          <IconButton
            sx={{
              borderRadius: '50%',
              p: 0,
              minWidth: 0,
              position: 'absolute',
              bgcolor: 'background.paper',
              width: 15,
              height: 15,
            }}
            onClick={handleClose}
          >
            <CloseIcon islight={isLight.toString()} />
          </IconButton>
        </Box>
      </Paper>
    </Modal>
  );
};
