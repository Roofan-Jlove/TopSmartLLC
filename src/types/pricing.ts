import type { ServiceKey } from './lead';

export type TierKey = 'starter' | 'growth' | 'premium';
export type AddOnId =
  | 'seo-audit'
  | 'branding-logo'
  | 'maintenance'
  | 'uiux-audit'
  | 'social-pack'
  | 'hosting-domain';
export type Platform = 'android' | 'ios' | 'both';

export type TierRate = {
  base: number;
  includedUnits: number;
  extraUnitPrice: number;
};

export type ServiceRates = {
  unitLabel: string;
  unitLabelPlural: string;
  defaultQuantity: number;
  minQuantity: number;
  maxQuantity: number;
  tiers: Record<TierKey, TierRate>;
};

export type AddOn = {
  id: AddOnId;
  name: string;
  description: string;
  price: number;
  billing: 'one-time' | 'monthly';
  appliesTo: ServiceKey[];
};

export type PricingConfig = {
  services: Record<ServiceKey, ServiceRates>;
  addOns: AddOn[];
  rushMultiplier: number;
  platformMultiplier: Record<Platform, number>;
  range: { low: number; high: number };
  roundTo: number;
};
