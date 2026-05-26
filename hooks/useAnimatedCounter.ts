import { useState, useEffect } from "react";

export function useAnimatedCounter(target: number, duration = 2000, start = false): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    const steps = 60;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setValue(Math.floor(target * ease));
      if (step >= steps) {
        setValue(target);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, duration, start]);

  return value;
}
