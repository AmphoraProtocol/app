import { Box } from '@mui/system';
import { FC } from 'react';
import { Button, Typography } from '@mui/material';
import { formatColor, neutral } from '../../../theme';
import { PDFViewer } from './PDFViewer';

interface PDFFullPageProps {
  pdf_src: string;
  downloadable?: boolean;
}

export const PDFFullPage = (props: PDFFullPageProps) => {
  const { pdf_src, downloadable = false } = props;
  const mw = 1500;

  return (
    <Box
      display='flex'
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        background: formatColor(neutral.gray1),
      }}
    >
      <PDFViewer max_width={mw} pdf_src={pdf_src} downloadable={downloadable} />
    </Box>
  );
};
