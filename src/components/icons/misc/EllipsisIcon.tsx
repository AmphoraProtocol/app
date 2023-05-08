import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

export const EllipsisIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} width='16' height='4' viewBox='-2 0 20 4'>
      <path
        d='M4 2C4 3.10457 3.10457 4 2 4C0.895431 4 0 3.10457 0 2C0 0.895431 0.895431 0 2 0C3.10457 0 4 0.895431 4 2Z'
        fill='inherit'
      />
      <path
        d='M10 2C10 3.10457 9.10457 4 8 4C6.89543 4 6 3.10457 6 2C6 0.895431 6.89543 0 8 0C9.10457 0 10 0.895431 10 2Z'
        fill='inherit'
      />
      <path
        d='M14 4C15.1046 4 16 3.10457 16 2C16 0.895431 15.1046 0 14 0C12.8954 0 12 0.895431 12 2C12 3.10457 12.8954 4 14 4Z'
        fill='inherit'
      />
    </SvgIcon>
  );
});

EllipsisIcon.displayName = 'EllipsisIcon';
