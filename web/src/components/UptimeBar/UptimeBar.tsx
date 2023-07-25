import React from "react";
import * as Ariakit from "@ariakit/react";
import * as styles from "./UptimeBar.css";
import { UptimeStatus } from "../../models/service";
import Box from "../Box/Box";
import { vars } from "../../styles/index.css";

type UptimeBarProps = {
  data: UptimeStatus[];
};

export const UptimeBar: React.FC<UptimeBarProps> = ({ data }) => {
  const totalLatency = data.reduce((sum, item) => sum + item.latency, 0);
  const tooltip = Ariakit.useTooltipStore();

  return (
    <Box
      gap={vars.spacing.s1}
      xAlign="flex-start"
      orientation="row"
      yAlign="flex-end"
      style={{ height: vars.spacing.s6 }}
    >
      {data.map((item, index) => {
        const normalizedLatency = (item.latency / totalLatency) * 100;
        const colorClass = item.ok ? styles.greenBar : styles.redBar;

        return (
          <div
            key={index}
            className={`${styles.barStyle} ${colorClass}`}
            style={{
              height: `${normalizedLatency}%`,
            }}
            data-tip={`${item.service_id} <br/> Latency: ${item.latency}ms`}
          />
        );
      })}
      <Ariakit.Tooltip store={tooltip} className="tooltip">
        https://ariakit.org/components/tooltip
      </Ariakit.Tooltip>
    </Box>
  );
};
