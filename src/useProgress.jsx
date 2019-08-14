import { useState, useEffect } from 'react';

const useProgress = (animate, time) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (animate) {
      let rafId = null;
      let start = null;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        setProgress(progress);
        if (progress < time) {
          rafId = requestAnimationFrame(step);
        }
      };
      rafId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(rafId);
    }
  }, [animate, time]);

  return animate ? Math.min(progress / time, time) : 0;
};

export default useProgress;
