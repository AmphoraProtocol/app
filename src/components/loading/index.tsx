import { CircularProgress, LinearProgress } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';

export const ProgressLine = () => {
  return <LinearProgress color='secondary' />;
};

export const Spinner = () => {
  return <CircularProgress color='secondary' />;
};

export const Dots = () => {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setStage(stage > 3 ? 0 : stage + 1);
    }, 1000);
  }, [stage]);

  return <span>{'.'.repeat(stage + 1)}</span>;
};

export const Loads = (props: { def: any; val: any; children?: ReactNode }) => {
  const { val, def, children } = props;
  if (val) {
    return children ? children : val;
  }
  return def;
};

export const WithSpinner = (props: { val: any; children?: ReactNode }) => {
  return Loads({ def: Spinner(), ...props });
};

export const WithDots = (props: { val: any; children?: ReactNode }) => {
  return Loads({ def: Dots(), ...props });
};
