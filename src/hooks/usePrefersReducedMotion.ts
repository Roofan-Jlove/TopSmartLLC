'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
// The server cannot know the preference. Starting from "no preference" keeps hydration consistent;
// the real value is applied immediately after hydration, and updates live if the setting changes.
const getServerSnapshot = () => false;

/** True when the visitor has asked their system for reduced motion. Reactive and hydration-safe. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
