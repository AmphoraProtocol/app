import { Box } from '@mui/system';
import { Button, Modal, Typography, Paper } from '@mui/material';
import { formatColor, neutral } from '../../../theme';
import { PDFViewer } from './PDFViewer';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

interface PDFModalProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  pdf_src: string;
  downloadable?: boolean;
  must_agree?: boolean;
  must_agree_handler?: () => void;
}

export const PDFModal = (props: PDFModalProps) => {
  const { isOpen, setIsOpen, pdf_src, downloadable = false, must_agree = false, must_agree_handler } = props;
  const mw = 900;
  const { height } = useWindowDimensions();

  return (
    <Modal disableEscapeKeyDown={must_agree} hideBackdrop={must_agree} onClose={() => setIsOpen(false)} open={isOpen}>
      <Paper
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: { xs: '97%', md: `${mw}px` },
          p: 2,
          borderRadius: '10px',
          overflowY: 'scroll',
          background: formatColor(neutral.gray1),
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          height: { xs: height * 0.9, md: height * 0.58 },
        }}
      >
        {must_agree && must_agree_handler !== undefined && (
          <Box textAlign='center' mb={1}>
            <Typography variant='body3'> Please read and scroll to the bottom to accept</Typography>
          </Box>
        )}

        <PDFViewer max_width={mw} pdf_src={pdf_src} downloadable={downloadable} />

        {must_agree && must_agree_handler !== undefined && (
          <Button
            variant='cta'
            size='medium'
            sx={{ marginX: 'auto', display: 'block', marginBottom: 1 }}
            onClick={must_agree_handler}
          >
            <Typography variant='body3'> I have read & agreed to the above</Typography>
          </Button>
        )}
      </Paper>
    </Modal>
  );
};
