import { useEffect, useRef } from 'react';
import { PERSONS, TENSES } from './conjugation/conjugate.js';

const MOODS = ['Indicativo', 'Subjuntivo', 'Imperativo'];

export default function ConjugationPanel({ verb, target, tense, onTenseChange, onClose }) {
  const { conjugation, complement } = verb;
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

  const tenses = TENSES.filter((t) => t.id !== 'imperativo' || conjugation.imperativo);
  const active = tenses.some((t) => t.id === tense) ? tense : 'presente';
  const extra = complement ? <span className="conj-complement"> {complement}</span> : null;

  const isTarget = (cond) => (target && cond ? 'is-target' : undefined);

  return (
    <div className="conj-backdrop" onClick={onClose}>
      <div
        className="conj-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="conj-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="conj-header">
          <h3 id="conj-title">
            {conjugation.infinitive}
            {extra}
          </h3>
          <button ref={closeRef} className="conj-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <p className="conj-meta">
          <span className={isTarget(target?.gerund)}>
            Gerundio: <strong>{conjugation.gerund}</strong>
          </span>
          <span className={isTarget(target?.participle)}>
            Participio: <strong>{conjugation.participle}</strong>
          </span>
        </p>

        <div className="conj-tabs" role="tablist">
          {MOODS.map((mood) => {
            const inMood = tenses.filter((t) => t.mood === mood);
            if (inMood.length === 0) return null;
            return (
              <div key={mood} className="conj-mood">
                <span className="conj-mood-label">{mood}</span>
                <div className="chips">
                  {inMood.map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={active === t.id}
                      className={`chip ${active === t.id ? 'is-active' : ''}`}
                      onClick={() => onTenseChange(t.id)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {active === 'imperativo' ? (
          <table className="conj-table">
            <thead>
              <tr>
                <th />
                <th>Afirmativo</th>
                <th>Negativo</th>
              </tr>
            </thead>
            <tbody>
              {conjugation.imperativo.map((row) => {
                const hit = target?.tense === 'imperativo' && target.row === row.person;
                return (
                  <tr key={row.person}>
                    <th scope="row">{row.person}</th>
                    <td className={isTarget(hit && !target.neg)}>{row.aff}{extra}</td>
                    <td className={isTarget(hit && target.neg)}>{row.neg}{extra}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <table className="conj-table">
            <tbody>
              {conjugation.tenses[active].map((form, i) => (
                <tr key={PERSONS[i]}>
                  <th scope="row">{PERSONS[i]}</th>
                  <td className={isTarget(target?.tense === active && target.person === i)}>
                    {form}
                    {extra}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
