export type ServiceKey = 'web' | 'app' | 'content' | 'ebook';
export type BudgetKey = 'under-1k' | '1k-5k' | '5k-15k' | '15k-50k' | '50k-plus' | 'not-sure';
export type TimelineKey = 'asap' | '1-month' | '1-3-months' | 'flexible';
export type LeadSource = 'contact' | 'calculator' | 'service-page';

export type Option<T extends string> = { value: T; label: string };
