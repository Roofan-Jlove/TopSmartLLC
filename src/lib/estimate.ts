import { pricing as defaultPricing } from '@/data/pricing';
import { services } from '@/data/services';
import type { EstimateInput, EstimateLine, EstimateResult, ServiceSelection } from '@/types/estimate';
import type { ServiceKey } from '@/types/lead';
import type { Platform, PricingConfig, TierKey } from '@/types/pricing';
import { formatUsd } from './format';

const SERVICE_ORDER: ServiceKey[] = ['web', 'app', 'content', 'ebook'];

const PLATFORM_LABEL: Record<Platform, string> = {
  android: 'Android',
  ios: 'iOS',
  both: 'Android + iOS',
};

const TIER_LABEL: Record<TierKey, string> = { starter: 'Starter', growth: 'Growth', premium: 'Premium' };

/** Rounds to cents first so binary floating point noise (e.g. 8775.000000000001) never flips a rounding step. */
function roundTo(value: number, step: number): number {
  const cleaned = Math.round(value * 100) / 100;
  return Math.round(cleaned / step) * step;
}

function cents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function clampQuantity(key: ServiceKey, quantity: number, config: PricingConfig = defaultPricing): number {
  const { minQuantity, maxQuantity, defaultQuantity } = config.services[key];
  if (!Number.isFinite(quantity)) return defaultQuantity;
  return Math.min(maxQuantity, Math.max(minQuantity, Math.round(quantity)));
}

export function defaultSelection(key: ServiceKey, config: PricingConfig = defaultPricing): ServiceSelection {
  return { tier: 'growth', quantity: config.services[key].defaultQuantity, platform: 'both' };
}

function serviceName(key: ServiceKey): string {
  return services.find((service) => service.key === key)?.name ?? key;
}

/** Pure estimate calculation. Rules: docs/SERVICE_SPECIFICATIONS.md section 7. */
export function computeEstimate(input: EstimateInput, config: PricingConfig = defaultPricing): EstimateResult {
  const serviceLines: EstimateLine[] = [];
  const selectedKeys = SERVICE_ORDER.filter((key) => input.selections[key]);

  for (const key of selectedKeys) {
    const selection = input.selections[key]!;
    const rates = config.services[key];
    const rate = rates.tiers[selection.tier];
    const quantity = clampQuantity(key, selection.quantity, config);
    const extraUnits = Math.max(0, quantity - rate.includedUnits);

    let amount = rate.base + extraUnits * rate.extraUnitPrice;
    let detail = `${TIER_LABEL[selection.tier]}, ${quantity.toLocaleString('en-US')} ${
      quantity === 1 ? rates.unitLabel : rates.unitLabelPlural
    }`;

    if (key === 'app') {
      amount *= config.platformMultiplier[selection.platform];
      detail += `, ${PLATFORM_LABEL[selection.platform]}`;
    }

    serviceLines.push({ id: key, label: serviceName(key), detail, amount: cents(amount) });
  }

  const applicableAddOns = config.addOns.filter(
    (addOn) => input.addOnIds.includes(addOn.id) && addOn.appliesTo.some((key) => selectedKeys.includes(key)),
  );

  const toLine = (addOn: (typeof applicableAddOns)[number]): EstimateLine => ({
    id: addOn.id,
    label: addOn.name,
    detail: addOn.billing === 'monthly' ? 'per month' : 'one-time',
    amount: addOn.price,
  });

  const addOnLines = applicableAddOns.filter((a) => a.billing === 'one-time').map(toLine);
  const monthlyLines = applicableAddOns.filter((a) => a.billing === 'monthly').map(toLine);

  const subtotal = cents(
    serviceLines.reduce((sum, line) => sum + line.amount, 0) + addOnLines.reduce((sum, line) => sum + line.amount, 0),
  );
  const rushSurcharge = input.rush ? cents(subtotal * (config.rushMultiplier - 1)) : 0;
  const raw = cents(subtotal + rushSurcharge);

  return {
    serviceLines,
    addOnLines,
    monthlyLines,
    subtotal,
    rushSurcharge,
    total: roundTo(raw, config.roundTo),
    low: roundTo(raw * config.range.low, config.roundTo),
    high: roundTo(raw * config.range.high, config.roundTo),
    monthlyTotal: monthlyLines.reduce((sum, line) => sum + line.amount, 0),
    isEmpty: serviceLines.length === 0,
  };
}

/** Plain-text summary passed to the order form (estimateSummary field, max 2000 chars). */
export function buildEstimateSummary(input: EstimateInput, result: EstimateResult): string {
  if (result.isEmpty) return '';
  const lines = [
    ...result.serviceLines.map((line) => `${line.label} (${line.detail}): ${formatUsd(line.amount)}`),
    ...result.addOnLines.map((line) => `Add-on, ${line.label}: ${formatUsd(line.amount)}`),
    ...result.monthlyLines.map((line) => `Add-on, ${line.label}: ${formatUsd(line.amount)} per month`),
  ];
  if (input.rush) lines.push(`Rush delivery: +${formatUsd(result.rushSurcharge)}`);
  lines.push(`Estimated range: ${formatUsd(result.low)} to ${formatUsd(result.high)} (calculator midpoint ${formatUsd(result.total)})`);
  return lines.join('\n').slice(0, 2000);
}
