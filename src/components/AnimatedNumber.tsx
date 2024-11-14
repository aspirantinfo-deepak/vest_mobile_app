import React, { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number; // The final number to animate to
  duration?: number; // Duration in ms
  format?: (value: number) => string; // Optional formatting function
}
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};
const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0); // Current displayed value
  const startValue = useRef<number>(0); // Keeps track of initial value
  const startTime = useRef<number | null>(null); // Start time for animation

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;

      const progress = Math.min((timestamp - startTime.current) / duration, 1); // Progress between 0 and 1
      const newValue =
        startValue.current + progress * (value - startValue.current);

      setDisplayValue(newValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    startValue.current = displayValue; // Set the start value to the current value
    startTime.current = null; // Reset start time for the next animation

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{formatCurrency(displayValue)}</span>;
};

export default AnimatedNumber;
