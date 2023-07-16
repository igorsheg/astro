import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/index.css";

export const glass = style({
  backgroundColor: vars.colors.foregorund,
  backdropFilter: "blur(10px)", // Adjust the blur radius as needed
});

export const baseCard = style({
  padding: vars.spacing.s6,
  height: "100%",
  borderRadius: "12px",
  overflow: "hidden",
  border: ` 1px solid ${vars.colors.border}`,
});