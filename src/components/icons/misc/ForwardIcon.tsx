import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type ForwardIconType = {
  strokecolor?: string;
};

export const ForwardIcon = forwardRef<SVGSVGElement, SvgIconProps & ForwardIconType>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} width='1' height='13' viewBox='0 0 14 14' fill='none' min-width='10'>
      <path
        d='M8 1.36075L13 6.45359M13 6.45359L8 11.5464M13 6.45359H1'
        stroke='inherit'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});
