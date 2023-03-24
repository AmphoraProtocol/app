import { Box, SxProps } from '@mui/system';
import { ReactNode } from 'react';

export interface PageContainerProps {
  children?: ReactNode;
  containerProps?: SxProps;
}

// For use on components/pages with backgrounds that dont have a background that extend the FW

export const PageContainer = (props: PageContainerProps) => {
  const { children, containerProps } = props;

  return (
    <Box
      sx={{
        maxWidth: 'lg',
        marginX: 'auto',
        ...containerProps,
      }}
    >
      {children}
    </Box>
  );
};
