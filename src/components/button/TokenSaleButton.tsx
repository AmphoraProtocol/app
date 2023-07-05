import { Button, Typography } from '@mui/material';
import { useLight } from '~/hooks';
import { StarIcon } from '../icons/misc/StarIcon';
import { Link } from '../link';

export const TokenSaleButton = () => {
  const isLight = useLight();
  const color = isLight ? '#5E64F4' : 'white';
  return (
    <Link to='/sale'>
      <Button
        sx={{
          borderColor: color,
          borderWidth: 1,
          borderStyle: 'solid',
          width: 'fit-content',
          px: 2,
          '&:hover': {
            backgroundColor: 'button.hover',
          },
        }}
      >
        <StarIcon stroke={color} sx={{ width: 22, height: 22, mr: 1 }} />
        <Typography whiteSpace='nowrap' variant='label' color={color}>
          Token Sale
        </Typography>
      </Button>
    </Link>
  );
};
