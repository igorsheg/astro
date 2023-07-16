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
    right: vars.spacing.s3,
    bottom: vars.spacing.s3,
    width: vars.spacing.s4,
    height: vars.spacing.s4,
    cursor: "nwse-resize", // The cursor shape for resizing
    zIndex: 1, // Make sure the handle is above other elements
});

export const glass = style({
    backgroundColor: vars.colors.foregorund,
    backdropFilter: "blur(10px)", // adjust the blur radius as needed
});

export const basecard = style({
    padding: vars.spacing.s6,
    height: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    border: ` 1px solid ${vars.colors.border}`,
});

export const resizeOverlay = style({
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    opacity: 0,
    borderRadius: "12px",
    border: `1px dashed ${vars.colorVars.d11}`,
});
