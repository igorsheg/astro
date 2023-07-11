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
  vars: {
    "--mouse-x": "0px",
    "--mouse-y": "0px",
  },
});

export const borderHighlight = style({
  position: "absolute",
  width: "300px",
  height: "300px",
  top: "-230px",
  left: "-230px",
  backgroundColor: vars.colors.d12,
  opacity: 0,
  borderRadius: "100%",
  pointerEvents: "none",
  transition: "opacity 230ms ease",
  filter: "blur(100px)",
  zIndex: -1,
  transform: "translateZ(9px)",
  selectors: {
    [`${cardStyles}:hover &`]: {
      opacity: 0.5,
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
  left: "-230px",
  top: "-230px",
  backgroundColor: vars.colors.d12,
  borderRadius: "50%",
  pointerEvents: "none",
  opacity: 0,
  boxShadow:
    "0 0 30px 60px rgba(0, 0, 0, 0.2), 0 0 60px 100px rgba(0, 0, 0, 0.4), 0 0 100px 100px rgba(0, 0, 0, 0.6), 0 0 140px 140px rgba(0, 0, 0, 0.8)",
  transform: "translateX(var(--mouse-x)) translateY(var(--mouse-y))",
  transition: "opacity  230ms ease",
  // boxShadow: "0 0 100px 100px rgba(0, 0, 0, 0.8)",
  filter: "blur(200px)",
  zIndex: 991,
  willChange: "transform",
  selectors: {
    // target child components on hover
    [`${cardStyles}:hover &`]: {
      opacity: 0.05,
    },
  },
});
