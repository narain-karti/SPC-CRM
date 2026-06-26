"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";

interface CounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 1.4,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState("0");

  function formatNumber(n: number): string {
    const rounded = Math.round(n);
    if (rounded >= 1000) {
      const str = rounded.toString();
      let lastThree = str.slice(-3);
      let otherNumbers = str.slice(0, -3);
      if (otherNumbers !== "") {
        lastThree = "," + lastThree;
      }
      const formatted = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
      return formatted;
    }
    return rounded.toString();
  }

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return spring.on("change", (latest) => {
      const formatted = formatNumber(latest);
      setDisplay(formatted);
    });
  }, [spring]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4 }}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}
