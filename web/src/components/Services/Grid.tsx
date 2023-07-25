import React, { useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSwappingStrategy,
  arraySwap,
} from "@dnd-kit/sortable";
import { Service } from "../../models/service";
import * as styles from "./Services.css";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

import {
  usePatchGridOrderMutation,
  usePatchServiceMutation,
} from "../../services/api";
import { SortableItem } from "./SortableItem";

interface ServiceGridProps {
  items: Service[];
}

export const SortableGrid: React.FC<ServiceGridProps> = ({ items }) => {
  const [patchServicesOrder] = usePatchGridOrderMutation();
  const [patchService] = usePatchServiceMutation();

  const [services, setServices] = useState<Service[]>(
    [...items].sort((a, b) => a.grid_order - b.grid_order),
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = active.data.current?.sortable.index;
        const newIndex = over.data.current?.sortable.index;
        const newOrder = arraySwap(services, oldIndex, newIndex);
        const changes = newOrder.map((svc, index) => ({
          id: svc.id,
          grid_order: index,
        }));
        patchServicesOrder(changes);

        setServices(newOrder);
      }
    },
    [services, patchServicesOrder],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <SortableContext
        items={services.map((service) => service.id)}
        strategy={rectSwappingStrategy}
      >
        <div className={styles.gridContainer}>
          {services.map((service) => {
            return <SortableItem key={service.id} service={service} />;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};
