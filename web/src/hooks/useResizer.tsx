import { useCallback, useState, useRef } from "react";
import { Service, ServiceGridDetails } from "../models/service";

interface ResizingService extends Omit<ServiceGridDetails, "order"> {
  id: string;
}

const calculateDeltas = (
  moveEvent: MouseEvent,
  initialX: number,
  initialY: number,
  baseWidth: number,
  baseHeight: number,
): { deltaX: number; deltaY: number; deltaW: number; deltaH: number } => {
  const deltaX = moveEvent.clientX - initialX;
  const deltaY = moveEvent.clientY - initialY;
  const deltaW = Math.floor(deltaX / baseWidth + 0.4);
  const deltaH = Math.floor(deltaY / baseHeight + 0.4);
  return { deltaX, deltaY, deltaW, deltaH };
};

const updateResizingService = (
  resizingService: ResizingService | null,
  serviceId: string,
  deltaWidth: number,
  deltaHeight: number,
): ResizingService | null => {
  return resizingService && resizingService.id === serviceId
    ? {
        ...resizingService,
        w: deltaWidth,
        h: deltaHeight,
      }
    : resizingService;
};

export const useResizer = (initialService: Service) => {
  const [service, setService] = useState<Service>(initialService);
  const [resizingOverlay, setResizingOverlay] =
    useState<ResizingService | null>(null);

  const gridItemRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      const initialX = event.clientX;
      const initialY = event.clientY;

      const initialW = service.grid_w;
      const initialH = service.grid_h;

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
          baseWidth,
          baseHeight,
        );

        const deltaWidth = deltaX + baseWidth;
        const deltaHeight = deltaY + baseHeight;

        setResizingOverlay((prevResizingService) =>
          updateResizingService(
            prevResizingService,
            service.id,
            deltaWidth,
            deltaHeight,
          ),
        );

        setService((prevService) => {
          if (
            prevService.grid_w !== initialW + deltaW ||
            prevService.grid_h !== initialH + deltaH
          ) {
            return {
              ...prevService,
              grid_w: Math.max(1, initialW + deltaW),
              grid_h: Math.max(1, initialH + deltaH),
            };
          } else {
            return prevService;
          }
        });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (resizingOverlay) {
          const updatedService = {
            ...service,
            grid_w: resizingOverlay.w,
            grid_h: resizingOverlay.h,
          };
          setService(updatedService);
        }

        setResizingOverlay(null);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [service, gridItemRef.current],
  );

  return {
    resizingOverlay,
    handleMouseDown,
    service,
    setService,
    gridItemRef,
    gridH: service.grid_h,
    gridW: service.grid_w,
  };
};
