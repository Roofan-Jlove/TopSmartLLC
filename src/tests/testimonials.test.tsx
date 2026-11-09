import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Testimonials } from '@/components/sections/Testimonials';
import { testimonials } from '@/data/testimonials';

// jsdom has no PointerEvent, so give it one that carries clientX (MouseEvent already does).
class TestPointerEvent extends MouseEvent {}
window.PointerEvent = TestPointerEvent as unknown as typeof PointerEvent;

function mockMotionPreference(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

const slideLabel = () => screen.getByRole('group', { name: /of \d+/ }).getAttribute('aria-label');
const quote = () => document.querySelector('blockquote')?.textContent ?? '';

beforeEach(() => {
  vi.useFakeTimers();
  mockMotionPreference(false);
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('Testimonials carousel', () => {
  it('has the carousel landmarks and starts on the first slide', () => {
    render(<Testimonials />);
    const region = screen.getByRole('region', { name: 'Client testimonials' });
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`);
    expect(quote()).toContain(testimonials[0]!.quote);
  });

  it('moves with previous and next and wraps around', () => {
    render(<Testimonials />);
    fireEvent.click(screen.getByRole('button', { name: 'Next testimonial' }));
    expect(slideLabel()).toBe(`2 of ${testimonials.length}`);
    fireEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous testimonial' }));
    expect(slideLabel()).toBe(`${testimonials.length} of ${testimonials.length}`);
  });

  it('jumps to a slide from the dots', () => {
    render(<Testimonials />);
    fireEvent.click(screen.getByRole('button', { name: `Show testimonial 3 of ${testimonials.length}` }));
    expect(quote()).toContain(testimonials[2]!.quote);
  });

  it('rotates automatically every 7 seconds', () => {
    render(<Testimonials />);
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(slideLabel()).toBe(`2 of ${testimonials.length}`);
  });

  it('stops rotating when paused and resumes on play', () => {
    render(<Testimonials />);
    fireEvent.click(screen.getByRole('button', { name: 'Pause automatic rotation' }));
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`);

    fireEvent.click(screen.getByRole('button', { name: 'Start automatic rotation' }));
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(slideLabel()).toBe(`2 of ${testimonials.length}`);
  });

  it('pauses while hovered or focused', () => {
    render(<Testimonials />);
    const region = screen.getByRole('region', { name: 'Client testimonials' });
    fireEvent.mouseEnter(region);
    act(() => {
      vi.advanceTimersByTime(20000);
    });
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`);
    fireEvent.mouseLeave(region);
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(slideLabel()).toBe(`2 of ${testimonials.length}`);
  });

  it('does not auto-rotate for visitors who prefer reduced motion', () => {
    mockMotionPreference(true);
    render(<Testimonials />);
    expect(screen.getByRole('button', { name: 'Start automatic rotation' })).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`);
  });

  it('announces slide changes politely only when not auto-rotating', () => {
    render(<Testimonials />);
    const slide = () => screen.getByRole('group', { name: /of \d+/ });
    expect(slide().getAttribute('aria-live')).toBe('off');
    fireEvent.click(screen.getByRole('button', { name: 'Pause automatic rotation' }));
    expect(slide().getAttribute('aria-live')).toBe('polite');
  });

  it('swipes left for next and right for previous, ignoring tiny movements', () => {
    render(<Testimonials />);
    const slide = screen.getByRole('group', { name: /of \d+/ });

    fireEvent.pointerDown(slide, { clientX: 300 });
    fireEvent.pointerUp(slide, { clientX: 310 });
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`);

    fireEvent.pointerDown(slide, { clientX: 300 });
    fireEvent.pointerUp(slide, { clientX: 200 });
    expect(slideLabel()).toBe(`2 of ${testimonials.length}`);

    fireEvent.pointerDown(slide, { clientX: 100 });
    fireEvent.pointerUp(slide, { clientX: 250 });
    expect(slideLabel()).toBe(`1 of ${testimonials.length}`);
  });
});
