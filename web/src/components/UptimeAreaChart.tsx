import { curveNatural } from "@visx/curve";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { GridColumns } from "@visx/grid";
import { scaleLinear, scaleUtc } from "@visx/scale";
import { AreaClosed, Bar, Line } from "@visx/shape";
import {
  defaultStyles,
  Tooltip,
  TooltipWithBounds,
  withTooltip,
} from "@visx/tooltip";
import { WithTooltipProvidedProps } from "@visx/tooltip/lib/enhancers/withTooltip";
import { bisector, extent, max } from "d3-array";
import { timeFormat } from "d3-time-format";
import React, { CSSProperties, useCallback, useMemo } from "react";
import { UptimeStatus } from "../models/service";
import { vars } from "../styles/index.css";

interface AreaChartProps {
  margin?: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  status: UptimeStatus[];
  withTooltip?: boolean;
  withCloumnGrid?: boolean;
  withAreaFill?: boolean;
}

const formatDate = timeFormat("%b %d, %I:%M %p");
const bisectDate = bisector<UptimeStatus, Date>(
  (d) => new Date(d.checked_at),
).left;

const AreaChart = ({
  withTooltip = false,
  withCloumnGrid = false,
  withAreaFill = false,
  status,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  width,
  height,
  tooltipLeft = 0,
  margin = { top: 0, right: -1, bottom: -1, left: -1 },
}: AreaChartProps & WithTooltipProvidedProps<UptimeStatus>) => {
  if (!status || !status.length) return null;

  const servicePings = status
    .slice(status.length - 10, status.length)
    .sort((a, b) => +new Date(a.checked_at) - +new Date(b.checked_at));

  const columnsLineColor = "#edffea";
  const accentColor = useCallback(
    () =>
      servicePings[servicePings.length - 1].ok
        ? vars.colors.sucess
        : vars.colors.danger,
    [servicePings[servicePings.length - 1].ok],
  );

  const tooltipStyles: CSSProperties = {
    background: vars.colors.background,
    color: vars.colors.text,
    border: `1px solid ${vars.colors.border}`,
    fontSize: "14px",
  };

  const getDate = (d: UptimeStatus) => new Date(d.checked_at);
  const getLatencyValue = (d: UptimeStatus) => d.latency;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleUtc({
        nice: true,
        range: [margin.left, innerWidth + margin.left],
        domain: extent(servicePings, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left],
  );

  const latencyValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [
          0,
          (max(servicePings, getLatencyValue) || 0) + innerHeight / 2,
        ],
        nice: true,
        clamp: true,
      }),
    [margin.top, innerHeight],
  );
  const handleTooltip = useCallback(
    (
      event:
        | React.TouchEvent<SVGRectElement>
        | React.MouseEvent<SVGRectElement>,
    ) => {
      const { x } = localPoint(event) || { x: 0 };
      const x0 = dateScale.invert(x);
      const index = bisectDate(servicePings, x0, 1);
      const d0 = servicePings[index - 1];
      const d1 = servicePings[index];
      let d = d0;
      if (d1 && getDate(d1)) {
        d =
          x0.valueOf() - getDate(d0).valueOf() >
          getDate(d1).valueOf() - x0.valueOf()
            ? d1
            : d0;
      }
      showTooltip({
        tooltipData: d,
        tooltipLeft: x,
        tooltipTop: latencyValueScale(getLatencyValue(d)),
      });
    },
    [showTooltip, latencyValueScale, dateScale],
  );

  return (
    <div style={{ height, width }}>
      <svg width={width} height={height}>
        <LinearGradient
          toOffset="80%"
          id="area-gradient"
          from={accentColor()}
          to={accentColor()}
          fromOpacity={0.4}
          toOpacity={0}
        />

        {withCloumnGrid && (
          <GridColumns
            top={margin.top}
            scale={dateScale}
            height={innerHeight}
            strokeDasharray="1,3"
            stroke={columnsLineColor}
            strokeOpacity={0.2}
            pointerEvents="none"
          />
        )}
        <AreaClosed
          data={servicePings}
          x={(d) => dateScale(getDate(d) ?? 0)}
          y={(d) => latencyValueScale(getLatencyValue(d) ?? 0)}
          yScale={latencyValueScale}
          strokeWidth={1}
          stroke="url(#area-gradient)"
          fill={withAreaFill ? "url(#area-gradient)" : "none"}
          curve={curveNatural}
        />
        <Bar
          x={margin.left}
          y={margin.top}
          width={innerWidth}
          height={innerHeight}
          fill="transparent"
          rx={14}
          onTouchStart={handleTooltip}
          onTouchMove={handleTooltip}
          onMouseMove={handleTooltip}
          onMouseLeave={() => hideTooltip()}
        />
        {withTooltip && tooltipData && (
          <g>
            <Line
              from={{ x: tooltipLeft, y: margin.top }}
              to={{ x: tooltipLeft, y: innerHeight + margin.top }}
              stroke={accentColor()}
              strokeWidth={1}
              pointerEvents="none"
              strokeDasharray="5,2"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop + 1}
              r={4}
              fill="black"
              fillOpacity={0.1}
              stroke="black"
              strokeOpacity={0.1}
              strokeWidth={2}
              pointerEvents="none"
            />
            <circle
              cx={tooltipLeft}
              cy={tooltipTop}
              r={4}
              fill={accentColor()}
              stroke="white"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        )}
      </svg>
      {withTooltip && tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop - 12}
            left={tooltipLeft + 12}
            style={{ ...defaultStyles, ...tooltipStyles }}
          >
            {`${getLatencyValue(tooltipData)}ms`}
          </TooltipWithBounds>
          <Tooltip
            top={innerHeight + margin.top - 14}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              ...tooltipStyles,
              minWidth: 72,
              textAlign: "center",
              transform: "translateX(-50%)",
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default withTooltip<AreaChartProps, UptimeStatus>(AreaChart);
