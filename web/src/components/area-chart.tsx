import { curveMonotoneX } from "@visx/curve";
import { localPoint } from "@visx/event";
import { LinearGradient } from "@visx/gradient";
import { GridColumns } from "@visx/grid";
import { scaleLinear, scaleTime } from "@visx/scale";
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
import React, { useCallback, useMemo } from "react";
import { CSSProp } from "styled-components";
import { Ping, Service } from "../types";
import { SAMPLE_THEMES } from "../consts/seed-data";

interface AreaChartProps {
  margin?: { top: number; right: number; bottom: number; left: number };
  width: number;
  height: number;
  item: Service;
  withTooltip?: boolean;
  withCloumnGrid?: boolean;
  withAreaFill?: boolean;
}

const formatDate = timeFormat("%b %d, %I:%M %p");
const bisectDate = bisector<Ping, Date>(
  (d) => new Date(d.created_at as Date)
).left;

const AreaChart = ({
  withTooltip = false,
  withCloumnGrid = false,
  withAreaFill = false,
  item,
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipTop = 0,
  width,
  height,
  tooltipLeft = 0,
  margin = { top: 0, right: -1, bottom: -1, left: -1 },
}: AreaChartProps & WithTooltipProvidedProps<Ping>) => {
  // const {data: themes} = useQuery('themes', () => fetcher<Theme[]>(["themes"]))

  // const { activeThemeId } = localSrorageStore();

  if (!item || !item.pings || !item.pings.length) return null;

  const servicePings = (item.pings as Ping[]).slice().sort(
    (a, b) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      +new Date(a.created_at as Date) - +new Date(b.created_at as Date)
  );

  const ctxTheme = SAMPLE_THEMES.dark;
  const columnsLineColor = "#edffea";
  const accentColor =
    servicePings[servicePings.length - 1].status_code === 200
      ? "rgb(48, 209, 88"
      : "rgb(255,69,58)";

  const tooltipStyles: CSSProp = {
    background: ctxTheme?.background.secondary,
    color: ctxTheme?.text.primary,
    border: `1px solid ${ctxTheme?.border.primary}`,
    fontSize: "14px",
  };

  const getDate = (d: Ping) => new Date(d.created_at as Date);
  const getLatencyValue = (d: Ping) => d.latency;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(servicePings, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left]
  );

  const latencyValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [
          0,
          (max(servicePings, getLatencyValue) || 0) + innerHeight / 3,
        ],
        nice: true,
      }),
    [margin.top, innerHeight]
  );
  const handleTooltip = useCallback(
    (
      event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
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
    [showTooltip, latencyValueScale, dateScale]
  );

  return (
    <div style={{ height, width }}>
      <svg width={width} height={height}>
        <LinearGradient
          id="area-gradient"
          from={accentColor}
          to={accentColor}
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
          stroke={accentColor}
          fill={withAreaFill ? "url(#area-gradient)" : "none"}
          curve={curveMonotoneX}
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
              stroke={accentColor}
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
              fill={accentColor}
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

export default withTooltip<AreaChartProps, Ping>(AreaChart);
