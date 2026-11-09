import type { BudgetKey, Option, TimelineKey } from '@/types/lead';

export const budgetOptions: Option<BudgetKey>[] = [
  { value: 'under-1k', label: 'Under $1,000' },
  { value: '1k-5k', label: '$1,000 – $5,000' },
  { value: '5k-15k', label: '$5,000 – $15,000' },
  { value: '15k-50k', label: '$15,000 – $50,000' },
  { value: '50k-plus', label: '$50,000+' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const timelineOptions: Option<TimelineKey>[] = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '1-3-months', label: '1 – 3 months' },
  { value: 'flexible', label: 'Flexible' },
];
