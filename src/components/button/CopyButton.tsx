import { Button, Popover, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useLight } from '~/hooks/useLight';
import { formatColor, neutral } from '~/theme';

import { CopyIcon } from '../icons/misc/CopyIcon';

export const CopyButton = ({ text, copy }: { text?: string; copy?: string }) => {
  const isLight = useLight();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);

  const copyText = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (copy) {
      navigator.clipboard.writeText(copy);
    } else if (text) {
      navigator.clipboard.writeText(text);
    }
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <>
      <Button
        onClick={copyText}
        sx={
          isLight
            ? {
                width: 'fit-content',
                minWidth: 'auto',
                px: 2,
                backgroundColor: formatColor(neutral.white),
                color: formatColor(neutral.black),
                '&:hover': {
                  backgroundColor: formatColor(neutral.gray5),
                },
              }
            : {
                width: 'fit-content',
                minWidth: 'auto',
                px: 2,
                backgroundColor: formatColor(neutral.gray4),
                color: formatColor(neutral.white),
                '&:hover': {
                  backgroundColor: formatColor(neutral.gray1),
                },
              }
        }
      >
        {text && (
          <Typography variant='label' color='text.primary' sx={{ position: 'relative', top: 1, marginRight: 1 }}>
            {text}
          </Typography>
        )}
        <CopyIcon
          sx={{
            width: '16px',
          }}
          islight={isLight.toString()}
        />
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Typography
          sx={{
            p: 2,
            display: 'block',
          }}
          variant='label_semi'
        >
          Copied to Clipboard
        </Typography>
      </Popover>
    </>
  );
};
