import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type CloseIconType = {
  islight?: string;
};

export const CloseIcon = forwardRef<SVGSVGElement, SvgIconProps & CloseIconType>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} viewBox='0 0 14 14' fill='transparent' width='15px' height='15px'>
      <path
        d='M1 13L13 1M1 1L13 13'
        stroke={props.islight !== 'false' ? 'black' : 'white'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});

CloseIcon.displayName = 'CloseIcon';
