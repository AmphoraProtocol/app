import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type CopyIconType = {
  islight?: string;
};

export const CopyIcon = forwardRef<SVGSVGElement, SvgIconProps & CopyIconType>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} viewBox='0 0 19 19' fill='transparent'>
      <path
        d='M5.20331 13.4683H3.20182C2.67099 13.4683 2.1619 13.254 1.78654 12.8727C1.41119 12.4914 1.20032 11.9741 1.20032 11.4348V3.30103C1.20032 2.76172 1.41119 2.24451 1.78654 1.86316C2.1619 1.48182 2.67099 1.26758 3.20182 1.26758H11.2078C11.7386 1.26758 12.2477 1.48182 12.6231 1.86316C12.9984 2.24451 13.2093 4.28681 13.2093 4.82612M7.20481 17.5352H15.2108C15.7416 17.5352 16.2507 17.3209 16.6261 16.9396C17.0014 16.5583 17.2123 16.041 17.2123 15.5017V7.36793C17.2123 6.82862 17.0014 6.31141 16.6261 5.93006C16.2507 5.54872 15.7416 5.33448 15.2108 5.33448H7.20481C6.67398 5.33448 6.16489 5.54872 5.78954 5.93006C5.41419 6.31141 5.20331 6.82862 5.20331 7.36793V15.5017C5.20331 16.041 5.41419 16.5583 5.78954 16.9396C6.16489 17.3209 6.67398 17.5352 7.20481 17.5352Z'
        stroke={props.islight !== 'false' ? 'black' : 'white'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});

CopyIcon.displayName = 'CopyIcon';
