'use client';

import { useEffect, useRef, useState } from 'react';
import { stats } from '@/data/site';

function useCountUp(target: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setValue(0);
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [target]);

  return { ref, value };
}

function StatItem({ value: target, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value } = useCountUp(target);
  return (
    <div className="text-center">
      <p className="font-heading text-4xl font-bold md:text-5xl">
        <span ref={ref}>{value}</span>
        {suffix}
      </p>
      <p className="mt-2 text-sm text-muted md:text-base">{label}</p>
    </div>
  );
}

export function Stats() {
  return (
    <section aria-label="TopSmartLLC in numbers" className="py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 rounded-lg border border-border bg-surface p-8 shadow-sm md:grid-cols-4 md:p-12">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
