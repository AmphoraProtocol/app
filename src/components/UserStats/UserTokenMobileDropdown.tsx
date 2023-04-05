import { useState } from 'react';
import {
  ButtonProps,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ClickAwayListener,
} from '@mui/material';

import { useLight } from '~/hooks';
import { EllipsisIcon } from '../icons/misc/EllipsisIcon';
import SVGBox from '../icons/misc/SVGBox';

interface StyledDropdownButton extends ButtonProps {
  text: string;
  img: string;
}

const StyledDropdownButton = (props: StyledDropdownButton) => {
  const { onClick, sx, text, img, href } = props;

  const styles = {
    minWidth: 'auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    columnGap: 1,
    pl: 2,
    pr: 7,
    justifyContent: 'start',
    backgroundColor: 'button.header',
    height: 38,
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: 'button.hover',
    },
    ...sx,
  };

  const content = (
    <>
      <SVGBox svg_name={img} height={15} width={15} />

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

  return (
    <Button sx={styles} onClick={onClick}>
      {content}
    </Button>
  );
};

interface UserTokenMobileDropdownProps {
  onClickDeposit: () => void;
  onClickWithdraw: () => void;
  onClickClaim: () => void;
}

export const UserTokenMobileDropdown = (props: UserTokenMobileDropdownProps) => {
  const isLight = useLight();
  const { onClickDeposit, onClickWithdraw, onClickClaim } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setExpanded(false)}>
      <Accordion
        sx={{
          borderRadius: '10px !important',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: 'button.hover',
          },
        }}
        disableGutters
        TransitionProps={{ unmountOnExit: true }}
        onClick={() => setExpanded(!expanded)}
        expanded={expanded}
      >
        <AccordionSummary
          sx={{
            padding: 1,
            border: isLight ? '1px solid #F4F4F4' : 'none',
            borderRadius: '10px',
            '& .MuiAccordionSummary-content': {
              display: 'flex',
              alignItems: 'center',
              margin: 0,
            },
            height: 32,
            width: 32,
            minHeight: 'auto',
          }}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <EllipsisIcon
            sx={{
              stroke: isLight ? '#374252' : 'white',
              fill: !isLight ? 'white' : '#374252',
              width: 14,
              height: 12,
            }}
          />
        </AccordionSummary>
        <AccordionDetails
          sx={{
            position: 'absolute',
            right: 0,
            mt: 1,
            p: 0,
            width: 'fit-content',
            border: isLight ? '1px solid #F4F4F4' : 'none',
            borderRadius: '10px',
            backgroundColor: 'button.header',
            zIndex: 10,
          }}
        >
          <StyledDropdownButton img='plus_circle' text={`Claim Rewards`} onClick={onClickClaim} />
          <StyledDropdownButton img='plus_circle' text={`Deposit`} onClick={onClickDeposit} />
          <StyledDropdownButton img='minus_circle' text={`Withdraw`} onClick={onClickWithdraw} />
        </AccordionDetails>
      </Accordion>
    </ClickAwayListener>
  );
};
