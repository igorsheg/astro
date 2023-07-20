import React, { useCallback, useEffect, useRef, useState } from "react";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import { Service } from "../../models/service";
import { ResizeHandle } from "./ResizeHandle";
import { ResizeOverlay } from "./ResizeOverlay";
import { SingleService } from "./Service";
import * as styles from "./Services.css";
import {
  calculateDeltas,
  updateResizingService,
  updateServiceSize,
} from "./utils";
import {
  usePatchGridOrderMutation,
  usePatchServiceMutation,
} from "../../services/api";

interface ServiceGridProps {
  items: Service[];
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const SortableGrid: React.FC<ServiceGridProps> = ({ items }) => {
  const [patchServicesOrder] = usePatchGridOrderMutation();
  const [patchService] = usePatchServiceMutation();

  const [services, setServices] = useState<Service[]>(
    items.map((item) => ({ ...item })),
  );

  const [resizingService, setResizingService] = useState<{
    id: string;
    w: number;
    h: number;
  } | null>(null);

  const gridItemRefs = useRef<{
    [activeId: string]: HTMLDivElement | null;
  }>({});

  const prevServices = usePrevious(services);

  useEffect(() => {
    services.forEach((service) => {
      const prevService = prevServices?.find((s) => s.id === service.id);
      if (!prevService) return;

      if (
        service.grid_h !== prevService.grid_h ||
        service.grid_w !== prevService.grid_w
      ) {
        patchService(service);
        console.log(`Service with ID ${service.id} has changed size.`);
      }
    });
  }, [services]);

  const handleEnd = (evt: SortableEvent) => {
    const updatedServices = [...services];
    const { oldIndex, newIndex } = evt;

    if (oldIndex && newIndex) {
      updatedServices.splice(
        newIndex,
        0,
        updatedServices.splice(oldIndex, 1)[0],
      );
      updatedServices.forEach((svc, index) => (svc.grid_order = index));
      setServices(updatedServices);
    }
    const changes = updatedServices.map((svc) => ({
      id: svc.id,
      grid_order: svc.grid_order,
    }));
    patchServicesOrder(changes);
  };

  const handleMouseDown = useCallback(
    (serviceId: string) => (event: React.MouseEvent) => {
      event.preventDefault();

      const initialX = event.clientX;
      const initialY = event.clientY;

      const initialElement = services.find((svc) => svc.id === serviceId);
      const initialW = initialElement?.grid_w ?? 0;
      const initialH = initialElement?.grid_h ?? 0;

      const gridElement = gridItemRefs.current[serviceId];
      const baseWidth = gridElement?.offsetWidth ?? 0;
      const baseHeight = gridElement?.offsetHeight ?? 0;

      if (baseHeight && baseWidth) {
        setResizingService({ id: serviceId, w: baseWidth, h: baseHeight });
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

        setResizingService((prevResizingService) =>
          updateResizingService(
            prevResizingService,
            serviceId,
            deltaWidth,
            deltaHeight,
          ),
        );

        const servicesUpdated = updateServiceSize(
          services,
          serviceId,
          initialW,
          initialH,
          deltaW,
          deltaH,
        );

        setServices(servicesUpdated);
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        if (resizingService) {
          const servicesUpdated = updateServiceSize(
            services,
            resizingService.id,
            resizingService.w,
            resizingService.h,
            0,
            0,
          );
          setServices(servicesUpdated);
        }

        setResizingService(null);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [services],
  );

  const sortedServices = [...services].sort(
    (a, b) => a.grid_order - b.grid_order,
  );

  return (
    <ReactSortable
      className={styles.gridContainer}
      list={services}
      setList={setServices}
      animation={100}
      onEnd={handleEnd}
    >
      {sortedServices.map((service) => (
        <div
          key={service.id}
          className={styles.gridItem}
          ref={(ref) => (gridItemRefs.current[service.id] = ref)}
          style={{
            gridColumnEnd: `span ${service.grid_w * 4}`,
            gridRowEnd: `span ${service.grid_h * 2}`,
          }}
        >
          <SingleService svc={service} />
          <ResizeHandle serviceId={service.id} onMouseDown={handleMouseDown} />
          <ResizeOverlay
            resizingService={resizingService}
            serviceId={service.id}
          />
        </div>
      ))}
    </ReactSortable>
  );
};
