import { style } from "@vanilla-extract/css";

export const gridContainer = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill,330px)",
  gridGap: "12px",
  padding: "12px",
});
