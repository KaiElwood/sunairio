import React, { useRef } from 'react';
import { scaleTime } from 'd3-scale';
import { extent, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';
import { ChartDataPoint, IntervalOption } from '../types';
import Line from './Line';
import { createAxisBottom, createAxisLeft } from '../utils/scales';
import { useResizeObserver } from '../hooks/useResizeObserver';
import './LineChart.css'

interface LineChartProps {
  data: ChartDataPoint[];
  percentiles: number[];
  interval: IntervalOption
  height?: number;
}

const LineChart: React.FC<LineChartProps> = ({ data, percentiles, interval, height = 400 }) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { width } = useResizeObserver(chartRef);
  // Dimensions and margins
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  console.log('linechart data:', data)

  // Contextual values
  const xScale = scaleTime()
    .domain(extent(data, d => new Date(d.time)) as [Date, Date])
    .range([0, innerWidth]);

  const yScale = scaleLinear()
    .domain([
      0,
      max(data, d => max(percentiles.map(p => d[`P${p}`])))!,
    ])
    .nice()
    .range([innerHeight, 0]);

  return (
    <div ref={chartRef} className='chart-container'>
      <svg width={width} height={height}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Axes */}
          <g
            transform={`translate(0, ${innerHeight})`}
            ref={node => createAxisBottom(node, xScale, interval, data)}
          />
          <g ref={node => createAxisLeft(node, yScale)} />

          {percentiles.map((percentile, index) => (
            <Line
              key={percentile}
              data={data}
              xKey="time"
              yKey={`P${percentile}`}
              xScale={xScale}
              yScale={yScale}
              color={schemeCategory10[index % 10]}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};

export default LineChart;
