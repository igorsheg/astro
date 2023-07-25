import { FC } from "react";
import { ResizingService } from "./types";
import * as styles from "./Services.css";

interface ResizeOverlayProps {
  resizingOverlay: ResizingService | null;
  serviceId: string;
}
export const ResizeOverlay: FC<ResizeOverlayProps> = ({
  resizingOverlay,
  serviceId,
}) => {
  return (
    resizingOverlay?.id === serviceId && (
      <div
        className={`${styles.resizeOverlay}`} // Add your SingleService styles here
        style={{
          opacity: resizingOverlay?.id ? 1 : 0,
          width: `${resizingOverlay.w}px`,
          height: `${resizingOverlay.h}px`,
        }}
      />
    )
  );
};
