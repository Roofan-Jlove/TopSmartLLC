import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Calculator } from '@/components/sections/Calculator';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

beforeEach(() => {
  push.mockClear();
  sessionStorage.clear();
});
afterEach(cleanup);

const estimateRegion = () => screen.getByRole('complementary', { name: 'Your estimate' });

describe('Calculator UI', () => {
  it('starts with web selected and shows its range', () => {
    render(<Calculator />);
    expect((screen.getByRole('checkbox', { name: /Web Design & Development/ }) as HTMLInputElement).checked).toBe(true);
    // Growth, 5 pages (below the 12 included) = $3,500 -> $3,150 to $4,200
    expect(estimateRegion().textContent).toContain('$3,150 – $4,200');
  });

  it('recalculates when the quantity changes', () => {
    render(<Calculator />);
    fireEvent.change(screen.getByLabelText('Number of pages'), { target: { value: '15' } });
    expect(estimateRegion().textContent).toContain('$3,560 – $4,740');
  });

  it('shows the app platform choice only when the app service is selected', () => {
    render(<Calculator />);
    expect(screen.queryByRole('radiogroup', { name: 'Platform' })).toBeNull();
    fireEvent.click(screen.getByRole('checkbox', { name: /Mobile App Development/ }));
    expect(screen.getByRole('radiogroup', { name: 'Platform' })).toBeTruthy();
  });

  it('adds one-time extras and lists monthly ones separately', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('checkbox', { name: /SEO audit/ }));
    fireEvent.click(screen.getByRole('checkbox', { name: /Maintenance plan/ }));
    const region = estimateRegion();
    expect(region.textContent).toContain('$350');
    expect(region.textContent).toContain('$120/mo');
    expect(region.textContent).toContain('not in total');
  });

  it('applies rush delivery', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Rush delivery/ }));
    expect(estimateRegion().textContent).toContain('+$1,225');
  });

  it('disables sending when nothing is selected', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('checkbox', { name: /Web Design & Development/ }));
    expect(estimateRegion().textContent).toContain('Select at least one service');
    expect((screen.getByRole('button', { name: /Send this estimate/ }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('hands the estimate to the order form', () => {
    render(<Calculator />);
    fireEvent.click(screen.getByRole('checkbox', { name: /E-book Creation & Publishing/ }));
    fireEvent.click(screen.getByRole('button', { name: /Send this estimate/ }));

    expect(push).toHaveBeenCalledWith('/contact?source=calculator&services=web,ebook');
    const stored = JSON.parse(sessionStorage.getItem('tsl.estimate') ?? '{}');
    expect(stored.services).toEqual(['web', 'ebook']);
    expect(stored.summary).toContain('Estimated range:');
  });

  it('has a polite live region for result announcements', () => {
    render(<Calculator />);
    const live = estimateRegion().querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live?.getAttribute('role')).toBe('status');
  });
});
