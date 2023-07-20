import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/index.css";

export const barStyle = style({
  display: "inline-block",
  borderRadius: "2px",
  width: vars.spacing.s2,

  transition: "height 0.3s ease",
});

export const greenBar = style({
  backgroundColor: vars.colors.sucess,
});

export const redBar = style({
  backgroundColor: vars.colorVars.d11,
});
