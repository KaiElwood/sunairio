import React from 'react';
import { LineProps, ChartDataPoint } from '../types';
import { line } from 'd3';

const Line: React.FC<LineProps> = ({ data, xKey, yKey, xScale, yScale, color = 'steelblue' }) => {
  // console.log(data, yKey, xKey);
  const lineData = data.filter(d => d[yKey]);
  // Generate the line path
  const lineGenerator = line<ChartDataPoint>()
    .x(d => xScale(new Date(d[xKey])))
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
