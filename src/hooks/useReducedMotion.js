import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange) => {
    const mediaQuery = window.matchMedia(QUERY);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

export const useReducedMotion = () => useSyncExternalStore(subscribe, getSnapshot);
