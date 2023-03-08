import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type ArrowUpIconType = {
  strokecolor?: string;
};

export const ArrowUpIcon = forwardRef<SVGSVGElement, SvgIconProps & ArrowUpIconType>((props, ref) => {
  return (
    <SvgIcon {...props} width='12' height='14' ref={ref} viewBox='0 0 12 14' fill='none'>
      <path
        d='M6 1V13M1 6L6 1L1 6ZM6 1L11 6L6 1Z'
        stroke={props.strokecolor || 'black'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});
