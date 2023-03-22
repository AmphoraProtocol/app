import { Button, ButtonProps } from '@mui/material';
import { useLight } from '~/hooks/useLight';
import { formatColor, neutral } from '~/theme';

export const InverseButton = (props: ButtonProps) => {
  const isLight = useLight();
  const { children, onClick, sx } = props;

  return (
    <Button
      variant='contained'
      sx={{
        backgroundColor: 'primary.dark',
        boxShadow: 0,
        color: isLight ? formatColor(neutral.white) : formatColor(neutral.gray4),
        '&:hover': {
          backgroundColor: isLight ? formatColor(neutral.gray10) : formatColor(neutral.gray3),
        },
        ...sx,
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
