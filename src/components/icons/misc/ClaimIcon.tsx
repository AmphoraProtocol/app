import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type ClaimIconType = {
  islight?: string;
};

export const ClaimIcon = forwardRef<SVGSVGElement, SvgIconProps & ClaimIconType>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} fill='transparent' width='37' height='35' viewBox='0 0 37 35'>
      <path
        d='M20.983 9.48957C21.0175 9.32957 20.9976 9.16277 20.9264 9.01512C20.8552 8.86746 20.7368 8.7472 20.5894 8.67305C20.4421 8.59889 20.2741 8.57499 20.1117 8.60505C19.9492 8.63511 19.8013 8.71745 19.691 8.83928L11.191 18.2423C11.0945 18.3491 11.0312 18.4813 11.0089 18.6229C10.9867 18.7645 11.0062 18.9095 11.0653 19.0403C11.1244 19.1711 11.2205 19.2822 11.342 19.3601C11.4635 19.4381 11.6052 19.4796 11.75 19.4796H18.322L17.017 25.5104C16.9825 25.6704 17.0024 25.8372 17.0736 25.9849C17.1447 26.1325 17.2632 26.2528 17.4105 26.3269C17.5579 26.4011 17.7258 26.425 17.8883 26.3949C18.0508 26.3649 18.1987 26.2825 18.309 26.1607L26.809 16.7576C26.9055 16.6508 26.9687 16.5187 26.991 16.3771C27.0133 16.2355 26.9937 16.0905 26.9346 15.9597C26.8755 15.8289 26.7794 15.7178 26.6579 15.6398C26.5364 15.5619 26.3948 15.5204 26.25 15.5204H19.678L20.983 9.48957Z'
        fill='#A3A9BA'
      />
      <rect x='0.5' y='1.17346' width='36' height='32.6531' rx='6.5' stroke='url(#paint0_linear_1310_7928)' />
      <defs>
        <linearGradient
          id='paint0_linear_1310_7928'
          x1='18.5'
          y1='0.673462'
          x2='18.5'
          y2='34.3265'
          gradientUnits='userSpaceOnUse'
        >
          <stop stopColor='#748FF1' />
          <stop offset='0.465557' stopColor='#4E70EB' />
          <stop offset='1' stopColor='#224DE4' />
        </linearGradient>
      </defs>
    </SvgIcon>
  );
});
