import { useTheme } from '@mui/material';

export const useLight = () => {
  const { palette } = useTheme();

  return palette.mode === 'light';
};
