import { Service } from "../../models/service";
import { ResizingService } from "./types";

export const calculateDeltas = (
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

export const updateResizingService = (
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

export const updateServiceSize = (
  services: Service[],
  serviceId: string,
  initialW: number,
  initialH: number,
  deltaW: number,
  deltaH: number,
): Service[] => {
  return services.map((svc) =>
    svc.id === serviceId
      ? {
          ...svc,
          grid_w: Math.max(1, initialW + deltaW),
          grid_h: Math.max(1, initialH + deltaH),
        }
      : svc,
  );
};
