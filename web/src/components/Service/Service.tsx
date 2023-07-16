import { FC, PropsWithChildren, forwardRef } from "react";
import { Service } from "../../models/service";
import UptimeAreaChart from "../UptimeAreaChart";
import * as styles from "./Service.css";
import Box from "../Box/Box";
import FancyCard from "../SpotlightBorder/SpotlightBorder";
import { vars } from "../../styles/index.css";
import { animated } from "react-spring";

export const SingleService: FC<PropsWithChildren<{ svc: Service }>> =
  forwardRef(({ svc, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={props.style}
        {...props.attributes}
        {...props.listeners}
      >
        <animated.div style={style}>
          <FancyCard>
            <Box className={` ${styles.baseCard}  ${styles.glass}`}>
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
          </FancyCard>
        </animated.div>
      </div>
    );
  });
