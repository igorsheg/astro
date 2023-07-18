import { FC, PropsWithChildren } from "react";
import { Service } from "../../models/service";
import UptimeAreaChart from "../UptimeAreaChart";
import * as styles from "./Services.css";
import Box from "../Box/Box";
import { vars } from "../../styles/index.css";
import { SpotlightCard } from "../SpotlightCard/SpotlightCard";

export const SingleService: FC<PropsWithChildren<{ svc: Service }>> = ({
  svc,
}) => {
  return (
    <SpotlightCard>
      <Box className={` ${styles.basecard}  ${styles.glass}`}>
        <Box gap={0} orientation="column">
          <img
            style={{
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
          {svc.status && (
            <Box xAlign="end">
              <UptimeAreaChart
                withAreaFill
                status={svc.status}
                width={66}
                height={66}
              />
            </Box>
          )}
        </Box>
      </Box>
    </SpotlightCard>
  );
};
