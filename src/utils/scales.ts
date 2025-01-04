import { select } from 'd3-selection';
import { axisBottom, axisLeft } from 'd3-axis';
import { timeFormat, timeParse } from 'd3';
import { ChartDataPoint, IntervalOption } from '../types';
import { toZonedTime } from 'date-fns-tz';

export const parseHoursTime = timeParse('%Y-%m-%d %H');

export const parseToDate: (d: string) => Date = (d: string) => {
  // if the input format is %Y-%m-%d %H, parse it accordingly
  if (d.includes(' ')) {
    return parseHoursTime(d) || new Date(0);
  }
  const date = new Date(d.valueOf());
  return date;
};

function getTickFormat(interval: IntervalOption) {
  const formatTime = (d: number | { valueOf(): number }) => {
    const date = toZonedTime(d.valueOf(), 'America/Chicago');
    if (interval === '%Y-%m-%d %H') {
      return timeFormat('%m/%d')(date); // Days
    } else if (interval === '%Y-%m-%d') {
      return timeFormat('%m/%d')(date); // Days
    } else if (interval === '%Y-%m') {
      return timeFormat('%m')(date); // Months
    }
    return timeFormat('%m')(date); // Default to months
  };

  return formatTime;
}

export function createAxisBottom(node: SVGGElement | null, xScale: d3.ScaleTime<number, number>, interval: IntervalOption, data: ChartDataPoint[]) {
  
  if (node) {
    const tickValues = data.length <= 4
      ? data.map(d => parseToDate(d.time)) // Use all data points if there are 4 or fewer
      : xScale.ticks(10); // Otherwise, use up to 10 evenly spaced ticks
    select(node).call(
      axisBottom(xScale)
        .tickValues(tickValues)
        .tickFormat(getTickFormat(interval))
    );
  }
}

export function createAxisLeft(node: SVGGElement | null, yScale: d3.AxisScale<number | { valueOf(): number }>) {
  if (node) {
    select(node).call(axisLeft(yScale));
  }
}