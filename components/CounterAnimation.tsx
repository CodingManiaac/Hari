"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "@/hooks/useInView";

interface CounterAnimationProps {
  value: number;
  duration?: number;
}

export default function CounterAnimation({
  value,
  duration = 2000,
}: CounterAnimationProps) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!inView || hasStarted.current) return;
    hasStarted.current = true;

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      setCount(Math.floor(progress * value));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, inView, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}
