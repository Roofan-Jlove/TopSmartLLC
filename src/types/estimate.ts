import type { ServiceKey } from './lead';
import type { AddOnId, Platform, TierKey } from './pricing';

export type ServiceSelection = {
  tier: TierKey;
  quantity: number;
  /** Only used for the app service. */
  platform: Platform;
};

export type EstimateInput = {
  selections: Partial<Record<ServiceKey, ServiceSelection>>;
  addOnIds: AddOnId[];
  rush: boolean;
};

export type EstimateLine = {
  id: string;
  label: string;
  detail: string;
  amount: number;
};

export type EstimateResult = {
  /** One line per selected service. */
  serviceLines: EstimateLine[];
  /** One-time add-ons. */
  addOnLines: EstimateLine[];
  /** Monthly recurring add-ons, never part of the total. */
  monthlyLines: EstimateLine[];
  subtotal: number;
  rushSurcharge: number;
  /** Total rounded to the nearest roundTo. */
  total: number;
  low: number;
  high: number;
  monthlyTotal: number;
  isEmpty: boolean;
};
