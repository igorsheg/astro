import { FC, PropsWithChildren } from "react";
import { Service } from "../../models/service";
import * as styles from "./Services.css";
import Box from "../Box/Box";
import { vars } from "../../styles/index.css";
import { SpotlightCard } from "../SpotlightCard/SpotlightCard";
import { UptimeBar } from "../UptimeBar/UptimeBar";
import { ResizeHandle } from "./ResizeHandle";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DragHandle } from "./DragHandle";

interface SingleServiceProps {
  svc: Service;
  isDragging: boolean;
  dragListeners: SyntheticListenerMap | undefined;
  handleDragHandleMouseDown: (event: React.MouseEvent) => void;
}

export const SingleService: FC<PropsWithChildren<SingleServiceProps>> = ({
  svc,
  isDragging,
  dragListeners,
  handleDragHandleMouseDown,
}) => {
  return (
    <SpotlightCard isDragging={isDragging}>
      <Box className={` ${styles.basecard}  ${styles.glass}`}>
        <Box
          style={{ height: "100%" }}
          yAlign="space-between"
          gap={0}
          orientation="column"
        >
          <Box gap={0} orientation="column">
            <img
              style={{
                perspective: "12000px",
                width: vars.spacing.s7,
                paddingBottom: vars.spacing.s3,
              }}
              src={`${svc.logo}/${svc.id}`}
            />
            <span
              style={{
                ...vars.typography.l,
                color: vars.colors.d12,
                fontWeight: 500,
              }}
            >
              {svc.name}
            </span>
            <span style={{ ...vars.typography.m, color: vars.colors.d11 }}>
              {svc.description}
            </span>
          </Box>
          {svc.uptime_status && (
            <Box xAlign="start">
              <UptimeBar data={svc.uptime_status} />
            </Box>
          )}
        </Box>
        <DragHandle {...dragListeners} />
        <ResizeHandle onMouseDown={handleDragHandleMouseDown} />
      </Box>
    </SpotlightCard>
  );
};
