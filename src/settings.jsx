// App-wide user preferences, saved in localStorage and shared through context
// so a change in the settings dialog reaches every open screen at once.
import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'settings';

export const DEFAULT_SETTINGS = {
  showEnglish: false, // show English translations beside the Spanish on sentence cards
  strictAccents: true, // typed answers must match accent marks (accent-focused practice always does)
};

function load() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage unavailable (private mode) — settings just won't persist
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={[settings, setSettings]}>{children}</SettingsContext.Provider>
  );
}

/** [value, setValue] for one setting, e.g. useSetting('showEnglish'). */
export function useSetting(name) {
  const [settings, setSettings] = useContext(SettingsContext);
  return [settings[name], (value) => setSettings((s) => ({ ...s, [name]: value }))];
}
