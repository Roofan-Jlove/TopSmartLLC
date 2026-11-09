const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatUsd(amount: number): string {
  return usd.format(amount);
}

export function formatUsdRange(min: number, max: number): string {
  return `${formatUsd(min)} – ${formatUsd(max)}`;
}
