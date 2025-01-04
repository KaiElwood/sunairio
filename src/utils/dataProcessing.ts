import { group, csvParse, timeFormat, quantile } from 'd3';
import { mean as d3Mean, max as d3Max, min as d3Min } from 'd3-array';
import { AggregationOption, ChartDataPoint, ParsedData } from '../types';


export async function fetchCSV(): Promise<ParsedData[]> {
  const response = await fetch('/data.csv');
  const text = await response.text();
  const data = csvParse(text);

  return data.map(d => {
    const data: { [key: number]: number } = {};
    for (let i = 1; i <= 999; i++) {
      data[i] = +(d[i] as string);
    }
    const originalTime = new Date(d.sim_datetime as string);
    const adjustedTime = new Date(originalTime.getTime() - 60 * 60 * 1000);
    return {
      time: adjustedTime,
      data,
    };
  });
}

export function groupAndAggregate(
  data: ParsedData[],
  interval: string,
  aggregation: AggregationOption,
  percentiles: number[]
): ChartDataPoint[] {
  const grouped = group(data, d => timeFormat(interval)(d.time));

  const aggregationMap: { [key: string]: (values: number[]) => number | undefined } = {
    mean: d3Mean,
    max: d3Max,
    min: d3Min,
  };

  const aggregationFunction = aggregationMap[aggregation];

  const results: ChartDataPoint[] = [];

  for (const [groupKey, rows] of grouped) {

    for (const percentile of percentiles) {
      const columnAggregates = Array.from({ length: 999 }, (_, colIndex) => {
        const columnValues = rows.map(row => row.data[colIndex + 1]);
        return aggregationFunction(columnValues) || 0;
      });
      const data = quantile(columnAggregates, percentile/100) || 0 ;
      results.push({ time: groupKey, [`P${percentile}`]: data } as ChartDataPoint);
    }
  }
  return results
}