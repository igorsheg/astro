import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/index.css";

export const gridContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(16, 1fr)", // This creates a grid with 6 equal columns
  gridAutoColumns: "auto",
  // gridTemplateRows: "repeat(12, 1fr)",
  gridAutoRows: "minmax(100px, auto)", // assuming a row is 100px at minimum, adjust as needed
  gridColumnGap: vars.spacing.s3,
  gridRowGap: vars.spacing.s3,
  // gridAutoRows: "min-content",
  position: "relative",
  width: "100%",

  gridAutoFlow: "row dense",
  // gridAutoColumns: "5fr 5fr",
});

export const gridItem = style({
  gridColumnEnd: "span 4", // This makes items with low priority span 1 column
});

export const gridItemHigh = style({
  gridColumnEnd: "span 8", // This makes items with high priority span 2 columns
  gridRowEnd: "span 2",
});

export const gridItemMedium = style({
  gridColumn: "span 4", // This makes items with low priority span 1 column
  gridRowEnd: "span 2",
});

export const gridItemDefault = style({
  gridColumnEnd: "span 4", // This makes items with low priority span 1 column
});
