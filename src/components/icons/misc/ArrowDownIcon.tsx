import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type ArrowDownIconType = {
  strokecolor?: string;
};

export const ArrowDownIcon = forwardRef<SVGSVGElement, SvgIconProps & ArrowDownIconType>((props, ref) => {
  return (
    <SvgIcon {...props} width='12' height='14' ref={ref} viewBox='0 0 12 14' fill='none'>
      <path
        d='M6 13L6 1M11 8L6 13L11 8ZM6 13L1 8L6 13Z'
        stroke={props.strokecolor || 'black'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});
