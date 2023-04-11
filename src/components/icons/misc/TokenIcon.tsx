import { Address } from 'wagmi';
import { Box, BoxProps, ResponsiveStyleValue } from '@mui/system';
import { Property } from 'csstype';

interface TokenIconProps extends BoxProps {
  address: Address;
  alt?: string;
  height?: ResponsiveStyleValue<
    Property.Height<string | number> | NonNullable<Property.Height<string | number> | undefined>[] | undefined
  >;
  width?: ResponsiveStyleValue<
    Property.Height<string | number> | NonNullable<Property.Height<string | number> | undefined>[] | undefined
  >;
}

const TokenIcon = ({ address, height = 20, width = 20 }: TokenIconProps) => {
  return (
    <Box
      component='img'
      height={height}
      width={width}
      borderRadius={'100%'}
      margin={0.8}
      src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`}
      onError={(ev: any) => {
        ev.target.src = 'images/default.png';
      }}
    ></Box>
  );
};

export default TokenIcon;
