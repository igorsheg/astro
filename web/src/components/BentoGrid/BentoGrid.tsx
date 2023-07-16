import React, { useState, useEffect, Ref } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { Service } from "../../models/service";
import * as styles from "./BentoGrid.css";
import { CSS } from "@dnd-kit/utilities";
import { SingleService } from "../Service/Service";

interface AlbumGalleryProps {
  items: Service[];
}

export const SortableGrid: React.FC<AlbumGalleryProps> = ({ items }) => {
  const [services, setServices] = useState(items);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 35,
      },
    }),
  );

  useEffect(() => {
    localStorage.setItem("albums", JSON.stringify(services));
  }, [services]);

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={services.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className={styles.gridContainer}>
          {services.map((service, index) => (
            <SortableAlbum svc={service} key={service.id} index={index} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

interface SortableAlbumProps {
  svc: Service;
  index: number;
}

export const SortableAlbum = (props: SortableAlbumProps) => {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: props.svc.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
  };

  return (
    <SingleService
      ref={setNodeRef}
      style={style}
      attributes={attributes}
      listeners={listeners}
      {...props}
    />
  );
};
