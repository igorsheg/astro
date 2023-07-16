import React, { useState, useEffect, useRef } from "react";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import { Service } from "../../models/service";
import * as styles from "./BentoGrid.css";
import { SingleService } from "../Service/Service";
import * as serviceStyles from "../Service/Service.css";

interface AlbumGalleryProps {
  items: Service[];
}

export const SortableGrid: React.FC<AlbumGalleryProps> = ({ items }) => {
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
  const gridItemRefs = useRef({});
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
  const handleMouseDown = (serviceId: string) => (event: any) => {
    event.preventDefault();

    let initialX = event.clientX;
    let initialY = event.clientY;
    let lastFrame = null;

    // Store the initial size of the service
    const initialElement = services.find((svc) => svc.id === serviceId);
    let initialW = initialElement?.grid_details.w;
    let initialH = initialElement?.grid_details.h;

    // Calculate the actual cell size
    const gridElement = gridItemRefs.current[serviceId];
    const baseWidth = gridElement ? gridElement.offsetWidth / initialW : 0;
    const baseHeight = gridElement ? gridElement.offsetHeight / initialH : 0;

    setResizingService({ id: serviceId, w: initialW, h: initialH });

    // Handler for mousemove event during resizing
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Calculate change in x and y
      const deltaX = moveEvent.clientX - initialX;
      const deltaY = moveEvent.clientY - initialY;

      const deltaW = Math.floor(deltaX / baseWidth + 0.4);
      const deltaH = Math.floor(deltaY / baseHeight + 0.4);

      // Convert the changes in x and y to pixels
      const deltaWidth = deltaX + initialW * baseWidth;
      const deltaHeight = deltaY + initialH * baseHeight;

      setResizingService((resizingService) =>
        resizingService && resizingService.id === serviceId
          ? {
              ...resizingService,
              w: deltaWidth,
              h: deltaHeight,
            }
          : resizingService,
      );

      // Update the "w" and "h" properties of the service based on the mouse movements
      setServices(
        services.map((svc) =>
          svc.id === serviceId
            ? {
                ...svc,
                grid_details: {
                  ...svc.grid_details,
                  w: Math.max(1, initialW + deltaW), // Ensure the width is at least 1
                  h: Math.max(1, initialH + deltaH), // Ensure the height is at least 1
                },
              }
            : svc,
        ),
      );
    };

    // Handler for mouseup event after resizing
    const handleMouseUp = () => {
      // Remove these handlers after the user has finished resizing
      window.cancelAnimationFrame(lastFrame);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);

      // Update the "w" and "h" properties of the actual service

      // Clear the resizing service

      // Update the "w" and "h" properties of the actual service
      if (resizingService) {
        setServices(
          services.map((svc) =>
            svc.id === resizingService.id
              ? {
                  ...svc,
                  grid_details: {
                    ...svc.grid_details,
                    w: resizingService.w,
                    h: resizingService.h,
                  },
                }
              : svc,
          ),
        );
      }

      // Clear the resizing service
      setResizingService(null);
    };

    // Add the event listeners for mousemove and mouseup
    const loop = () => {
      handleMouseMove;
      lastFrame = window.requestAnimationFrame(loop);
    };
    loop();

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  return (
    <ReactSortable
      className={styles.gridContainer}
      list={services}
      setList={setServices}
      animation={200}
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
            <div
              className={styles.resizeHandle}
              onMouseDown={handleMouseDown(service.id)}
            />
            {resizingService && resizingService.id === service.id && (
              <div
                className={`${serviceStyles.baseCard}`} // Add your SingleService styles here
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${resizingService?.w}px`,
                  borderRadius: "12px",
                  height: `${resizingService?.h}px`,
                  background: "rgba(255, 255, 255, 0.1)", // You can customize this as needed
                }}
              />
            )}
          </div>
        ))}
    </ReactSortable>
  );
};
