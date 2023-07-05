import { SvgIcon, SvgIconProps } from '@mui/material';
import { forwardRef } from 'react';

type ToolTipInfoIconType = {
  strokecolor?: string;
};

export const ToolTipInfoIcon = forwardRef<SVGSVGElement, SvgIconProps & ToolTipInfoIconType>((props, ref) => {
  return (
    <SvgIcon {...props} ref={ref} width='18' height='19' viewBox='0 0 18 19' fill='none'>
      <path
        d='M9.83333 13H9V9.5H8.16667L9.83333 13ZM9 6H9.00833H9ZM16.5 9.5C16.5 10.5342 16.306 11.5582 15.9291 12.5136C15.5522 13.4691 14.9997 14.3372 14.3033 15.0685C13.6069 15.7997 12.7801 16.3798 11.8701 16.7756C10.9602 17.1713 9.98491 17.375 9 17.375C8.01509 17.375 7.03982 17.1713 6.12987 16.7756C5.21993 16.3798 4.39314 15.7997 3.6967 15.0685C3.00026 14.3372 2.44781 13.4691 2.0709 12.5136C1.69399 11.5582 1.5 10.5342 1.5 9.5C1.5 7.41142 2.29018 5.40838 3.6967 3.93153C5.10322 2.45469 7.01088 1.625 9 1.625C10.9891 1.625 12.8968 2.45469 14.3033 3.93153C15.7098 5.40838 16.5 7.41142 16.5 9.5Z'
        stroke={props.strokecolor || 'black'}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </SvgIcon>
  );
});

ToolTipInfoIcon.displayName = 'ToolTipInfoIcon';
