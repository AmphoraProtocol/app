import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';
import React from 'react';

export const BackwardGreyIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} viewBox='0 0 35 35' fill='none'>
      <path
        d='M15.6667 23L10.1667 17.5L15.6667 23ZM10.1667 17.5L15.6667 12L10.1667 17.5ZM10.1667 17.5L24.8333 17.5L10.1667 17.5ZM1 17.5C1 15.3332 1.42678 13.1876 2.25599 11.1857C3.08519 9.18385 4.30057 7.36491 5.83274 5.83274C7.3649 4.30057 9.18385 3.08519 11.1857 2.25599C13.1876 1.42678 15.3332 0.999999 17.5 0.999999C19.6668 0.999999 21.8124 1.42678 23.8143 2.25599C25.8161 3.08519 27.6351 4.30057 29.1673 5.83274C30.6994 7.36491 31.9148 9.18385 32.744 11.1857C33.5732 13.1876 34 15.3332 34 17.5C34 21.8761 32.2616 26.0729 29.1673 29.1673C26.0729 32.2616 21.8761 34 17.5 34C13.1239 34 8.92709 32.2616 5.83274 29.1673C2.73839 26.0729 1 21.8761 1 17.5V17.5Z'
        stroke='#AFAFAF'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});
