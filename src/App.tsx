import React, { useEffect, useState } from 'react';
import { fetchCSV, groupAndAggregate } from './utils/dataProcessing';

import './App.css';
import { AggregationOption, ChartDataPoint, IntervalOption } from './types';
import LineChart from './components/LineChart';
import PercentileInput from './components/PercentileInput';

const App: React.FC = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [percentiles, setPercentiles] = useState<number[]>([]);
  const [aggregation, setAggregation] = useState<AggregationOption>('mean');
  const [interval, setInterval] = useState<IntervalOption>('%Y-%m-%d'); // Default: daily

  useEffect(() => {
    const loadData = async () => {
      const rawData = await fetchCSV();
      const aggregatedData = groupAndAggregate(rawData, interval, aggregation, percentiles);
      setData(aggregatedData);
    };

    loadData();
  }, [percentiles, aggregation, interval]);

  const handleAddPercentile = (percentile: number) => {
    setPercentiles(prev => [...prev, percentile]);
  };

  const handleRemovePercentile = (percentile: number) => {
    setPercentiles(prev => prev.filter(p => p !== percentile));
  };

  return (
    <div className='container'>
      <h1 className='heading-main'>Load Simulations</h1>
      <div>
        <label>
          Aggregation:
          <select value={aggregation} onChange={e => setAggregation(e.target.value as AggregationOption)}>
            <option value="mean">Mean</option>
            <option value="max">Max</option>
            <option value="min">Min</option>
          </select>
        </label>
        <label>
          Interval:
          <select value={interval} onChange={e => setInterval(e.target.value as IntervalOption)}>
            <option value="%Y-%m-%d %H">Hourly</option>
            <option value="%Y-%m-%d">Daily</option>
            <option value="%Y-%m">Monthly</option>
          </select>
        </label>
        <label>
          Percentiles:
          <PercentileInput
            percentiles={percentiles}
            onAdd={handleAddPercentile}
            onRemove={handleRemovePercentile}
          />
        </label>
      </div>
      {data.length > 0 && <LineChart data={data} percentiles={percentiles} interval={interval} /> || <p>Waiting for data...</p>}
    </div>
  );
};

export default App;
