import React, { useState, useEffect, useRef } from "react";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import { Service } from "../../models/service";
import * as styles from "./Services.css";
import { SingleService } from "./Service";
import {
  calculateDeltas,
  updateResizingService,
  updateServiceSize,
} from "./utils";
import { ResizeHandle } from "./ResizeHandle";
import { ResizeOverlay } from "./ResizeOverlay";

interface ServiceGridProps {
  items: Service[];
}

export const SortableGrid: React.FC<ServiceGridProps> = ({ items }) => {
  const storedServices = localStorage.getItem("services");
  const initialServices = storedServices
    ? JSON.parse(storedServices)
    : items.map((svc) => ({ ...svc }));

  const [services, setServices] = useState<Service[]>(initialServices);
  const [resizingService, setResizingService] = useState<{
    id: string;
    w: number;
    h: number;
  } | null>(null);

  const gridItemRefs = useRef<{
    [activeId: string]: HTMLDivElement | null;
  }>({});

  useEffect(() => {
    localStorage.setItem("services", JSON.stringify(services));
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
      updatedServices.forEach((svc, index) => (svc.grid_details.order = index));
      setServices(updatedServices);
    }
  };

  const handleMouseDown = (serviceId: string) => (event: React.MouseEvent) => {
    event.preventDefault();

    let initialX = event.clientX;
    let initialY = event.clientY;

    const initialElement = services.find((svc) => svc.id === serviceId);
    let initialW = initialElement?.grid_details.w ?? 0;
    let initialH = initialElement?.grid_details.h ?? 0;

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
  };
  return (
    <ReactSortable
      className={styles.gridContainer}
      list={services}
      setList={setServices}
      animation={600}
      onEnd={handleEnd}
    >
      {services
        .sort((a, b) => a.grid_details.order - b.grid_details.order)
        .map((service) => (
          <div
            key={service.id}
            className={styles.gridItem}
            ref={(ref) => (gridItemRefs.current[service.id] = ref)}
            style={{
              gridColumnEnd: `span ${service.grid_details.w * 4}`,
              gridRowEnd: `span ${service.grid_details.h * 2}`,
            }}
          >
            <SingleService svc={service} />
            <ResizeHandle
              serviceId={service.id}
              onMouseDown={handleMouseDown}
            />
            <ResizeOverlay
              resizingService={resizingService}
              serviceId={service.id}
            />
          </div>
        ))}
    </ReactSortable>
  );
};
