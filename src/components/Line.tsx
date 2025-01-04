import React from 'react';
import { LineProps, ChartDataPoint } from '../types';
import { line } from 'd3';
import { parseToDate } from '../utils/scales';

const Line: React.FC<LineProps> = ({ data, xKey, yKey, xScale, yScale, color = 'steelblue' }) => {
  const lineData = data.filter(d => d[yKey]);
  const lineGenerator = line<ChartDataPoint>()
    .x(d => xScale(parseToDate(d[xKey])))
    .y(d => yScale(d[yKey]));

  return (
    <path
      d={lineGenerator(lineData)!}
      fill="none"
      stroke={color}
      strokeWidth={2}
    />
  );
};

export default Line;
