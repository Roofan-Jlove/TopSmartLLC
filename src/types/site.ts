import type { IconName } from './service';

export type NavLink = { label: string; href: string; description?: string; icon?: IconName };
export type SocialLink = { label: string; href: string; platform: 'linkedin' | 'x' | 'instagram' | 'github' | 'facebook' };
export type Stat = { value: number; suffix: string; label: string };
export type TrustBadge = { title: string; detail: string };
