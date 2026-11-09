'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { StarRating } from '@/components/ui/StarRating';
import { testimonials } from '@/data/testimonials';
import { cn } from '@/lib/utils';

const ROTATE_MS = 7000;
const SWIPE_PX = 50;

/**
 * Accessible carousel (WAI-ARIA carousel pattern): visible pause/play, previous/next,
 * dot navigation, swipe on touch, pauses on hover and focus, and does not auto-rotate
 * when the visitor prefers reduced motion.
 */
export function Testimonials() {
  const count = testimonials.length;
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [paused, setPaused] = useState(false);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [playing, paused, count]);

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);
  const testimonial = testimonials[index]!;
  const rotating = playing && !paused;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="mx-auto max-w-3xl"
    >
      <div
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${count}`}
        aria-live={rotating ? 'off' : 'polite'}
        onPointerDown={(event) => {
          swipeStart.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (swipeStart.current === null) return;
          const distance = event.clientX - swipeStart.current;
          swipeStart.current = null;
          if (Math.abs(distance) >= SWIPE_PX) go(distance < 0 ? 1 : -1);
        }}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
        className="touch-pan-y select-none"
      >
        <figure
          key={testimonial.id}
          className="animate-fade-up rounded-lg border border-border bg-surface p-8 text-center shadow-md md:p-12"
        >
          <StarRating rating={testimonial.rating} className="justify-center" />
          <blockquote className="mt-5 min-h-[7rem] text-xl leading-relaxed md:text-2xl">
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-6">
            <span className="block font-heading font-semibold">{testimonial.name}</span>
            <span className="text-sm text-muted">
              {testimonial.role}, {testimonial.company}
            </span>
          </figcaption>
        </figure>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause automatic rotation' : 'Start automatic rotation'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface hover:border-brand hover:text-brand"
        >
          <Icon name={playing ? 'pause' : 'play'} size={18} fill={playing ? 'none' : 'currentColor'} />
        </button>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface hover:border-brand hover:text-brand"
        >
          <Icon name="chevron-left" size={20} />
        </button>

        <ul className="order-last flex basis-full items-center justify-center sm:order-none sm:basis-auto" aria-label="Choose a testimonial">
          {testimonials.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial ${i + 1} of ${count}`}
                aria-current={i === index ? 'true' : undefined}
                className="flex h-11 w-11 items-center justify-center sm:w-9"
              >
                <span
                  className={cn('block h-2.5 rounded-full transition-all', i === index ? 'w-6 bg-brand' : 'w-2.5 bg-border')}
                />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface hover:border-brand hover:text-brand"
        >
          <Icon name="chevron-right" size={20} />
        </button>
      </div>
    </div>
  );
}
