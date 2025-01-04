import React, { useState } from 'react';
import { bisector } from 'd3-array';
import { pointer } from 'd3-selection';
import { ChartDataPoint } from '../types';

interface TooltipProps {
  xPos: number;
  yPos: number;
}

const Tooltip: React.FC<TooltipProps> = ({ xPos, yPos }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number | null; time: string | null } | null>(
    null
  );

  const bisectDate = bisector<ChartDataPoint, Date>(d => new Date(d.time)).left;

  const handleMouseMove = (event: React.MouseEvent<SVGRectElement>) => {
    // ideally I wouldn't need to do this and could instead just directly pass the position. something to work on later.
    const [mouseX] = pointer(event); // Get mouse position relative to SVG
    const xValue = xScale.invert(mouseX - margin.left); // Adjust for margin
    const index = bisectDate(data, xValue);

    const closestData = data[index - 1] || data[index] || null;
    if (!closestData) return;

    const closestTime = closestData.time;
    const closestValue = percentiles.map(p => closestData[`P${p}`]).find(v => v !== undefined) || null;

    setTooltip({
      x: mouseX,
      y: yScale(closestValue || 0) + margin.top,
      value: closestValue,
      time: closestTime,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  return (
    <>
      {/* Transparent Rectangle for Mouse Events */}
      {/* <rect
        width={width - margin.left - 5}
        height={height - margin.top - 5}
        fill="transparent"
        transform={`translate(${margin.left}, ${margin.top})`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      /> */}
      {tooltip && (
        <>
          <circle cx={tooltip.x} cy={tooltip.y} r={5} fill="red" />
          <div className="tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
            <div>Time: {tooltip.time}</div>
            <div>Value: {tooltip.value}</div>
          </div>
        </>
      )}
    </>
  );
};

export default Tooltip;
