import React, { useState, useEffect } from "react";
import { ReactSortable, SortableEvent } from "react-sortablejs";
import { Service } from "../../models/service";
import * as styles from "./BentoGrid.css";
import { SingleService } from "../Service/Service";

const BASE_HEIGHT = 200;
const BASE_WIDTH = 200;

interface AlbumGalleryProps {
  items: Service[];
}

export const SortableGrid: React.FC<AlbumGalleryProps> = ({ items }) => {
  const storedServices = localStorage.getItem("services");
  const initialServices = storedServices
    ? JSON.parse(storedServices)
    : items.map((svc) => ({ ...svc }));

  const [services, setServices] = useState<Service[]>(initialServices);

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
    let initialW = services.find((svc) => svc.id === serviceId)?.grid_details.w;
    let initialH = services.find((svc) => svc.id === serviceId)?.grid_details.h;

    // Handler for mousemove event during resizing
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Calculate change in x and y
      const deltaX = moveEvent.clientX - initialX;
      const deltaY = moveEvent.clientY - initialY;

      // Convert the changes in x and y to grid units
      const deltaW = Math.round(deltaX / BASE_WIDTH);
      const deltaH = Math.round(deltaY / BASE_HEIGHT);

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
            style={{
              gridColumnEnd: `span ${service.grid_details.w * 4}`,
              gridRowEnd: `span ${service.grid_details.h * 2}`,
              transition: "all 230ms ease",
            }}
          >
            <SingleService svc={service} />
            <div
              className={styles.resizeHandle}
              onMouseDown={handleMouseDown(service.id)}
            />
          </div>
        ))}
    </ReactSortable>
  );
};
