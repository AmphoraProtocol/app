import React, { useState } from 'react';
import { SwitchProps, Box, Typography, Link } from '@mui/material';
interface BaseSwitchProps extends SwitchProps {
  option1: string | React.ReactElement;
  option2: string | React.ReactElement;
  onOptionChange: (arg0: boolean) => void;
  defaultIsOption1?: boolean;
}

export const BaseSwitch = (props: BaseSwitchProps) => {
  const { option1, option2, onOptionChange, defaultIsOption1 = true } = props;

  const [isOption1, setIsOption1] = useState(defaultIsOption1);

  const longerLength =
    typeof option1 === 'string' && typeof option2 === 'string'
      ? option1.length > option2.length
        ? option1.length
        : option2.length
      : 3.5;

  const calculateWidth = () => `${longerLength * 12}px`;

  const calculateContainerWidth = () => `${longerLength * 24 + 12}px`;

  const OptionBox = ({ option, isSelected }: { option: string | React.ReactElement; isSelected: boolean }) => (
    <Box
      sx={{
        width: calculateWidth(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {typeof option === 'string' ? (
        <Typography
          variant='label'
          sx={{
            color: isSelected ? 'slider.text.active' : 'slider.text.inactive',
            display: 'flex',
            zIndex: 10,
            alignItems: 'center',
          }}
        >
          {option}
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            maxHeight: 15,
            maxWidth: 15,
            position: 'relative',
            zIndex: 10,
          }}
        >
          {option}
        </Box>
      )}
    </Box>
  );

  const toggleHandler = () => {
    // setIsOption1(!isOption1);
    // onOptionChange(!isOption1);
  };

  return (
    <Box
      sx={{
        width: calculateContainerWidth(),
        backgroundColor: 'slider.background',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        textAlign: 'center',
        position: 'relative',
        height: '48px',
        paddingX: '6px',
        cursor: 'pointer',
      }}
      onClick={toggleHandler}
    >
      <OptionBox option={option1} isSelected={isOption1} />
      <Link
        href='https://www.tally.xyz/'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        target='_blank'
      >
        <OptionBox option={option2} isSelected={!isOption1} />
      </Link>

      <Box
        className={isOption1 ? 'option1' : 'option2'}
        sx={{
          width: calculateWidth(),
          backgroundColor: 'slider.button',
          borderRadius: 2,
          height: '36px',
          marginY: '6px',
          position: 'absolute',
          animationName: 'slide',
          animationDuration: '1s',
          transition: '.4s',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '&.option2': {
            transform: 'translateX(100%)',
          },
          '& path': {
            stroke: 'black',
          },
        }}
      >
        <Typography
          variant='label'
          sx={{
            display: 'flex',
            alignItems: 'center',
            color: 'slider.text.active',
          }}
        ></Typography>
      </Box>
    </Box>
  );
};
