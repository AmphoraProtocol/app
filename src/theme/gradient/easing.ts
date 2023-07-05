import { ColorStop, fixAlpha, Gradient } from '../colors';
import * as chroma from 'chroma.ts';

export const getBezier = (t: number, n1: number, n2: number): number => {
  return (
    (1 - t) * (1 - t) * (1 - t) * 0 + 3 * ((1 - t) * (1 - t)) * t * n1 + 3 * (1 - t) * (t * t) * n2 + t * t * t * 1
  );
};

export const cubicCoordinates = (x1: number, y1: number, x2: number, y2: number, polySteps = 10): ICoordinate[] => {
  const increment = 1 / polySteps;
  const coordinates = [];
  for (let i = 0; i <= 1; i += increment) {
    coordinates.push({
      x: getBezier(i, x1, x2),
      y: getBezier(i, y1, y2),
    });
  }
  const roundedCoordinates = coordinates.map((obj: ICoordinate) => getCoordinate(obj.x, obj.y));
  return roundedCoordinates;
};

export interface ICoordinate {
  x: number;
  y: number;
}

export const getCoordinate = (x: number, y: number): ICoordinate => {
  return {
    x: Math.round(x * 1e10) / 1e10,
    y: Math.round(y * 1e10) / 1e10,
  };
};

export const generateSmoothGradient = (g: Gradient): Gradient => {
  const stops: ColorStop[] = [];
  g.stops.reduce((a, b) => {
    stops.push(...generateStopsBetween(a, b));
    return b;
  });
  return {
    angle: g.angle,
    stops: stops,
  };
};

export const generateStopsBetween = (a: ColorStop, b: ColorStop): ColorStop[] => {
  const stops: ColorStop[] = [];
  const curve = cubicCoordinates(0.4, a[1], 0.6, b[1], 10);
  const scalar = (b[1] - a[1]) / 1;
  curve.forEach((coord) => {
    const amt = coord.y;
    const perc = coord.x;
    const color = chroma.mix(fixAlpha(a[0]), fixAlpha(b[0]), amt, 'hsl').rgba();
    stops.push([color, Math.round(scalar * perc * 100) / 100 + a[1]]);
  });
  return stops;
};
