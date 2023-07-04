import {
  createTheme,
  createThemeContract,
  createGlobalTheme,
} from "@vanilla-extract/css";
import { blue, blueDark, sand, sandDark } from "@radix-ui/colors";
import { fontSizeVars, fontVars } from "./typography";

const root = createGlobalTheme(":root", {
  space: {
    small: "4px",
    medium: "8px",
    large: "16px",
    xlarge: "24px",
  },
  lineHeights: {
    small: "24px",
    medium: "28px",
    large: "40px",
  },
  fonts: fontVars,
  fontSize: fontSizeVars,
});

const colors = createThemeContract({
  background: null,
  backgroundOpaque: null,
  card: null,
  text: null,
  textSecondary: null,
  link: null,
  border: null,
  code: null,
});

export const lightTheme = createTheme(colors, {
  background: sand.sand1,
  backgroundOpaque: "rgba(253, 253, 253, 0.9)",
  card: sand.sand4,
  text: sand.sand12,
  textSecondary: sand.sand11,
  link: blue.blue11,
  border: sand.sand5,
  code: sand.sand12,
});

export const darkTheme = createTheme(colors, {
  background: sandDark.sand1,
  backgroundOpaque: "rgba(22,22, 21, 0.9)",
  card: sandDark.sand5,
  text: sandDark.sand12,
  textSecondary: sandDark.sand11,
  link: blueDark.blue11,
  border: sandDark.sand4,
  code: sandDark.sand3,
});

export const vars = { ...root, colors };
