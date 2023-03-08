import React from 'react';

import { PDFFullPage } from '../../components/util/pdfViewer/PDFFullPage';

export const TermsPage: React.FC = () => {
  return <PDFFullPage pdf_src='ip_terms.pdf' downloadable={true} />;
};
