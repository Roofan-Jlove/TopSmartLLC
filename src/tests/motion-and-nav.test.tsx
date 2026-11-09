import { act, cleanup, fireEvent, render, renderHook, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from '@/components/layout/Header';
import { Reveal } from '@/components/ui/Reveal';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

vi.mock('next/navigation', () => ({ usePathname: () => '/', useRouter: () => ({ push: vi.fn() }) }));

type Listener = () => void;

/** A controllable matchMedia: lets a test flip the OS preference and fire the "change" event. */
function mockReducedMotion(initial: boolean) {
  let matches = initial;
  const listeners = new Set<Listener>();
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return query.includes('prefers-reduced-motion') && matches;
    },
    media: query,
    addEventListener: (_: string, l: Listener) => listeners.add(l),
    removeEventListener: (_: string, l: Listener) => listeners.delete(l),
    // older browsers still call the legacy API
    addListener: () => {},
    removeListener: () => {},
  })) as unknown as typeof window.matchMedia;
  return {
    set(value: boolean) {
      matches = value;
      listeners.forEach((l) => l());
    },
  };
}

beforeEach(() => {
  // Reveal observes elements to know when they scroll into view
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
});
afterEach(cleanup);

describe('usePrefersReducedMotion', () => {
  it('reads the real system preference', () => {
    mockReducedMotion(true);
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(true);
    cleanup();
    mockReducedMotion(false);
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(false);
  });

  it('updates live when the preference changes', () => {
    const media = mockReducedMotion(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
    act(() => media.set(true));
    expect(result.current).toBe(true);
    act(() => media.set(false));
    expect(result.current).toBe(false);
  });
});

describe('Reveal respects reduced motion', () => {
  it('renders plain, fully visible content with no animation styles when reduced motion is requested', () => {
    mockReducedMotion(true);
    const { container } = render(
      <Reveal className="wrapper">
        <p>Hello</p>
      </Reveal>,
    );
    const wrapper = container.querySelector('.wrapper') as HTMLElement;
    expect(wrapper.getAttribute('style')).toBeNull();
    expect(wrapper.textContent).toBe('Hello');
  });

  it('starts hidden (to fade in on scroll) when there is no preference', () => {
    mockReducedMotion(false);
    const { container } = render(
      <Reveal className="wrapper">
        <p>Hello</p>
      </Reveal>,
    );
    const wrapper = container.querySelector('.wrapper') as HTMLElement;
    expect(wrapper.style.opacity).toBe('0');
  });

  it('becomes visible as soon as the visitor switches reduced motion on', () => {
    const media = mockReducedMotion(false);
    const { container } = render(
      <Reveal className="wrapper">
        <p>Hello</p>
      </Reveal>,
    );
    expect((container.querySelector('.wrapper') as HTMLElement).style.opacity).toBe('0');
    act(() => media.set(true));
    const wrapper = container.querySelector('.wrapper') as HTMLElement;
    expect(wrapper.style.opacity).toBe('');
    expect(wrapper.style.transform).toBe('');
  });
});

describe('Services dropdown with a mouse', () => {
  const servicesButton = () => screen.getByRole('button', { name: /Services/ });
  const menu = () => document.querySelector('#services-menu');

  it('stays open when a mouse user hovers and then clicks (hover must not be undone by the click)', () => {
    render(<Header />);
    const wrapper = servicesButton().parentElement as HTMLElement;

    fireEvent.mouseEnter(wrapper); // the pointer arrives: menu opens
    expect(menu()).not.toBeNull();
    fireEvent.click(servicesButton()); // ...and the click that follows must not close it
    expect(menu()).not.toBeNull();
    expect(servicesButton().getAttribute('aria-expanded')).toBe('true');
  });

  it('a second click then closes it', () => {
    render(<Header />);
    const wrapper = servicesButton().parentElement as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    fireEvent.click(servicesButton());
    fireEvent.click(servicesButton());
    expect(menu()).toBeNull();
  });

  it('closes when the pointer leaves', () => {
    render(<Header />);
    const wrapper = servicesButton().parentElement as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    fireEvent.mouseLeave(wrapper);
    expect(menu()).toBeNull();
  });

  it('keyboard users (no hover) toggle it with the button as before', () => {
    render(<Header />);
    fireEvent.click(servicesButton());
    expect(menu()).not.toBeNull();
    fireEvent.click(servicesButton());
    expect(menu()).toBeNull();
  });
});
