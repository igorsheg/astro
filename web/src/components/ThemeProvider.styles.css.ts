import { style } from "@vanilla-extract/css";
import { vars } from "../styles/index.css";

export const styleWrapperStyles = style({
  fontFamily: vars.fonts.primary,
  fontSize: vars.fontSize["0x"],
  color: vars.colors.text,
  background: vars.colors.background,
});
