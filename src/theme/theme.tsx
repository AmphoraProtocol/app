import { blue, formatColor, neutral } from './colors';
import { ComponentsVariants } from '@mui/material';
import { createTheme } from '@mui/material/styles';

const HTML_FONT_SIZE = 16;
const PX_TO_REM = 1 / HTML_FONT_SIZE;

const pxToRem = (px: number) => {
  return `${px * PX_TO_REM}rem`;
};

const fzTolineHeight = (px: number) => {
  return pxToRem(px / 0.8262024196);
};

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    cta: true;
  }
}

declare module '@mui/material/styles' {
  interface TypographyVariants {
    h6_midi: React.CSSProperties;
    h6_semi: React.CSSProperties;
    h7: React.CSSProperties;
    h7_semi: React.CSSProperties;
    h8: React.CSSProperties;
    body2_semi: React.CSSProperties;
    body3: React.CSSProperties;
    body3_medium: React.CSSProperties;
    label: React.CSSProperties;
    label_semi: React.CSSProperties;
    label2_medium: React.CSSProperties;
    label2_light: React.CSSProperties;
  }

  interface BreakpointOverrides {
    xsm: true;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h6_midi: true;
    h6_semi: true;
    h7: true;
    h7_semi: true;
    h8: true;
    body2_semi: true;
    body3: true;
    body3_medium: true;
    label: true;
    label_semi: true;
    label2_medium: true;
    label2_light: true;
  }
}

export const theme = createTheme({
  shape: {
    borderRadius: 4,
  },
  typography: {
    htmlFontSize: HTML_FONT_SIZE,
    fontFamily: ['Inter', 'sans-serif'].join(),
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    allVariants: {
      letterSpacing: 0,
      fontWeight: 400,
      textTransform: 'none',
    },

    overline: {
      fontWeight: 600,
      fontSize: pxToRem(10),
      lineHeight: pxToRem(16),
      textTransform: 'uppercase',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      xsm: 640,
      sm: 768,
      md: 800,
      lg: 1280,
      xl: 1440,
    },
  },
});

// Responsive typography

//figma title 1
theme.typography.h1 = {
  fontWeight: 800,
  fontSize: pxToRem(88),
  letterSpacing: -1,
  lineHeight: fzTolineHeight(90),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(40),
    lineHeight: fzTolineHeight(42),
  },
};

// figma title 2
theme.typography.h2 = {
  fontWeight: 800,
  fontSize: pxToRem(54),
  letterSpacing: -1,
  lineHeight: fzTolineHeight(56),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(28),
    lineHeight: fzTolineHeight(32),
  },
};

// figma title 3
theme.typography.h3 = {
  fontWeight: 800,
  fontSize: pxToRem(48),
  lineHeight: fzTolineHeight(50),
  letterSpacing: -1,
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(28),
    lineHeight: fzTolineHeight(32),
  },
};

// figma title 4
theme.typography.h4 = {
  fontWeight: 700,
  fontSize: pxToRem(40),
  lineHeight: fzTolineHeight(46),
  letterSpacing: -1,
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(24),
    lineHeight: fzTolineHeight(28),
  },
};

// figma title 5
theme.typography.h5 = {
  fontWeight: 700,
  fontSize: pxToRem(28),
  lineHeight: fzTolineHeight(28),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(24),
    lineHeight: fzTolineHeight(28),
  },
};

// figma title 6
theme.typography.h6 = {
  fontWeight: 800,
  fontSize: pxToRem(24),
  lineHeight: fzTolineHeight(28),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(20),
    lineHeight: fzTolineHeight(22),
  },
};

// figma title 6 midi
theme.typography.h6_midi = {
  fontWeight: 700,
  fontSize: pxToRem(24),
  lineHeight: fzTolineHeight(28),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(20),
    lineHeight: fzTolineHeight(22),
  },
};

theme.typography.h6_semi = {
  fontWeight: 600,
  fontSize: pxToRem(24),
  lineHeight: fzTolineHeight(28),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(20),
    lineHeight: fzTolineHeight(22),
  },
};

// figma title 7
theme.typography.h7 = {
  fontWeight: 700,
  fontSize: pxToRem(20),
  lineHeight: fzTolineHeight(22),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(18),
    lineHeight: fzTolineHeight(22),
  },
};

// figma title 7
theme.typography.h7_semi = {
  fontWeight: 600,
  fontSize: pxToRem(20),
  lineHeight: fzTolineHeight(22),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(18),
    lineHeight: fzTolineHeight(22),
  },
};

// figma title 8
theme.typography.h8 = {
  fontWeight: 600,
  fontSize: pxToRem(18),
  lineHeight: fzTolineHeight(20),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(14),
    lineHeight: fzTolineHeight(16),
  },
};

theme.typography.subtitle1 = {
  fontWeight: 700,
  fontSize: pxToRem(26),
  lineHeight: fzTolineHeight(24),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(20),
    lineHeight: fzTolineHeight(20),
  },
};

theme.typography.subtitle2 = {
  fontWeight: 600,
  fontSize: pxToRem(24),
  lineHeight: fzTolineHeight(24),
  color: theme.palette.text.primary,
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(20),
    lineHeight: fzTolineHeight(20),
  },
};

// figma body
theme.typography.body1 = {
  fontWeight: 600,
  fontSize: pxToRem(16),
  lineHeight: fzTolineHeight(18),
};

// figma body semi
theme.typography.body2 = {
  fontWeight: 400,
  fontSize: pxToRem(16),
  lineHeight: fzTolineHeight(20),
  [theme.breakpoints.down('md')]: {
    lineHeight: fzTolineHeight(18),
  },
};

theme.typography.body2_semi = {
  fontWeight: 600,
  fontSize: pxToRem(18),
  lineHeight: fzTolineHeight(32),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(14),
    lineHeight: fzTolineHeight(24),
  },
};

// figma body tall
theme.typography.body3 = {
  fontWeight: 400,
  fontSize: pxToRem(16),
  lineHeight: fzTolineHeight(24),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(16),
    lineHeight: fzTolineHeight(18),
  },
};

theme.typography.body3_medium = {
  fontWeight: 500,
  fontSize: pxToRem(16),
  lineHeight: fzTolineHeight(16),
};

theme.typography.label = {
  fontWeight: 600,
  fontSize: pxToRem(14),
  lineHeight: fzTolineHeight(16),
};

theme.typography.label_semi = {
  fontWeight: 400,
  fontSize: pxToRem(14),
  lineHeight: fzTolineHeight(16),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(12),
    lineHeight: fzTolineHeight(14),
  },
};

theme.typography.label2_medium = {
  fontWeight: 500,
  fontSize: pxToRem(14),
  lineHeight: fzTolineHeight(16),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(12),
    lineHeight: fzTolineHeight(16),
  },
};

theme.typography.label2_light = {
  fontWeight: 400,
  fontSize: pxToRem(14),
  lineHeight: fzTolineHeight(16),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(12),
    lineHeight: fzTolineHeight(16),
  },
};

theme.typography.button = {
  fontWeight: 600,
  fontSize: pxToRem(16),
  lineHeight: pxToRem(16),
  [theme.breakpoints.down('md')]: {
    fontSize: pxToRem(12),
    lineHeight: fzTolineHeight(12),
  },
};

const MuiTextFieldVariants: ComponentsVariants['MuiTextField'] = [
  {
    props: { variant: 'filled' },
    style: {
      label: {
        transform: 'translate(0, -8px)', // remove 0.75 scaling
      },
      input: {
        textDecorationLine: 'none',
        backgroundColor: formatColor(neutral.white),
        borderColor: 'transparent',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: 8,
        fontSize: pxToRem(18),
        padding: `${pxToRem(8)} ${pxToRem(24)}`,
        '&:hover': {
          backgroundColor: formatColor(neutral.white),
        },
        '&:focus': {
          borderColor: formatColor(neutral.white),
        },
        [theme.breakpoints.down('md')]: {
          fontSize: pxToRem(16),
          lineHeight: pxToRem(28.51),
        },
      },
    },
  },
];

theme.components = {
  MuiButtonBase: {
    styleOverrides: {},
  },
  MuiButton: {
    styleOverrides: {
      root: {
        height: 48,
        borderRadius: 8,
      },
    },
    variants: [
      {
        props: { variant: 'text' },
        style: {
          width: '100%',
        },
      },
      {
        props: { variant: 'cta' },
        style: {
          backgroundColor: formatColor(blue.blue1),
          '&:hover': {
            backgroundColor: formatColor(blue.blue14),
          },
        },
      },
      {
        props: { variant: 'contained' },
        style: {
          '&:hover': {
            backgroundColor: '#E8E9EE',
            color: '#374252',
          },
        },
      },
      {
        props: { variant: 'outlined' },
        style: {
          backgroundColor: formatColor(neutral.white),
          color: formatColor(neutral.black),
          width: '100%',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.03)',
          padding: '16px 20px',
          borderRadius: 10,
          border: 'none',
          '&:hover': {
            backgroundColor: formatColor(neutral.gray5),

            border: 'none',
          },
        },
      },
    ],
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '&:hover': {
          borderColor: formatColor(neutral.white),
          backgroundColor: formatColor(neutral.white),
        },
        '&.Mui-focused': {
          backgroundColor: formatColor(neutral.white),
        },
        '&:before': {
          borderBottom: 'none !important',
          '&:hover': {
            borderBottom: 'none',
          },
        },
      },
      input: {
        ':hover': {
          backgroundColor: formatColor(neutral.white),
        },
        ':focus': {
          borderColor: formatColor(neutral.white),
        },
      },
    },
  },
  MuiLink: {
    defaultProps: {
      underline: 'none',
    },
    styleOverrides: {
      root: {
        '&:hover': {},
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: 16,
        lineHeight: 1.2,
      },
    },
  },
  MuiTextField: {
    variants: MuiTextFieldVariants,
    defaultProps: {
      InputLabelProps: {
        shrink: true,
      },
      InputProps: {
        disableUnderline: true,
      },
    },
    styleOverrides: {
      root: {},
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      root: {
        height: '100%',
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        fontSize: pxToRem(20),
        fontWeight: 500,
        [theme.breakpoints.down('md')]: {
          fontSize: pxToRem(18),
        },
      },
    },
  },
  MuiSvgIcon: {
    styleOverrides: {
      root: {
        fill: 'transparent',
        height: '100%',
        width: '100%',
      },
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      determinate: {
        borderRadius: 16,
        height: 80,
        '.MuiCircularProgress-circle': {
          backgroundColor: 'white',
        },
      },
    },
  },
  MuiAccordion: {
    styleOverrides: {
      gutters: 2,
      root: {
        borderRadius: 10,
        '&::before': {
          display: 'none',
        },
      },
    },
  },
};
