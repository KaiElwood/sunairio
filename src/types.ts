// Represents a single data point with time and percentiles
export interface ChartDataPoint {
  time: string;
  [key: `P${number}`]: number;
}

// Represents parsed data with 
export interface ParsedData {
  time: Date;
  data: { [key: number]: number };
}

export interface ChartProps {
  data: Array<{ time: string } & { [key: `P${number}`]: number }>;
  percentiles: number[];
}

export interface LineProps {
  data: Array<{ time: string } & { [key: `P${number}`]: number }>;
  xKey: string;
  yKey: string;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  color?: string;
}

export interface LineChartProps {
  width?: number;
  height?: number;
  children: React.ReactNode;
}

export interface LineChartChildProps {
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  innerWidth: number;
  innerHeight: number;
}

export type AggregationOption = 'mean' | 'max' | 'min';

export type IntervalOption = '%Y-%m-%d %H' | '%Y-%m-%d' | '%Y-%m';
