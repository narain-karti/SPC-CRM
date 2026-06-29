import { motion, useInView } from "motion/react";
import { useRef, useEffect, useState } from "react";

function Counter({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function Stats() {
  const stats = [
    { value: 15, suffix: "+", label: "Years Experience" },
    { value: 25000, suffix: "+", label: "Patients Helped" },
    { value: 300, suffix: "+", label: "Corporate Events" },
    { value: 27, suffix: "+", label: "Sports Clubs" },
    { value: 5, suffix: "", label: "Branches" },
  ];

  return (
    <div className="pt-8 pb-4 md:pt-10 md:pb-8 grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
      {stats.map((stat, index) => (
        <motion.div 
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className={`flex flex-col items-center justify-center text-center px-4 ${index === 4 ? 'col-span-2 md:col-span-1 pt-8 md:pt-0' : 'pt-8 md:pt-0 first:pt-0 md:first:pt-0'}`}
        >
          <div className="text-3xl lg:text-5xl font-bold text-white mb-2">
            <Counter end={stat.value} suffix={stat.suffix} />
          </div>
          <div className="text-sm font-medium text-white/60 tracking-wide uppercase">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
