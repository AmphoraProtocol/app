import { Box, BoxProps } from '@mui/material';

import { useLight } from '~/hooks/useLight';
import { formatColor, blue, neutral } from '~/theme';

interface ModalInputContainerProps extends BoxProps {
  focus: boolean;
}

export const ModalInputContainer = (props: ModalInputContainerProps) => {
  const { children, focus } = props;

  const isLight = useLight();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: isLight ? formatColor(neutral.gray5) : '#1C1d21',
        paddingTop: 1,
        paddingBottom: 0,
        paddingX: 2,
        borderRadius: 2,
        boxShadow: '0px 4px 4px 0px rgba(0,0,0, 0.05)',
        border: focus
          ? `1px solid ${formatColor(blue.blue1)}`
          : isLight
          ? `1px solid ${formatColor(blue.blue11)}`
          : `1px solid ${formatColor(neutral.gray4)}`,
        outline: focus ? `1px solid ${formatColor(blue.blue1)}` : 'none',
        '&:hover': {
          backgroundColor: isLight ? formatColor(neutral.gray6) : formatColor(neutral.gray4),
        },
      }}
    >
      {children}
    </Box>
  );
};
