import { modularScale } from "polished";

const baseFontSizeInPx = 16;
const fontEnlargementScale = 1.3;
const createScale = (ratio: number, base: number) => (steps: number) =>
  `${modularScale(steps, base, ratio)}px`;

const fontSizeScale = createScale(fontEnlargementScale, baseFontSizeInPx);

export const fontSizeVars = {
  "0x": fontSizeScale(0),
  "1x": fontSizeScale(1),
  "2x": fontSizeScale(2),
  "3x": fontSizeScale(3),
  "4x": fontSizeScale(4),
  "5x": fontSizeScale(5),
};

export const fontVars = {
  primary: "'IBM Plex Sans', system-ui",
  secondary: "'IBM Plex Mono', system-ui",
};
