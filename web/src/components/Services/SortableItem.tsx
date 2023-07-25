import { FC, PropsWithChildren, useEffect } from "react";
import { Service } from "../../models/service";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import * as styles from "./Services.css";
import { SingleService } from "./Service";
import { ResizeOverlay } from "./ResizeOverlay";
import { useResizer } from "../../hooks/useResizer";

interface SortableItemProps {
  service: Service;
}

export const SortableItem: FC<PropsWithChildren<SortableItemProps>> = ({
  service,
}) => {
  const {
    resizingOverlay,
    handleMouseDown,
    gridItemRef,
    service: updatedService,
    gridH,
    gridW,
  } = useResizer(service);

  useEffect(() => {
    console.log("Changed Services", updatedService);
  }, [updatedService]);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: service.id, transition: null });

  return (
    <div
      ref={gridItemRef}
      className={styles.gridItem}
      style={{
        gridColumnEnd: `span ${gridW * 4}`,
        gridRowEnd: `span ${gridH * 2}`,
      }}
    >
      <motion.div
        ref={setNodeRef}
        {...attributes}
        style={{ height: "100%" }}
        layout="position"
        layoutDependency={isDragging}
        animate={{
          x: transform?.x ?? 0,
          y: transform?.y ?? 0,
          scale: isDragging ? 1.05 : 1,
          zIndex: isDragging ? 1 : 0,
        }}
        transition={{
          duration: !isDragging ? 0.25 : 0,
          type: "tween",
        }}
      >
        <SingleService
          dragListeners={listeners}
          handleDragHandleMouseDown={handleMouseDown}
          isDragging={isDragging}
          svc={service}
        />
        <ResizeOverlay
          resizingOverlay={resizingOverlay}
          serviceId={service.id}
        />
      </motion.div>
    </div>
  );
};
