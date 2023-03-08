import { Box } from '@mui/system';
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Button, Typography } from '@mui/material';
import { formatColor, neutral } from '../../../theme';
import useWindowDimensions from '../../../hooks/useWindowDimensions';

pdfjs.GlobalWorkerOptions.workerSrc = 'pdf.worker.min.js';

interface PDFViewerProps {
  max_width: number;
  pdf_src: string;
  downloadable?: boolean;
}

export const PDFViewer = (props: PDFViewerProps) => {
  const { max_width, pdf_src, downloadable = false } = props;
  const { width } = useWindowDimensions();
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  function onDocumentLoadSuccess({ numPages }: { numPages: any }) {
    setNumPages(numPages);
  }
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const onScroll = (e: any) => {
      setScrollTop(e.target.documentElement.scrollTop);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [scrollTop]);

  useEffect(() => {
    const bottom = (document.documentElement.scrollHeight - window.innerHeight) * 0.7;
    if (numPages && bottom < scrollTop && pageNumber < numPages) {
      if (pageNumber <= numPages - 2) {
        setPageNumber(pageNumber + 1);
      }
    }
  }, [scrollTop]);

  useEffect(() => {
    setTimeout(() => {
      if (numPages) {
        setPageNumber(numPages - 1);
        // automatically download the entire thing after 2 seconds
      }
    }, 1000 * 2);
  }, [numPages]);

  return (
    <Box
      display='flex'
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: max_width + 'px',
        flexDirection: 'column',
      }}
    >
      {downloadable && (
        <Button href={pdf_src}>
          <Typography
            sx={{
              color: formatColor(neutral.white),
              width: 'auto',
              whiteSpace: 'nowrap',
              px: 3,
            }}
            variant='body1'
          >
            Click Here to Download Document
          </Typography>
        </Button>
      )}
      <Document renderMode='svg' file={pdf_src} onLoadSuccess={onDocumentLoadSuccess} onLoadError={console.log}>
        <Page width={(width > max_width ? max_width : width) * 0.9} pageNumber={1} />
        <br />

        {[...Array(pageNumber)].map((x, i) => {
          return (
            <>
              <Page width={(width > max_width ? max_width : width) * 0.9} pageNumber={i + 2} /> <br />
            </>
          );
        })}
      </Document>
    </Box>
  );
};
