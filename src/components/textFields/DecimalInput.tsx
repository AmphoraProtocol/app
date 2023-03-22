import { TextField, InputAdornment } from '@mui/material';
import { ReactElement, ReactNode } from 'react';
import { useLight } from '~/hooks/useLight';
import { formatColor, neutral } from '~/theme';

const decimalRegexp = /^\d*(?:[.])?\d*$/;
const decimalEnforcer = (nextUserInput: string) => {
  if (nextUserInput === '' || nextUserInput === '0') {
    return '';
  } else if (nextUserInput === '.') {
    return '0.';
  } else if (decimalRegexp.test(nextUserInput)) {
    return nextUserInput;
  }
  return nextUserInput.slice(0, -1);
};

interface DecimalInputProps {
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
  onFocus?: () => void;
  onBlur?: () => void;
  isMoneyValue?: boolean;
  useLargerFont?: boolean;
  startAdornment?: ReactNode;
}

export const DecimalInput = (props: DecimalInputProps) => {
  const {
    onChange,
    placeholder,
    value,
    onFocus,
    onBlur,
    isMoneyValue = false,
    useLargerFont = false,
    startAdornment,
  } = props;

  const isLight = useLight();

  return (
    <TextField
      onFocus={onFocus}
      onBlur={onBlur}
      variant='standard'
      value={value}
      placeholder={placeholder || '0.0'}
      onChange={(e) => {
        onChange(decimalEnforcer(e.target.value));
      }}
      InputProps={{
        startAdornment: startAdornment ? (
          startAdornment
        ) : isMoneyValue ? (
          <InputAdornment sx={{ marginBottom: { xs: 0, md: 0.5 } }} position='start'>
            $
          </InputAdornment>
        ) : (
          false
        ),
        sx: {
          '&:before, &:after': {
            borderBottom: 'none !important',
          },
        },
      }}
      sx={{
        width: '100%',
        paddingBottom: '4px',
        '.MuiInputBase-input': {
          fontWeight: useLargerFont ? 600 : 700,
          color: isLight ? formatColor(neutral.gray1) : formatColor(neutral.white),

          fontSize: useLargerFont ? { xs: 20, md: 24 } : 16,
        },
      }}
    />
  );
};
