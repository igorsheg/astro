import { useCallback, useState, useRef } from "react";
import { Service, ServiceGridDetails } from "../models/service";

interface ResizingService extends Omit<ServiceGridDetails, "order"> {
  id: string;
}

const snapToGrid = (
  size: number,
  previousSize: number,
  currentSize: number,
  gridSize: number,
  gap: number,
  threshold = 0.6,
) => {
  const rem = size % gridSize;
  const gapIncrement = Math.abs(currentSize - previousSize) * gap;
  const adjustedGridSize = gridSize + gapIncrement;

  if (rem < threshold * adjustedGridSize) {
    return size - rem; // snap to lower grid line
  } else if (adjustedGridSize - rem < threshold * adjustedGridSize) {
    return size + adjustedGridSize - rem; // snap to upper grid line
  } else {
    return size; // no snap, smooth resize
  }
};

const calculateDeltas = (
  moveEvent: MouseEvent,
  initialX: number,
  initialY: number,
  cellWidth: number,
  cellHeight: number,
  threshold: number,
): { deltaX: number; deltaY: number; deltaW: number; deltaH: number } => {
  const deltaX = moveEvent.clientX - initialX;
  const deltaY = moveEvent.clientY - initialY;
  const rawDeltaW = deltaX / cellWidth;
  const rawDeltaH = deltaY / cellHeight;

  const thresholdDeltaW =
    rawDeltaW >= 0
      ? Math.floor(rawDeltaW) + (rawDeltaW % 1 > threshold ? 1 : 0)
      : Math.ceil(rawDeltaW) + (Math.abs(rawDeltaW) % 1 > threshold ? -1 : 0);

  const thresholdDeltaH =
    rawDeltaH >= 0
      ? Math.floor(rawDeltaH) + (rawDeltaH % 1 > threshold ? 1 : 0)
      : Math.ceil(rawDeltaH) + (Math.abs(rawDeltaH) % 1 > threshold ? -1 : 0);

  return { deltaX, deltaY, deltaW: thresholdDeltaW, deltaH: thresholdDeltaH };
};

export const useResizer = (initialService: Service, gap: number) => {
  const [service, setService] = useState<Service>(initialService);
  const [resizingOverlay, setResizingOverlay] =
    useState<ResizingService | null>(null);

  const gridItemRef = useRef<HTMLDivElement | null>(null);
  const previousGridSizeRef = useRef({ w: service.grid_w, h: service.grid_h });

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const initialX = event.clientX;
      const initialY = event.clientY;

      const baseWidth = gridItemRef.current?.offsetWidth ?? 0;
      const baseHeight = gridItemRef.current?.offsetHeight ?? 0;

      if (baseHeight && baseWidth) {
        setResizingOverlay({ id: service.id, w: baseWidth, h: baseHeight });
      }

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const { deltaX, deltaY, deltaW, deltaH } = calculateDeltas(
          moveEvent,
          initialX,
          initialY,
          baseWidth / service.grid_w,
          baseHeight / service.grid_h,
          0.5,
        );

        const newW = Math.max(1, Math.min(4, service.grid_w + deltaW));
        const newH = Math.max(1, Math.min(4, service.grid_h + deltaH));

        const overlayWidth = snapToGrid(
          deltaX + baseWidth,
          baseWidth,
          previousGridSizeRef.current.w,
          service.grid_w,
          gap,
          0.5,
        );
        const overlayHeight = snapToGrid(
          deltaY + baseHeight,
          baseHeight,
          previousGridSizeRef.current.h,
          gap,
          0.5,
        );

        setResizingOverlay((prevResizingService) =>
          prevResizingService && prevResizingService.id === service.id
            ? {
                ...prevResizingService,
                w: overlayWidth,
                h: overlayHeight,
              }
            : prevResizingService,
        );

        if (service.grid_w !== newW || service.grid_h !== newH) {
          previousGridSizeRef.current = {
            w: service.grid_w,
            h: service.grid_h,
          };
          setService({
            ...service,
            grid_w: newW,
            grid_h: newH,
          });
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setResizingOverlay(null);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [service, gridItemRef.current, gap],
  );

  return {
    resizingOverlay,
    handleMouseDown,
    service,
    gridItemRef,
    gridH: service.grid_h,
    gridW: service.grid_w,
  };
};
