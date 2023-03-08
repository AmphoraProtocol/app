import { Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions, Button } from '@mui/material';
import { useState } from 'react';
import Cookies from 'universal-cookie';

const Terms: React.FC = () => {
  const cookie = new Cookies();
  const [open, setOpen] = useState(cookie.get('IP_ACCEPT_TERMS') != 'YES');
  const handleClose = () => {};
  const handleAgree = () => {
    cookie.set('IP_ACCEPT_TERMS', 'YES');
    setOpen(false);
  };
  const textFormat = {
    whiteSpace: 'pre-line',
    unicodeBidi: 'embed',
    overflowWrap: 'anywhere',
  };
  return (
    <>
      <Dialog
        open={open}
        scroll={'body'}
        onClose={handleClose}
        sx={{
          color: '#fff',
          zIndex: 1,
          marginTop: { xs: 13, md: 20 },
        }}
      >
        <DialogTitle>Please scroll to bottom</DialogTitle>
        <DialogContent>
          <DialogContentText noWrap={false} paragraph={true} sx={textFormat}>
            {copyTermsSale}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAgree}>I have read & agreed to the above</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const copyTermsSale = 'terms content here';
