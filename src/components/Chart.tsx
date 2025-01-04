import React from 'react';
import Line from 'echarts-for-react';
import './Chart.css';

interface ChartDataPoint {
  time: string;
  [key: `P${number}`]: number;
}

interface ChartProps {
  data: ChartDataPoint[];
  percentiles: number[];
}

const Chart: React.FC<ChartProps> = ({ data, percentiles }) => {
  const series = percentiles.map(p => ({
    name: `P${p}`,
    type: 'line',
    data: data.map(d => [new Date(d.time), d[`P${p}`]]),
  }));

  const options = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'time' },
    yAxis: { type: 'value' },
    series,
  };

  return <Line option={options} />;
};

export default Chart;
