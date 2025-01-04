import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat, timeParse } from 'd3';
import { ChartDataPoint, IntervalOption } from '../types';
import { toZonedTime } from 'date-fns-tz';

export const parseHoursTime = timeParse('%Y-%m-%d %H');

export const parseToDate: (d: string) => Date = (d: string) => {
  // if the input format is %Y-%m-%d %H, parse it accordingly
  if (d.includes(' ')) {
    const newDate = parseHoursTime(d) || new Date(0);
    return toZonedTime(newDate, 'UTC');
  }
  const date = toZonedTime(new Date(d), 'UTC');
  return date;
};

export function createAxisBottom(
  node: SVGGElement | null,
  xScale: d3.ScaleTime<number, number>,
  interval: IntervalOption,
  data: ChartDataPoint[]
) {
  if (node) {
    const tickCount = interval === '%Y-%m' ? 3 : 10; // Customize tick count based on interval
    const tickValues = calculateTicks(xScale, interval, data, tickCount);
    console.log('data: ', data);
    console.log('Custom Tick Values:', tickValues);

    select(node).call(
      axisBottom(xScale)
        .tickValues(tickValues) // Use custom ticks
        .tickFormat(getTickFormat(interval)) // Format ticks
    );
  }
}

export function createAxisLeft(node: SVGGElement | null, yScale: d3.AxisScale<number | { valueOf(): number }>) {
  if (node) {
    select(node).call(axisLeft(yScale));
  }
}

export function calculateTicks(
  scale: d3.ScaleTime<number, number>,
  interval: IntervalOption,
  data: ChartDataPoint[],
  tickCount: number
): Date[] {
  // Custom logic to calculate ticks
  if (interval === '%Y-%m') {
    return data.map(d => parseToDate(d.time)).filter((_, i) => i % Math.ceil(data.length / tickCount) === 0);
  } else if (interval === '%Y-%m-%d %H') {
    return data.map(d => parseToDate(d.time)).filter((_, i) => i % Math.ceil(data.length / tickCount) === 0);
  }

  // Default evenly spaced ticks
  const range = scale.range();
  console.log(range)
  const step = (range[1] - range[0]) / (tickCount - 1);
  return Array.from({ length: tickCount }, (_, i) => new Date(scale.invert(range[0] + i * step)));
}

export function getTickFormat(interval: IntervalOption) {
  const formatMap: { [key in IntervalOption]: string } = {
    '%Y-%m-%d %H': '%m/%d %H:00', // Hours
    '%Y-%m-%d': '%m/%d', // Days
    '%Y-%m': '%m', // Months
  };

  const format = formatMap[interval] || '%m'; // Fallback to months
  return (d: number | { valueOf(): number }) => {
    // const date = toZonedTime(d.valueOf(), 'America/Chicago');
    const date = new Date(d.valueOf());
    return timeFormat(format)(date);
  };
}
