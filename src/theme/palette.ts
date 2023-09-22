import { blue, disabled, formatColor, formatGradient, gradient, green, neutral } from './colors';
import { PaletteMode, ThemeOptions } from '@mui/material';
import { theme } from '../theme';

declare module '@mui/material/styles/createPalette' {
  export interface MuiPaletteOptions {
    footer: {
      background: string;
      color: string;
    };

    smallCard: {
      background: string;
      color: string;
    };

    mobileToolBar: {
      background: string;
    };
  }
}

export const getDesignTokens = (mode: PaletteMode) => {
  const getColor = (lightColor: string, darkColor?: string) =>
    mode === 'light' || darkColor === undefined ? lightColor : darkColor;

  return {
    ...theme,
    palette: {
      mode,
      primary: {
        main: getColor(formatColor(blue.blue1)),
        light: getColor(formatColor(neutral.white), formatColor(neutral.gray7)),
        dark: getColor(formatColor(neutral.gray7), formatColor(neutral.white)),
      },
      secondary: { main: getColor(formatColor(blue.blue2)) },
      success: { main: getColor(formatColor(green.green1)) },
      text: {
        primary: getColor('#374252', formatColor(neutral.white)),
        secondary: '#A3A9BA',
        tertiary: '#748FF1',
        inverse: getColor(formatColor(neutral.white), formatColor(neutral.black)),
      },
      accordion: {
        background: getColor(formatColor(neutral.white), '#1A1A1E'),
        border: getColor('#EBEBEB', '#242424'),
      },
      accordionCard: {
        background: getColor('#F3F3F3', '#151515'),
        border: getColor('#EBEBEB', '#242424'),
      },
      background: {
        default: getColor(`linear-gradient(${formatGradient(gradient.bgDefaultLight)})`, '#121316'),
        overview: getColor(formatColor(neutral.gray5), formatColor(neutral.gray7)),
      },
      banner: {
        general: ' #CDE1FF',
      },
      button: {
        disabled: '#B0B4C2',
        active: getColor(formatColor(neutral.black), formatColor(neutral.white)),
        status: getColor(formatColor(neutral.black), formatColor(neutral.white)),
        sale: getColor('#374252', formatColor(neutral.white)),
        header: getColor(formatColor(neutral.white), '#202020'),
        borrowRepay: getColor(formatColor(neutral.black), formatColor(neutral.white)),
        enableToken: getColor(formatColor(neutral.black), formatColor(neutral.white)),
        claim: '#5E64F4',
        depositWithdraw: '#A3A9BA',
        mintRedeem: '#5E64F4',
        link: '#748FF1',
        app: '#5E64F4',
        vote: '#5E64F4',
        start: '#5E64F4',
        token: '#5E64F4',
        delegate: '#5E64F4',
        skip: '#374252',
        hover: 'rgba(163, 169, 186, 0.2)',
        hoverGray: '#D6D9E0',
      },
      tabs: {
        backgroundSelected: 'rgba(116, 143, 241, 0.1)',
        color: '#8A8A8A',
        colorSelected: '#3F3E96',
      },
      card: {
        background: getColor(formatColor(neutral.white), '#1A1A1E'),
        border: getColor('#EBEBEB', '#242424'),
        list: getColor('#f4f4f4', '#151515'),
      },
      input: {
        background: getColor('#F3F3F3', '#2C2D32'),
        border: {
          active: getColor('#748FF1', '#5E64F4'),
          inactive: getColor('#EBEBEB', '#242424'),
        },
      },
      modal: {
        background: getColor(formatColor(neutral.white), '#121316'),
      },
      slider: {
        background: getColor('#F3F3F3', '#202020'),
        button: formatColor(neutral.white),
        text: {
          active: '#374252',
          inactive: '#A3A9BA',
        },
      },
      mobileToolBar: {
        background: getColor(formatColor(neutral.white), formatColor(neutral.black5)),
      },
      divider: getColor(formatColor(neutral.gray6)),
      footer: {
        background: getColor(formatColor(neutral.white), '#1A1A1E'),
        color: getColor(formatColor(neutral.gray3)),
      },
      smallCard: {
        background: getColor(formatColor(neutral.white), formatColor(neutral.black7)),
        title: getColor(formatColor(neutral.gray3)),
        text: getColor(formatColor(neutral.gray1), formatColor(neutral.white)),
      },
      action: {
        disabledBackground: getColor(formatColor(disabled.disabled1)),
        disabled: getColor(formatColor(neutral.white), formatColor(neutral.black)),
      },
      misc: {
        whiteBlack: getColor(formatColor(neutral.white), formatColor(neutral.black)),
        blackWhite: getColor(formatColor(neutral.black), formatColor(neutral.white)),
      },
    },
  } as ThemeOptions;
};
