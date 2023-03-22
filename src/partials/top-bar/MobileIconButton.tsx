import { ButtonProps, Typography, Link, Button } from '@mui/material';
import SVGBox from '~/components/icons/misc/SVGBox';

interface MobileIconButtonProps extends ButtonProps {
  text: string;
  img: string;
}

export const MobileIconButton = (props: MobileIconButtonProps) => {
  const { onClick, sx, text, img, href } = props;

  const styles = {
    minWidth: 'auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    columnGap: 1,
    pl: 0,
    pr: 7,
    justifyContent: 'start',
    height: 28,
    borderRadius: '10px',
    mb: 1,
    '&:hover': {
      backgroundColor: 'button.hover',
    },
    ...sx,
  };

  const content = (
    <>
      <SVGBox svg_name={img} />
      <Typography
        variant='body1'
        whiteSpace='nowrap'
        color='text.primary'
        sx={{
          lineHeight: 1,
        }}
      >
        {text}
      </Typography>
    </>
  );

  return href ? (
    <Link href={href} sx={styles}>
      {content}
    </Link>
  ) : (
    <Button sx={styles} onClick={onClick}>
      {content}
    </Button>
  );
};
