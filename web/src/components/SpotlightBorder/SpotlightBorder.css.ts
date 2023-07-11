import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/index.css";

export const cardStyles = style({
  position: "relative",
  perspective: "600px",
  padding: "1px",
  borderRadius: "12px",
  isolation: "isolate",
  overflow: "hidden",
  height: "100%",
});

export const borderHighlight = style({
  position: "absolute",
  width: "300px",
  height: "300px",
  backgroundColor: vars.colorVars.a9,
  opacity: 0,
  left: 0,
  top: 0,
  borderRadius: "50%",
  pointerEvents: "none",
  transition: "opacity 230ms ease",
  filter: "blur(100px)",
  zIndex: -1,
  transform: "translateZ(0px)",
  selectors: {
    [`${cardStyles}:hover &`]: {
      opacity: 0.4,
    },
  },
});

export const contentContainer = style({
  height: "100%",
});

export const spotlight = style({
  position: "absolute",
  width: "300px",
  height: "300px",
  backgroundColor: vars.colorVars.a6,
  borderRadius: "50%",
  pointerEvents: "none",
  opacity: 0,
  left: 0,
  top: 0,
  transition: "opacity  230ms ease",
  filter: "blur(100px)",
  zIndex: 991,
  willChange: "transform",
  selectors: {
    [`${cardStyles}:hover &`]: {
      opacity: 0.05,
    },
  },
});
