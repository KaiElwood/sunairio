import React, { useState } from 'react';
import { schemeCategory10 } from 'd3';
import './PercentileInput.css';

interface PercentileInputProps {
  percentiles: number[];
  onAdd: (percentile: number) => void;
  onRemove: (percentile: number) => void;
}

const PercentileInput: React.FC<PercentileInputProps> = ({ percentiles, onAdd, onRemove }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleAdd = () => {
    const value = parseInt(inputValue, 10);
    if (!isNaN(value) && value >= 1 && value <= 99 && !percentiles.includes(value)) {
      onAdd(value);
      setInputValue(''); // Clear the input
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  };

  return (
      <><div className='percentile-input-container'>
      <input
        type="number"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="(1-99)"
        min={1}
        max={99} />
      <button onClick={handleAdd}>Add</button>
    </div><div className="percentile-list">
        {percentiles.map((percentile, i) => (
          <div
            key={percentile}
            className="percentile-item"
            style={{
              backgroundColor: `${schemeCategory10[i % 10]}`,
            }}
          >
            <span>{`P${percentile}`}</span>
            <button
              onClick={() => onRemove(percentile)}
            >
              ×
            </button>
          </div>
        ))}
      </div></>
  );
};

export default PercentileInput;
