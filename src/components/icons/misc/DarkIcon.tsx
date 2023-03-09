import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

export const DarkIcon = forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} viewBox='0 0 20 20' fill='transparent' height='18px'>
      <path
        d='M18.3541 13.354C16.7173 14.0122 14.9232 14.1748 13.1948 13.8217C11.4663 13.4686 9.87974 12.6153 8.63229 11.3678C7.38484 10.1204 6.53151 8.53381 6.17839 6.80535C5.82527 5.0769 5.98791 3.28277 6.64611 1.646C4.70782 2.42673 3.10148 3.85739 2.10244 5.69272C1.1034 7.52805 0.773906 9.65374 1.17043 11.7054C1.56695 13.757 2.6648 15.6069 4.27577 16.9378C5.88674 18.2687 7.9105 18.9977 10.0001 19C11.797 19.0001 13.5529 18.4624 15.0417 17.4562C16.5305 16.45 17.6841 15.0213 18.3541 13.354Z'
        stroke='#757E8C'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});
