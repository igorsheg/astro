import { FC, PropsWithChildren } from "react";
import { Service } from "../../models/service";
import UptimeAreaChart from "../UptimeAreaChart";
import * as styles from "./Service.css";
import Box from "../Box/Box";
import FancyCard from "../SpotlightBorder/SpotlightBorder";
import { vars } from "../../styles/index.css";
export const SingleService: FC<PropsWithChildren<{ svc: Service }>> = ({
  svc,
}) => {
  return (
    <FancyCard>
      <Box gap="6" className={` ${styles.baseCard}  ${styles.glass}`}>
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
          <UptimeAreaChart
            withAreaFill
            status={svc.status}
            width={100}
            height={100}
          />
        )}
      </Box>
    </FancyCard>
  );
};
