import { ComponentPropsWithoutRef, forwardRef } from 'react';
import { LinkProps as ReactLinkProps, Link as ReactLink } from 'react-router-dom';

export interface LinkProps extends ReactLinkProps, Omit<ComponentPropsWithoutRef<'a'>, 'href'> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  let { to, replace, ...anchorProps } = props;
  if (to == undefined) {
    to = '/';
  }

  if (to.toString().startsWith('http')) {
    return <a href={to.toString()} {...anchorProps} style={{ textDecoration: 'none' }}></a>;
  }
  return <ReactLink to={to} replace={replace} {...anchorProps} style={{ textDecoration: 'none' }}></ReactLink>;
});
