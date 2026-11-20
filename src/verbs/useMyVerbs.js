// The learner's custom verb list, saved in localStorage as verb keys.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { VERBS } from './verbBank.js';

const STORAGE_KEY = 'myVerbs';

function load() {
  try {
    const keys = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(keys) ? keys : [];
  } catch {
    return [];
  }
}

export default function useMyVerbs() {
  const [keys, setKeys] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
    } catch {
      // Storage unavailable (private mode) — the list just won't persist
    }
  }, [keys]);

  // Entries in the order they were added; keys no longer in the bank are skipped
  const verbs = useMemo(() => {
    const byKey = new Map(VERBS.map((v) => [v.key, v]));
    return keys.map((k) => byKey.get(k)).filter(Boolean);
  }, [keys]);

  const has = useCallback((key) => keys.includes(key), [keys]);
  const toggle = useCallback(
    (key) => setKeys((ks) => (ks.includes(key) ? ks.filter((k) => k !== key) : [...ks, key])),
    []
  );
  const clear = useCallback(() => setKeys([]), []);

  return { verbs, has, toggle, clear };
}
