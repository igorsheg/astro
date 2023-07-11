import { style } from "@vanilla-extract/css";

export const backgroundContainer = style({
  position: "absolute",
  width: "100vw",
  height: "100vh",
  zIndex: -1,
  top: 0,
  left: 0,
  userSelect: "none",
  pointerEvents: "none",
  overflow: "hidden",
});

export const background = style({
  position: "absolute",
  zIndex: 0,
  top: -1,
  right: -1,
  bottom: -1,
  left: -1,
  backgroundSize: "cover",
  backgroundPosition: "center",
  transition: "opacity 320ms ease", // Adjust timing and easing function as needed
  opacity: 0,
});

export const visible = style({
  opacity: 1,
});
