import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type CircleExclamationIconType = {
  strokecolor?: string;
};

export const CircleExclamationIcon = forwardRef<SVGSVGElement, SvgIconProps & CircleExclamationIconType>(
  (props, ref) => {
    return (
      <SvgIcon {...props} ref={ref} width='64' height='58' viewBox='0 0 64 58' fill='none'>
        <path
          d='M32.0001 22V28.6667M32.0001 42H32.0334M8.9061 55.3333H55.0941C60.2261 55.3333 63.4336 49.7778 60.8676 45.3333L37.7736 5.33333C35.2076 0.888889 28.7926 0.888889 26.2266 5.33333L3.1326 45.3333C0.566601 49.7778 3.7741 55.3333 8.9061 55.3333Z'
          stroke={props.strokecolor || 'black'}
          strokeWidth='4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </SvgIcon>
    );
  },
);
