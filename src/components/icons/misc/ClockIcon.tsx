import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type ClockIconType = {
  strokecolor?: string;
};

export const ClockIcon = forwardRef<SVGSVGElement, SvgIconProps & ClockIconType>((props, ref) => {
  return (
    <SvgIcon {...props} width='14' height='14' ref={ref} viewBox='0 0 14 14' fill='none'>
      <path
        stroke={props.strokecolor || 'white'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M7.12109 4.58065V7.24731L9.12109 9.24731L7.12109 4.58065ZM13.1211 7.24731C13.1211 8.03525 12.9659 8.81546 12.6644 9.54342C12.3628 10.2714 11.9209 10.9328 11.3637 11.49C10.8066 12.0471 10.1451 12.4891 9.41719 12.7906C8.68924 13.0921 7.90903 13.2473 7.12109 13.2473C6.33316 13.2473 5.55295 13.0921 4.82499 12.7906C4.09704 12.4891 3.4356 12.0471 2.87845 11.49C2.3213 10.9328 1.87934 10.2714 1.57782 9.54342C1.27629 8.81546 1.12109 8.03525 1.12109 7.24731C1.12109 5.65602 1.75323 4.12989 2.87845 3.00467C4.00367 1.87946 5.52979 1.24731 7.12109 1.24731C8.71239 1.24731 10.2385 1.87946 11.3637 3.00467C12.489 4.12989 13.1211 5.65602 13.1211 7.24731Z'
      />
    </SvgIcon>
  );
});

ClockIcon.displayName = 'ClockIcon';
