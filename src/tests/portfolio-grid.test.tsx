import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PortfolioGrid } from '@/components/sections/PortfolioGrid';
import { caseStudies } from '@/data/portfolio';

const replace = vi.fn();
let search = '';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
  usePathname: () => '/portfolio',
  useSearchParams: () => new URLSearchParams(search),
}));

beforeEach(() => {
  replace.mockClear();
  search = '';
});
afterEach(cleanup);

const cards = () => screen.getAllByRole('article');
const countOf = (key: string) => caseStudies.filter((c) => c.category === key).length;

describe('PortfolioGrid', () => {
  it('shows every project by default with All pressed', () => {
    render(<PortfolioGrid />);
    expect(cards()).toHaveLength(caseStudies.length);
    expect(screen.getByRole('button', { name: /^All/ }).getAttribute('aria-pressed')).toBe('true');
  });

  it('filters by the category in the URL', () => {
    search = 'category=app';
    render(<PortfolioGrid />);
    expect(cards()).toHaveLength(countOf('app'));
    expect(screen.getByRole('button', { name: /^Apps/ }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: /^All/ }).getAttribute('aria-pressed')).toBe('false');
  });

  it('falls back to All for an unknown category', () => {
    search = 'category=bogus';
    render(<PortfolioGrid />);
    expect(cards()).toHaveLength(caseStudies.length);
  });

  it('writes the chosen category to the URL without scrolling', () => {
    render(<PortfolioGrid />);
    fireEvent.click(screen.getByRole('button', { name: /^E-books/ }));
    expect(replace).toHaveBeenCalledWith('/portfolio?category=ebook', { scroll: false });
  });

  it('removes the parameter when All is chosen and keeps unrelated parameters', () => {
    search = 'category=web&utm=x';
    render(<PortfolioGrid />);
    fireEvent.click(screen.getByRole('button', { name: /^All/ }));
    expect(replace).toHaveBeenCalledWith('/portfolio?utm=x', { scroll: false });
  });

  it('goes back to the bare path when no parameters remain', () => {
    search = 'category=web';
    render(<PortfolioGrid />);
    fireEvent.click(screen.getByRole('button', { name: /^All/ }));
    expect(replace).toHaveBeenCalledWith('/portfolio', { scroll: false });
  });

  it('announces the number of projects shown', () => {
    search = 'category=content';
    render(<PortfolioGrid />);
    expect(screen.getByRole('status').textContent).toContain(`Showing ${countOf('content')} projects in Content`);
  });

  it('links each card to its case study', () => {
    render(<PortfolioGrid />);
    const first = caseStudies[0]!;
    const link = screen.getByRole('link', { name: first.title });
    expect(link.getAttribute('href')).toBe(`/portfolio/${first.slug}`);
  });
});
