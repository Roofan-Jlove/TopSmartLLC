import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useEstimate } from '@/hooks/useEstimate';
import { buildEstimateSummary, clampQuantity, computeEstimate } from '@/lib/estimate';
import type { EstimateInput } from '@/types/estimate';

const input = (partial: Partial<EstimateInput>): EstimateInput => ({
  selections: {},
  addOnIds: [],
  rush: false,
  ...partial,
});

describe('computeEstimate: worked examples from SERVICE_SPECIFICATIONS.md', () => {
  it('web growth, 15 pages = $3,950 (range $3,560 to $4,740)', () => {
    const r = computeEstimate(input({ selections: { web: { tier: 'growth', quantity: 15, platform: 'both' } } }));
    expect(r.subtotal).toBe(3950);
    expect(r.total).toBe(3950);
    expect([r.low, r.high]).toEqual([3560, 4740]);
  });

  it('app starter, 10 screens, both platforms = $9,750 (range $8,780 to $11,700)', () => {
    const r = computeEstimate(input({ selections: { app: { tier: 'starter', quantity: 10, platform: 'both' } } }));
    expect(r.subtotal).toBe(9750);
    expect([r.low, r.high]).toEqual([8780, 11700]);
  });

  it('app on a single platform has no multiplier', () => {
    const r = computeEstimate(input({ selections: { app: { tier: 'starter', quantity: 10, platform: 'ios' } } }));
    expect(r.subtotal).toBe(6500);
  });

  it('content growth, 5000 words = $750 (range $680 to $900)', () => {
    const r = computeEstimate(input({ selections: { content: { tier: 'growth', quantity: 5000, platform: 'both' } } }));
    expect(r.subtotal).toBe(750);
    expect([r.low, r.high]).toEqual([680, 900]);
  });

  it('ebook premium, 200 pages = $9,500 (range $8,550 to $11,400)', () => {
    const r = computeEstimate(input({ selections: { ebook: { tier: 'premium', quantity: 200, platform: 'both' } } }));
    expect(r.subtotal).toBe(9500);
    expect([r.low, r.high]).toEqual([8550, 11400]);
  });

  it('web starter + SEO audit + branding, rush = $3,310 (range $2,980 to $3,970)', () => {
    const r = computeEstimate(
      input({
        selections: { web: { tier: 'starter', quantity: 5, platform: 'both' } },
        addOnIds: ['seo-audit', 'branding-logo'],
        rush: true,
      }),
    );
    expect(r.subtotal).toBe(2450);
    expect(r.total).toBe(3310);
    expect([r.low, r.high]).toEqual([2980, 3970]);
  });

  it('web growth 12 pages + maintenance: monthly stays out of the total', () => {
    const r = computeEstimate(
      input({ selections: { web: { tier: 'growth', quantity: 12, platform: 'both' } }, addOnIds: ['maintenance'] }),
    );
    expect(r.total).toBe(3500);
    expect(r.monthlyTotal).toBe(120);
    expect([r.low, r.high]).toEqual([3150, 4200]);
  });
});

describe('computeEstimate: edge cases', () => {
  it('is empty with no services', () => {
    const r = computeEstimate(input({}));
    expect(r.isEmpty).toBe(true);
    expect(r.total).toBe(0);
  });

  it('charges nothing extra at or below the included units', () => {
    const r = computeEstimate(input({ selections: { web: { tier: 'starter', quantity: 2, platform: 'both' } } }));
    expect(r.subtotal).toBe(1500);
  });

  it('sums multiple services', () => {
    const r = computeEstimate(
      input({
        selections: {
          web: { tier: 'starter', quantity: 5, platform: 'both' },
          content: { tier: 'starter', quantity: 1000, platform: 'both' },
        },
      }),
    );
    expect(r.subtotal).toBe(1500 + 50 + 80);
  });

  it('ignores add-ons that do not apply to any selected service', () => {
    const r = computeEstimate(
      input({ selections: { content: { tier: 'starter', quantity: 1000, platform: 'both' } }, addOnIds: ['maintenance'] }),
    );
    expect(r.monthlyLines).toHaveLength(0);
  });

  it('counts a shared add-on once even with several services selected', () => {
    const r = computeEstimate(
      input({
        selections: {
          web: { tier: 'starter', quantity: 5, platform: 'both' },
          app: { tier: 'starter', quantity: 8, platform: 'ios' },
        },
        addOnIds: ['seo-audit'],
      }),
    );
    expect(r.addOnLines).toHaveLength(1);
    expect(r.subtotal).toBe(1500 + 6000 + 350);
  });

  it('clamps quantities to the allowed range', () => {
    expect(clampQuantity('web', 0)).toBe(1);
    expect(clampQuantity('web', 5000)).toBe(100);
    expect(clampQuantity('ebook', 99999)).toBe(600);
    expect(clampQuantity('content', Number.NaN)).toBe(1000);
  });
});

describe('buildEstimateSummary', () => {
  it('lists lines, add-ons, rush and the range', () => {
    const state = input({
      selections: { web: { tier: 'starter', quantity: 5, platform: 'both' } },
      addOnIds: ['seo-audit', 'maintenance'],
      rush: true,
    });
    const text = buildEstimateSummary(state, computeEstimate(state));
    expect(text).toContain('Web Design & Development (Starter, 5 pages): $1,500');
    expect(text).toContain('Add-on, SEO audit: $350');
    expect(text).toContain('$120 per month');
    expect(text).toContain('Rush delivery');
    expect(text).toContain('Estimated range:');
    expect(text.length).toBeLessThanOrEqual(2000);
  });

  it('is empty when nothing is selected', () => {
    expect(buildEstimateSummary(input({}), computeEstimate(input({})))).toBe('');
  });
});

describe('useEstimate', () => {
  it('starts with web selected and recalculates on changes', () => {
    const { result } = renderHook(() => useEstimate());
    expect(result.current.selectedKeys).toEqual(['web']);
    const before = result.current.result.total;
    act(() => result.current.setTier('web', 'premium'));
    expect(result.current.result.total).toBeGreaterThan(before);
  });

  it('removes add-ons that stop applying when a service is deselected', () => {
    const { result } = renderHook(() => useEstimate(['web']));
    act(() => result.current.toggleAddOn('maintenance'));
    expect(result.current.input.addOnIds).toContain('maintenance');
    act(() => result.current.toggleService('content'));
    act(() => result.current.toggleService('web'));
    expect(result.current.input.addOnIds).not.toContain('maintenance');
  });

  it('clamps quantity changes', () => {
    const { result } = renderHook(() => useEstimate(['ebook']));
    act(() => result.current.setQuantity('ebook', 5000));
    expect(result.current.input.selections.ebook?.quantity).toBe(600);
  });
});
