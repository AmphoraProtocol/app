import { generateSmoothGradient } from './gradient/easing';

export type Color = [number, number, number] | [number, number, number, number];

export type ColorStop = [Color, number];

export interface Gradient {
  angle: number;
  stops: ColorStop[];
}

export const fixAlpha = (c: Color): Color => {
  if (c.length == 3) {
    return [...c, 1];
  }
  return c;
};

export const neutral: { [key: string]: [number, number, number] } = {
  white: [255, 255, 255],
  gray1: [55, 66, 82], // #374252
  gray2: [117, 126, 140], // #757E8C
  gray3: [163, 169, 186], //#A3A9BA
  gray4: [53, 57, 71], //#353947
  gray5: [243, 243, 243], // #F3F3F3
  gray6: [237, 237, 237], // #EDEDED
  gray7: [37, 38, 44], // #25262C
  gray8: [47, 56, 72], // #2F3848
  gray10: [107, 118, 135], // #6B7687
  gray11: [245, 247, 250], // #FBFCFD
  gray12: [176, 180, 194], // #B0B4C2
  black: [0, 0, 0],
  black1: [47, 45, 45], // #2F2D2D
  black5: [10, 11, 12], // #0A0B0C
  black7: [28, 29, 33], // #1C1D21
};

export const blue: { [key: string]: [number, number, number] } = {
  blue1: [116, 143, 241], // #748FF1
  blue2: [5, 45, 255], // #052DFF
  blue10: [188, 197, 233], // #BCC5E9
  blue11: [217, 227, 255], // #D9E3FF
  blue14: [84, 102, 165], // #5466A5
};

export const green: { [key: string]: [number, number, number] } = {
  green1: [80, 214, 109], // #50D66D
  green2: [0, 187, 41], // #00BB29
};

export const disabled: { [key: string]: [number, number, number] } = {
  disabled1: [176, 180, 194], // #B0B4C2
  disabled2: [140, 140, 200],
};

export const pink: { [key: string]: Color } = {
  pink1: [231, 66, 161], // #E742A1
  pink2: [251, 223, 239], // #FBDFEF
  pink3: [73, 65, 74], // #49414A
};

export const gradient: { [key: string]: Gradient } = {
  gradient1: {
    angle: 180,
    stops: [
      [[255, 255, 255], 1],
      [[255, 250, 250, 1], 1],
    ],
  },
  gradient2: {
    angle: 180,
    stops: [
      [[37, 38, 44], 1],
      [[37, 38, 44], 1],
    ],
  },
  gradientPinkBlue: {
    angle: 110,
    stops: [
      [[213, 184, 242], 0],
      [[80, 174, 255], 1],
    ],
  },
  gradientPinkBlue2: {
    angle: 130,
    stops: [
      [[120, 155, 255], 0],
      [[129, 162, 255], 1],
    ],
  },
  bgDefaultLight: {
    angle: 180,
    stops: [
      [[255, 255, 255], 0],
      [[238, 236, 242], 1],
    ],
  },
  bgDefaultDark: {
    angle: 180,
    stops: [
      [[28, 29, 33], 0],
      [[28, 29, 33], 1],
    ],
  },
  cardDefaultLight: {
    angle: 180,
    stops: [
      [[255, 255, 255], 1],
      [[255, 255, 255], 1],
    ],
  },
  cardDefaultDark: {
    angle: 180,
    stops: [
      [[37, 38, 44], 1],
      [[37, 38, 44], 1],
    ],
  },
  statDefaultLight: {
    angle: 180,
    stops: [
      [[255, 255, 255], 1],
      [[255, 250, 250, 1], 1],
    ],
  },
  statDefaultDark: {
    angle: 180,
    stops: [
      [[37, 38, 44], 1],
      [[37, 38, 44], 1],
    ],
  },
  gradientPinkPeach: {
    angle: 90,
    stops: [
      [[139, 170, 170], 0],
      [[174, 139, 156], 1],
    ],
  },
  gradientPurpleGrey: {
    angle: 90,
    stops: [
      [[217, 175, 217], 0],
      [[151, 217, 225], 1],
    ],
  },
  gradientPurpleYellow: {
    angle: 90,
    stops: [
      [[186, 200, 224], 0],
      [[106, 133, 182], 1],
    ],
  },
};

const formatHexChannel = (channel: number) => {
  return Math.max(0, Math.min(255, channel | 0))
    .toString(16)
    .padStart(2, '0');
};

const formatRgbChannel = (channel: number) => {
  return Math.max(0, Math.min(255, channel | 0)).toString();
};

export const formatColor = (color: Color) => {
  switch (color.length) {
    case 3:
      return `#${formatHexChannel(color[0])}${formatHexChannel(color[1])}${formatHexChannel(color[2])}`.toUpperCase();
    case 4:
      return `rgba(${formatRgbChannel(color[0])},${formatRgbChannel(color[1])},${formatRgbChannel(color[2])},${Math.max(
        0,
        Math.min(1, color[3]),
      ).toPrecision(3)})`;
  }
};

export const formatGradient = (gr: Gradient) => {
  const { angle, stops } = generateSmoothGradient(gr);
  const cr = `${angle}deg, ${stops
    .map(([color, position]) => `${formatColor(color)} ${Math.round(position * 100)}%`)
    .join(', ')}`;
  return cr;
};
