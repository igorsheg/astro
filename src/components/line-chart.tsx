import { transparentize } from 'polished';
import React, { FC } from 'react';
import styled from 'styled-components';

const HEIGHT = 30;
const WIDTH = 100;

type LineChartPoint = {
  x: number;
  y: number;
};
interface LineChartProps {
  data: LineChartPoint[];
}

const LineChart: FC<LineChartProps> = ({ data }) => {
  const maximumXFromData = Math.max(...data.map(e => e.x));
  const maximumYFromData = Math.max(...data.map(e => e.y));

  const digits = parseFloat(maximumYFromData.toString()).toFixed().length + 1;

  const padding = digits * 1;
  const chartWidth = WIDTH - padding;
  const chartHeight = HEIGHT - padding;

  const points = data
    .map(element => {
      const x = (element.x / maximumXFromData) * chartWidth;
      const y = chartHeight - (element.y / maximumYFromData) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  const pointsPath = data.map(element => {
    const x = (element.x / maximumXFromData) * chartWidth;
    const y = chartHeight - (element.y / maximumYFromData) * chartHeight;
    return { x, y };
  });

  return (
    <ChartWrap endX={pointsPath[pointsPath.length - 1].x}>
      <StyledChart viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <path
          d={`M ${pointsPath[0].x} ${pointsPath[0].y}  ${pointsPath.map(
            p => `L ${p.x} ${p.y}`,
          )} L ${pointsPath[pointsPath.length - 1].x} ${HEIGHT} z`}
          fill="url(#myGradient)"
        />
        <polyline points={points} />
        <defs>
          <linearGradient id="myGradient" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="rgb(48, 209, 88)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="rgb(48, 209, 88);" stopOpacity="0" />
          </linearGradient>
        </defs>
      </StyledChart>
    </ChartWrap>
  );
};

const ChartWrap = styled.div<{ endX: number }>`
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  :before {
    content: '';
    position: absolute;
    height: 100%;
    width: 60px;
    left: 0;
    top: 0;

    background: ${p =>
      `linear-gradient(90deg, ${transparentize(
        0,
        p.theme.background.secondary,
      )} 0% , ${transparentize(1, p.theme.background.secondary)} 100%);`};
  }
  :after {
    content: '';
    position: absolute;
    height: 100%;
    width: 60px;
    right: 15px;
    top: 0;

    background: ${p =>
      `linear-gradient(90deg, ${transparentize(
        1,
        p.theme.background.secondary,
      )} 0% , ${transparentize(0, p.theme.background.secondary)} 100%);`};
  }
`;

const StyledChart = styled.svg``;

export default LineChart;
