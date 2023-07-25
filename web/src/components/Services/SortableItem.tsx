import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Service } from "../../models/service";
import { useSortable } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import * as styles from "./Services.css";
import { SingleService } from "./Service";
import useResizeGrid from "../../hooks/useResizer";
import { vars } from "../../styles/index.css";

interface SortableItemProps {
  service: Service;
}

export const SortableItem: FC<PropsWithChildren<SortableItemProps>> = ({
  service,
}) => {
  const { gridItemRef, gridDimensions, handleMouseDown, overlayDimensions } =
    useResizeGrid(service);
  //
  // useEffect(() => {
  //   console.log("Changed Services", updatedService);
  // }, [updatedService]);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: service.id, transition: null });

  return (
    <div
      ref={gridItemRef}
      className={styles.gridItem}
      style={{
        gridColumnEnd: `span ${gridDimensions.gridColumnEnd * 4}`,
        gridRowEnd: `span ${gridDimensions.gridRowEnd * 2}`,
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

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
            borderRadius: "12px",
            border: `1px dashed ${vars.colorVars.d11}`,
            width: `${overlayDimensions.width}px`,
            height: `${overlayDimensions.height}px`,
          }}
        />
      </motion.div>
    </div>
  );
};
