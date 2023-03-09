import React from 'react';
import { PDFFullPage } from '../../components/util/pdfViewer/PDFFullPage';

export const WhitepaperPage: React.FC = () => {
  return <PDFFullPage pdf_src='whitepaper.pdf' downloadable={true} />;
};
