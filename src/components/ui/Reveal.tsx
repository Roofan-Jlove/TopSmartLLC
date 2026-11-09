'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

type RevealProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
};

/**
 * Fade-and-rise entrance, once. Below the fold only.
 * Uses a plain IntersectionObserver + CSS transition (no animation library) to keep the home page's JS small.
 * With prefers-reduced-motion the content is rendered plainly: visible, no movement.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduce = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (reduce || !node) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -60px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        reduce
          ? undefined
          : {
              opacity: shown ? 1 : 0,
              transform: shown ? 'none' : 'translateY(12px)',
              transition: `opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
            }
      }
    >
      {children}
    </div>
  );
}
