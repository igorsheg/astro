import { style } from "@vanilla-extract/css";
import { vars } from "../styles/index.css";

export const styleWrapperStyles = style({
  ...vars.typography.base,
  background: vars.colors.background,
  fontFamily: vars.fonts.primary,
  color: vars.colors.text,
  transition: "all 320ms ease",
});
