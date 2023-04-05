import { Box, BoxProps, ResponsiveStyleValue } from '@mui/system';
import { Property } from 'csstype';

interface SVGBoxProps extends BoxProps {
  svg_name: string;
  alt?: string;
  height?: ResponsiveStyleValue<
    Property.Height<string | number> | NonNullable<Property.Height<string | number> | undefined>[] | undefined
  >;
  width?: ResponsiveStyleValue<
    Property.Height<string | number> | NonNullable<Property.Height<string | number> | undefined>[] | undefined
  >;
}

const SVGBox = ({ sx, svg_name, height = 20, width = 20, alt = 'image' }: SVGBoxProps) => {
  return (
    <Box
      component='img'
      height={height}
      width={width}
      src={`images/${svg_name}.svg`}
      alt={alt}
      sx={{ ...sx }}
      onError={(ev: any) => {
        ev.target.src = 'images/default.png';
      }}
    ></Box>
  );
};

export default SVGBox;
