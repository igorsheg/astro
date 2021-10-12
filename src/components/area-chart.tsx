import { AreaClosed, Line, Bar } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import { FC, useMemo } from 'react';
import { scaleTime, scaleLinear } from '@visx/scale';
import { max, extent } from 'd3-array';
import { curveMonotoneX, curveBasis } from '@visx/curve';
import styled from 'styled-components';
import { transparentize } from 'polished';

interface PingStatus {
  latency: number;
  date: Date;
}
interface AreaChartProps {
  data: PingStatus[];
  width: number;
  height: number;
}

const accentColorDark = '#75daad';
const margin = { top: 0, right: -3, bottom: 0, left: -3 };

const AreaChart: FC<AreaChartProps> = ({ data, height, width }) => {
  const getDate = (d: PingStatus) => new Date(d.date);
  const getLatencyValue = (d: PingStatus) => d.latency;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const dateScale = useMemo(
    () =>
      scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(data, getDate) as [Date, Date],
      }),
    [innerWidth, margin.left],
  );

  const latencyValueScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [0, (max(data, getLatencyValue) || 0) + innerHeight / 3],
        nice: true,
      }),
    [margin.top, innerHeight],
  );

  return (
    <ChartWrap>
      <span />
      <svg width={width} height={height}>
        <LinearGradient
          id="area-gradient"
          from={accentColorDark}
          to="#2e2f30"
          fromOpacity={0.4}
          toOpacity={0}
        />
        <AreaClosed
          data={data}
          x={d => dateScale(getDate(d) ?? 0)}
          y={d => latencyValueScale(getLatencyValue(d) ?? 0)}
          yScale={latencyValueScale}
          strokeWidth={1}
          stroke="rgb(48, 209, 88)"
          fill="url(#area-gradient)"
          curve={curveBasis}
        />
      </svg>
    </ChartWrap>
  );
};

const ChartWrap = styled.div`
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    /* background: red; */
    z-index: 99991;
    /* box-shadow: inset 6px 0 9px 0 ${p => p.theme.background.primary},
      inset -6px 0 9px 0 ${p => p.theme.background.primary}; */
  }
  /* :before {
    content: '';
    position: absolute;
    height: 100%;
    width: 12px;
    left: 0;
    top: 0;
    background: ${p =>
    `linear-gradient(90deg, ${transparentize(
      0,
      p.theme.background.primary,
    )} 0% , ${transparentize(1, p.theme.background.primary)} 100%);`};
  }
  :after {
    content: '';
    position: absolute;
    height: 100%;
    width: 12px;
    right: 0px;
    top: 0;
    background: ${p =>
    `linear-gradient(90deg, ${transparentize(
      1,
      p.theme.background.primary,
    )} 0% , ${transparentize(0, p.theme.background.primary)} 100%);`};
  } */
`;

export default AreaChart;
