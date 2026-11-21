import { useEffect, useRef } from 'react';
import { useSetting } from './settings.jsx';

export default function SettingsDialog({ onClose }) {
  const [showEnglish, setShowEnglish] = useSetting('showEnglish');
  const [strictAccents, setStrictAccents] = useSetting('strictAccents');
  const closeRef = useRef(null);

  // Focus the dialog on open, close on Escape, and restore focus on close
  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="conj-backdrop" onClick={onClose}>
      <div
        className="conj-panel settings-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="conj-header">
          <h3 id="settings-title">Settings</h3>
          <button ref={closeRef} className="conj-close" onClick={onClose} aria-label="Close settings">
            ×
          </button>
        </header>

        <label className="setting-row">
          <input
            type="checkbox"
            checked={showEnglish}
            onChange={(e) => setShowEnglish(e.target.checked)}
            aria-describedby="setting-show-english-help"
          />
          <span>
            <span className="setting-name">Show English translations</span>
            <span id="setting-show-english-help" className="setting-help">
              Applies across the whole app. Some exercises (Ser y estar, Preposiciones) can show the
              English translation on the same card as the Spanish sentence. When this is off, the
              English stays hidden so you read the Spanish first — tap the eye icon on a card to
              see it, or answer the card to reveal it.
            </span>
          </span>
        </label>

        <label className="setting-row">
          <input
            type="checkbox"
            checked={strictAccents}
            onChange={(e) => setStrictAccents(e.target.checked)}
            aria-describedby="setting-strict-accents-help"
          />
          <span>
            <span className="setting-name">Strict accent mode</span>
            <span id="setting-strict-accents-help" className="setting-help">
              Applies across the whole app. When on, typed answers must have every accent mark
              right (and ñ, ü) — <em>esta</em> won't count for <em>está</em>. When off, a missing or
              misplaced accent still counts as correct, with a reminder to check it. Practice that's
              about accents (the “Accented í / ú” and “Irregular preterite stems” verb
              categories) always checks them.
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
