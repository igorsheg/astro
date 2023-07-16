import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/index.css";

export const gridContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(16, 1fr)", // This creates a grid with 6 equal columns
  gridAutoColumns: "auto",
  gridAutoRows: "minmax(100px, auto)", // assuming a row is 100px at minimum, adjust as needed
  gridColumnGap: vars.spacing.s4,
  gridRowGap: vars.spacing.s4,
  position: "relative",
  width: "100%",
  gridAutoFlow: "row dense",
});

export const gridItem = style({
  position: "relative",
});

export const resizeHandle = style({
  position: "absolute",
  right: 0,
  bottom: 0,
  width: "20px",
  height: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  cursor: "nwse-resize", // The cursor shape for resizing
  zIndex: 1, // Make sure the handle is above other elements
});
