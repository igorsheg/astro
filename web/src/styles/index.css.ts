import {
  createTheme,
  createThemeContract,
  createGlobalTheme,
} from "@vanilla-extract/css";
import {
  blue,
  blueDark,
  sand,
  sandDark,
  green,
  greenDark,
  red,
  redDark,
  blackA,
  whiteA,
  orange,
  orangeDark,
} from "@radix-ui/colors";
import { fontFamily, typography } from "./typography";

const root = createGlobalTheme(":root", {
  spacing: {
    s1: "0.25rem", // 4px
    s2: "0.5rem", // 8px
    s3: "0.75rem", // 12px
    s4: "1rem", // 16px
    s5: "1.25rem", // 20px
    s6: "1.5rem", // 24px
    s7: "2rem", // 32px
    s8: "2.5rem", // 40px
    s9: "3rem", // 48px
    s10: "4rem", // 64px
    s11: "5rem", // 80px
    s12: "6rem", // 96px
    s13: "8rem", // 128px
    s14: "10rem", // 160px
    s15: "12rem", // 192px
    s16: "14rem", // 224px
    s17: "16rem", // 256px
  },
  typography: typography,
  fonts: fontFamily,
  shadows: {
    xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
    sm: "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
    md: "0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)",
    lg: "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
    xl: "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
    "2xl": "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
    "3xl": "0px 32px 64px -12px rgba(16, 24, 40, 0.14)",
  },
  colorVars: {
    d1: sand.sand1,
    d2: sand.sand2,
    d3: sand.sand3,
    d4: sand.sand4,
    d5: sand.sand5,
    d6: sand.sand6,
    d7: sand.sand7,
    d8: sand.sand8,
    d9: sand.sand9,
    d10: sand.sand10,
    d11: sand.sand11,
    d12: sand.sand12,

    a1: orange.orange1,
    a2: orange.orange2,
    a3: orange.orange3,
    a4: orange.orange4,
    a5: orange.orange5,
    a6: orange.orange6,
    a7: orange.orange7,
    a8: orange.orange8,
    a9: orange.orange9,
    a10: orange.orange10,
    a11: orange.orange11,
    a12: orange.orange12,
  },
});

const colors = createThemeContract({
  background: null,
  accent: null,
  foregorund: null,
  backgroundOpaque: null,
  card: null,
  text: null,
  textSecondary: null,
  link: null,
  border: null,
  code: null,
  sucess: null,
  danger: null,
  glass: null,
  d1: null,
  d2: null,
  d3: null,
  d4: null,
  d5: null,
  d6: null,
  d7: null,
  d8: null,
  d9: null,
  d10: null,
  d11: null,
  d12: null,
});

export const lightTheme = createTheme(colors, {
  background: sand.sand3,
  accent: orange.orange9,
  foregorund: sand.sand1,
  backgroundOpaque: whiteA.whiteA9,
  card: sand.sand4,
  text: sand.sand12,
  textSecondary: sand.sand11,
  link: blue.blue11,
  border: sand.sand5,
  code: sand.sand12,
  sucess: green.green9,
  danger: red.red9,
  glass: "rgba(253, 253, 253, 0.3)", // Adjust opacity as needed
  d1: sand.sand1,
  d2: sand.sand2,
  d3: sand.sand3,
  d4: sand.sand4,
  d5: sand.sand5,
  d6: sand.sand6,
  d7: sand.sand7,
  d8: sand.sand8,
  d9: sand.sand9,
  d10: sand.sand10,
  d11: sand.sand11,
  d12: sand.sand12,
});

export const darkTheme = createTheme(colors, {
  background: sandDark.sand1,
  foregorund: sandDark.sand2,
  accent: orangeDark.orange9,
  backgroundOpaque: blackA.blackA9,
  card: sandDark.sand5,
  text: sandDark.sand12,
  textSecondary: sandDark.sand11,
  link: blueDark.blue11,
  border: sandDark.sand4,
  code: sandDark.sand3,
  sucess: greenDark.green9,
  danger: redDark.red9,
  glass: "rgba(22, 22, 21, 0.3)",
  d1: sandDark.sand1,
  d2: sandDark.sand2,
  d3: sandDark.sand3,
  d4: sandDark.sand4,
  d5: sandDark.sand5,
  d6: sandDark.sand6,
  d7: sandDark.sand7,
  d8: sandDark.sand8,
  d9: sandDark.sand9,
  d10: sandDark.sand10,
  d11: sandDark.sand11,
  d12: sandDark.sand12,
});

export const vars = { ...root, colors };
