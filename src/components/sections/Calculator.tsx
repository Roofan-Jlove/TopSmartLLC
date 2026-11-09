'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { pricing } from '@/data/pricing';
import { services } from '@/data/services';
import { useEstimate } from '@/hooks/useEstimate';
import { clampQuantity } from '@/lib/estimate';
import { formatUsd } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ServiceKey } from '@/types/lead';
import type { Platform, TierKey } from '@/types/pricing';

const TIERS: { key: TierKey; label: string }[] = [
  { key: 'starter', label: 'Starter' },
  { key: 'growth', label: 'Growth' },
  { key: 'premium', label: 'Premium' },
];

const PLATFORMS: { key: Platform; label: string }[] = [
  { key: 'android', label: 'Android' },
  { key: 'ios', label: 'iOS' },
  { key: 'both', label: 'Both (+50%)' },
];

const ESTIMATE_STORAGE_KEY = 'tsl.estimate';

const choiceBase =
  'flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-border bg-surface px-4 text-sm font-medium transition peer-checked:border-brand peer-checked:bg-brand peer-checked:text-brand-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-brand';

function QuantityField({
  serviceKey,
  value,
  onCommit,
}: {
  serviceKey: ServiceKey;
  value: number;
  onCommit: (value: number) => void;
}) {
  const id = useId();
  const rates = pricing.services[serviceKey];
  const [text, setText] = useState(String(value));

  // Keep the field in sync when the value changes from outside (e.g. clamped).
  useEffect(() => setText(String(value)), [value]);

  const commit = (raw: string) => {
    const parsed = Number(raw.replace(/,/g, ''));
    const next = clampQuantity(serviceKey, parsed);
    setText(String(next));
    onCommit(next);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium">
        Number of {rates.unitLabelPlural}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          const parsed = Number(event.target.value.replace(/,/g, ''));
          if (event.target.value.trim() !== '' && Number.isFinite(parsed) && parsed >= rates.minQuantity) {
            onCommit(clampQuantity(serviceKey, parsed));
          }
        }}
        onBlur={(event) => commit(event.target.value)}
        className="mt-1.5 h-12 w-full rounded-sm border border-border bg-bg px-4 text-base focus-visible:border-brand"
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
        Allowed: {rates.minQuantity.toLocaleString('en-US')} to {rates.maxQuantity.toLocaleString('en-US')}.
      </p>
    </div>
  );
}

function rateHint(serviceKey: ServiceKey, tier: TierKey): string {
  const rates = pricing.services[serviceKey];
  const rate = rates.tiers[tier];
  const extra = rate.extraUnitPrice < 1 ? `$${rate.extraUnitPrice.toFixed(2)}` : formatUsd(rate.extraUnitPrice);
  if (rate.includedUnits > 0) {
    return `Includes ${rate.includedUnits} ${rates.unitLabelPlural}. Each extra ${rates.unitLabel} is ${extra}.`;
  }
  return `${formatUsd(rate.base)} base plus ${extra} per ${rates.unitLabel}.`;
}

export function Calculator() {
  const router = useRouter();
  const { input, result, summary, selectedKeys, toggleService, setTier, setQuantity, setPlatform, toggleAddOn, setRush } =
    useEstimate();

  const availableAddOns = pricing.addOns.filter((addOn) => addOn.appliesTo.some((key) => selectedKeys.includes(key)));

  // Debounced text for the screen-reader live region so typing does not flood announcements.
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncement(
        result.isEmpty
          ? 'No service selected.'
          : `Estimated project cost ${formatUsd(result.low)} to ${formatUsd(result.high)}.`,
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [result.isEmpty, result.low, result.high]);

  const sendEstimate = () => {
    try {
      sessionStorage.setItem(ESTIMATE_STORAGE_KEY, JSON.stringify({ services: selectedKeys, summary }));
    } catch {
      // Storage can be unavailable (private mode). The form still opens with the services pre-selected.
    }
    router.push(`/contact?source=calculator&services=${selectedKeys.join(',')}`);
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-6">
        <fieldset className="rounded-lg border border-border bg-surface p-5 md:p-7">
          <legend className="px-2 font-heading text-lg font-semibold">1. What do you need?</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {services.map((service) => (
              <label key={service.key} className="block">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={selectedKeys.includes(service.key)}
                  onChange={() => toggleService(service.key)}
                />
                <span className="flex min-h-[64px] cursor-pointer items-center gap-3 rounded-md border border-border bg-surface p-4 transition peer-checked:border-brand peer-checked:bg-bg-subtle peer-checked:ring-1 peer-checked:ring-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-brand">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-bg-subtle text-brand">
                    <Icon name={service.icon} size={22} />
                  </span>
                  <span className="text-sm font-semibold leading-snug">{service.name}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {selectedKeys.length > 0 ? (
          <div className="rounded-lg border border-border bg-surface p-5 md:p-7">
            <h3 className="font-heading text-lg">2. Size your project</h3>
            <div className="mt-4 space-y-6">
              {services
                .filter((service) => selectedKeys.includes(service.key))
                .map((service) => {
                  const selection = input.selections[service.key]!;
                  return (
                    <fieldset key={service.key} className="rounded-md border border-border p-4 md:p-5">
                      <legend className="px-2 text-sm font-semibold text-brand">{service.name}</legend>
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <p className="text-sm font-medium" id={`tier-label-${service.key}`}>
                            Package
                          </p>
                          <div role="radiogroup" aria-labelledby={`tier-label-${service.key}`} className="mt-1.5 flex flex-wrap gap-2">
                            {TIERS.map((tier) => (
                              <label key={tier.key}>
                                <input
                                  type="radio"
                                  className="peer sr-only"
                                  name={`tier-${service.key}`}
                                  checked={selection.tier === tier.key}
                                  onChange={() => setTier(service.key, tier.key)}
                                />
                                <span className={choiceBase}>{tier.label}</span>
                              </label>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-muted">{rateHint(service.key, selection.tier)}</p>
                        </div>
                        <QuantityField
                          serviceKey={service.key}
                          value={selection.quantity}
                          onCommit={(value) => setQuantity(service.key, value)}
                        />
                      </div>
                      {service.key === 'app' ? (
                        <div className="mt-5">
                          <p className="text-sm font-medium" id="platform-label">
                            Platform
                          </p>
                          <div role="radiogroup" aria-labelledby="platform-label" className="mt-1.5 flex flex-wrap gap-2">
                            {PLATFORMS.map((platform) => (
                              <label key={platform.key}>
                                <input
                                  type="radio"
                                  className="peer sr-only"
                                  name="platform"
                                  checked={selection.platform === platform.key}
                                  onChange={() => setPlatform(platform.key)}
                                />
                                <span className={choiceBase}>{platform.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </fieldset>
                  );
                })}
            </div>
          </div>
        ) : null}

        {selectedKeys.length > 0 ? (
          <fieldset className="rounded-lg border border-border bg-surface p-5 md:p-7">
            <legend className="px-2 font-heading text-lg font-semibold">3. Extras</legend>
            <ul className="mt-2 grid gap-3 sm:grid-cols-2">
              {availableAddOns.map((addOn) => (
                <li key={addOn.id}>
                  <label className="block">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={input.addOnIds.includes(addOn.id)}
                      onChange={() => toggleAddOn(addOn.id)}
                    />
                    <span className="flex min-h-[64px] cursor-pointer items-start justify-between gap-3 rounded-md border border-border p-4 text-sm transition peer-checked:border-brand peer-checked:bg-bg-subtle peer-checked:ring-1 peer-checked:ring-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-brand">
                      <span>
                        <span className="block font-semibold">{addOn.name}</span>
                        <span className="mt-0.5 block text-xs text-muted">{addOn.description}</span>
                      </span>
                      <span className="whitespace-nowrap font-semibold text-brand">
                        {formatUsd(addOn.price)}
                        {addOn.billing === 'monthly' ? <span className="text-xs text-muted">/mo</span> : null}
                      </span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
            <label className="mt-4 block">
              <input type="checkbox" className="peer sr-only" checked={input.rush} onChange={(e) => setRush(e.target.checked)} />
              <span className="flex min-h-[64px] cursor-pointer items-center justify-between gap-3 rounded-md border border-border p-4 text-sm transition peer-checked:border-brand peer-checked:bg-bg-subtle peer-checked:ring-1 peer-checked:ring-brand peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand hover:border-brand">
                <span>
                  <span className="block font-semibold">Rush delivery</span>
                  <span className="mt-0.5 block text-xs text-muted">Compressed timeline with a prioritized team.</span>
                </span>
                <span className="whitespace-nowrap font-semibold text-brand">+{Math.round((pricing.rushMultiplier - 1) * 100)}%</span>
              </span>
            </label>
          </fieldset>
        ) : null}
      </div>

      <aside
        aria-label="Your estimate"
        className="rounded-lg border border-brand bg-surface p-6 shadow-md lg:sticky lg:top-24 md:p-7"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-muted">Estimated project cost</p>

        {result.isEmpty ? (
          <p className="mt-4 text-muted">Select at least one service to see your estimate.</p>
        ) : (
          <>
            <p className="mt-2 font-heading text-3xl font-bold md:text-4xl">
              {formatUsd(result.low)} – {formatUsd(result.high)}
            </p>
            <p className="mt-1 text-sm text-muted">One-time. Midpoint {formatUsd(result.total)}.</p>

            <dl className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              {[...result.serviceLines, ...result.addOnLines].map((line) => (
                <div key={line.id} className="flex justify-between gap-4">
                  <dt>
                    <span className="font-medium">{line.label}</span>
                    <span className="block text-xs text-muted">{line.detail}</span>
                  </dt>
                  <dd className="whitespace-nowrap font-medium">{formatUsd(line.amount)}</dd>
                </div>
              ))}
              {result.rushSurcharge > 0 ? (
                <div className="flex justify-between gap-4">
                  <dt className="font-medium">Rush delivery</dt>
                  <dd className="whitespace-nowrap font-medium">+{formatUsd(result.rushSurcharge)}</dd>
                </div>
              ) : null}
              {result.monthlyLines.map((line) => (
                <div key={line.id} className="flex justify-between gap-4 border-t border-border pt-3">
                  <dt>
                    <span className="font-medium">{line.label}</span>
                    <span className="block text-xs text-muted">billed monthly, not in total</span>
                  </dt>
                  <dd className="whitespace-nowrap font-medium">{formatUsd(line.amount)}/mo</dd>
                </div>
              ))}
            </dl>
          </>
        )}

        <Button size="lg" className={cn('mt-6 w-full')} disabled={result.isEmpty} onClick={sendEstimate}>
          Send this estimate
          <Icon name="arrow-right" size={18} />
        </Button>
        <p className="mt-3 text-xs text-muted">
          An indicative range, not a fixed quote. We confirm the final price after reviewing your requirements.
        </p>

        <div role="status" aria-live="polite" className="sr-only">
          {announcement}
        </div>
      </aside>
    </div>
  );
}
