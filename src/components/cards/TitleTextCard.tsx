import {
  Button,
  Card,
  CardContent,
  CardProps,
  Link as MuiLink,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { SxProps } from '@mui/system';
import { FC } from 'react';

import { Link } from '../link';

export interface TitleTextCardContainer extends CardProps {
  title: string;
  caption: string;
  linkHref?: string;
  linkTitle?: string;
  titleProps?: any;
  cardBGColor?: string;
  captionProps?: any;
}

export const TitleTextCard: FC<TitleTextCardContainer> = (props) => {
  const { title, caption, linkHref, linkTitle, titleProps, cardBGColor = 'background.default', captionProps } = props;

  return (
    <Card
      sx={{
        boxShadow: 'none',
        ...props.sx,
      }}
    >
      <CardContent
        sx={{
          backgroundColor: cardBGColor,
        }}
      >
        <Typography variant='h2' sx={{ mb: 2 }} {...titleProps}>
          {title}
        </Typography>
        <Typography variant='subtitle2' color='text.textCardCaption' {...captionProps}>
          {caption}
        </Typography>

        {linkHref && (
          <MuiLink component={Link} to={linkHref}>
            <Button size='medium' color='secondary' variant='text'>
              <Typography variant='subtitle1'>{linkTitle}</Typography>
            </Button>
          </MuiLink>
        )}
      </CardContent>
    </Card>
  );
};
