import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

export const LightIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} viewBox='0 0 20 20' fill='transparent' width='18' height='18'>
      <path
        d='M10 1V2V1ZM10 18V19V18ZM19 10H18H19ZM2 10H1H2ZM16.364 16.364L15.657 15.657L16.364 16.364ZM4.343 4.343L3.636 3.636L4.343 4.343ZM16.364 3.636L15.657 4.343L16.364 3.636ZM4.343 15.657L3.636 16.364L4.343 15.657ZM14 10C14 11.0609 13.5786 12.0783 12.8284 12.8284C12.0783 13.5786 11.0609 14 10 14C8.93913 14 7.92172 13.5786 7.17157 12.8284C6.42143 12.0783 6 11.0609 6 10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6C11.0609 6 12.0783 6.42143 12.8284 7.17157C13.5786 7.92172 14 8.93913 14 10V10Z'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        stroke='#757E8C'
      />
    </SvgIcon>
  );
});

LightIcon.displayName = 'LightIcon';
