import { useState, useEffect } from 'react';

export const useResizeObserver = (ref: React.RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (!ref.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (entries[0]?.contentRect) {
        const { width, height } = entries[0].contentRect;
        setDimensions({ width, height });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [ref]);

  return dimensions;
};
