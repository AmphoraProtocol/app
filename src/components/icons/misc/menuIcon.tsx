import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

export const MenuIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} width='32' height='32' viewBox='0 0 32 32'>
      <path
        d='M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z'
        fill='inherit'
        fillOpacity='0.17'
      />
      <path
        d='M16 9V9.01V9ZM16 16V16.01V16ZM16 23V23.01V23ZM16 10C15.7348 10 15.4804 9.89464 15.2929 9.70711C15.1054 9.51957 15 9.26522 15 9C15 8.73478 15.1054 8.48043 15.2929 8.29289C15.4804 8.10536 15.7348 8 16 8C16.2652 8 16.5196 8.10536 16.7071 8.29289C16.8946 8.48043 17 8.73478 17 9C17 9.26522 16.8946 9.51957 16.7071 9.70711C16.5196 9.89464 16.2652 10 16 10ZM16 17C15.7348 17 15.4804 16.8946 15.2929 16.7071C15.1054 16.5196 15 16.2652 15 16C15 15.7348 15.1054 15.4804 15.2929 15.2929C15.4804 15.1054 15.7348 15 16 15C16.2652 15 16.5196 15.1054 16.7071 15.2929C16.8946 15.4804 17 15.7348 17 16C17 16.2652 16.8946 16.5196 16.7071 16.7071C16.5196 16.8946 16.2652 17 16 17ZM16 24C15.7348 24 15.4804 23.8946 15.2929 23.7071C15.1054 23.5196 15 23.2652 15 23C15 22.7348 15.1054 22.4804 15.2929 22.2929C15.4804 22.1054 15.7348 22 16 22C16.2652 22 16.5196 22.1054 16.7071 22.2929C16.8946 22.4804 17 22.7348 17 23C17 23.2652 16.8946 23.5196 16.7071 23.7071C16.5196 23.8946 16.2652 24 16 24Z'
        stroke='inherit'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});
