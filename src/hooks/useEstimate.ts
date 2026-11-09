'use client';

import { useCallback, useMemo, useState } from 'react';
import { pricing } from '@/data/pricing';
import { buildEstimateSummary, clampQuantity, computeEstimate, defaultSelection } from '@/lib/estimate';
import type { EstimateInput } from '@/types/estimate';
import type { ServiceKey } from '@/types/lead';
import type { AddOnId, Platform, TierKey } from '@/types/pricing';

const initialInput = (initial?: ServiceKey[]): EstimateInput => {
  const keys = initial && initial.length > 0 ? initial : (['web'] as ServiceKey[]);
  return {
    selections: Object.fromEntries(keys.map((key) => [key, defaultSelection(key)])),
    addOnIds: [],
    rush: false,
  };
};

/** Calculator state and derived estimate. The math lives in lib/estimate.ts so it is easy to test. */
export function useEstimate(initialServices?: ServiceKey[]) {
  const [input, setInput] = useState<EstimateInput>(() => initialInput(initialServices));

  const toggleService = useCallback((key: ServiceKey) => {
    setInput((prev) => {
      const selections = { ...prev.selections };
      if (selections[key]) delete selections[key];
      else selections[key] = defaultSelection(key);

      // Drop add-ons that no longer apply to any selected service.
      const selectedKeys = Object.keys(selections) as ServiceKey[];
      const addOnIds = prev.addOnIds.filter((id) =>
        pricing.addOns.find((a) => a.id === id)?.appliesTo.some((k) => selectedKeys.includes(k)),
      );
      return { ...prev, selections, addOnIds };
    });
  }, []);

  const setTier = useCallback((key: ServiceKey, tier: TierKey) => {
    setInput((prev) => {
      const current = prev.selections[key];
      return current ? { ...prev, selections: { ...prev.selections, [key]: { ...current, tier } } } : prev;
    });
  }, []);

  const setQuantity = useCallback((key: ServiceKey, quantity: number) => {
    setInput((prev) => {
      const current = prev.selections[key];
      if (!current) return prev;
      return {
        ...prev,
        selections: { ...prev.selections, [key]: { ...current, quantity: clampQuantity(key, quantity) } },
      };
    });
  }, []);

  const setPlatform = useCallback((platform: Platform) => {
    setInput((prev) => {
      const current = prev.selections.app;
      return current ? { ...prev, selections: { ...prev.selections, app: { ...current, platform } } } : prev;
    });
  }, []);

  const toggleAddOn = useCallback((id: AddOnId) => {
    setInput((prev) => ({
      ...prev,
      addOnIds: prev.addOnIds.includes(id) ? prev.addOnIds.filter((x) => x !== id) : [...prev.addOnIds, id],
    }));
  }, []);

  const setRush = useCallback((rush: boolean) => setInput((prev) => ({ ...prev, rush })), []);

  const result = useMemo(() => computeEstimate(input), [input]);
  const summary = useMemo(() => buildEstimateSummary(input, result), [input, result]);
  const selectedKeys = useMemo(() => Object.keys(input.selections) as ServiceKey[], [input.selections]);

  return { input, result, summary, selectedKeys, toggleService, setTier, setQuantity, setPlatform, toggleAddOn, setRush };
}
