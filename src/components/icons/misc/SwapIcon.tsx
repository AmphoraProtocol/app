import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

export const SwapIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} fill='transparent' width='42' height='25' viewBox='0 0 42 25'>
      <path
        d='M27.6665 18V6M33.6665 13L27.6665 18L33.6665 13ZM27.6665 18L21.6665 13L27.6665 18Z'
        stroke='#ABBCEE'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M8.05694 11.0575L13.7622 6.04063M13.7622 6.04063L19.5062 11.0237M13.7622 6.04063L13.8086 18.0406'
        stroke='#ABBCEE'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});
