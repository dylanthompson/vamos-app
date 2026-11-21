import { useCallback, useEffect, useRef, useState } from 'react';
import useDeck from './useDeck.js';
import { buildPracticeCards, checkAnswer } from './verbs/practice.js';
import { conjugate, TENSES } from './conjugation/conjugate.js';
import ConjugationPanel from './ConjugationPanel.jsx';
import AnswerForm from './AnswerForm.jsx';
import { useSetting } from './settings.jsx';

const tenseLabel = (id) => {
  const t = TENSES.find((x) => x.id === id);
  return t.mood === 'Indicativo' ? t.label : `${t.mood} · ${t.label}`;
};

// English → Spanish conjugation practice: read the English, type the Spanish.
export default function VerbPractice({ config, onComplete, onQuit }) {
  const [cards] = useState(() => buildPracticeCards(config.entries, config.tenses));
  const deck = useDeck(cards, onComplete);
  const card = deck.current;

  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null); // see checkAnswer
  const [strictAccents] = useSetting('strictAccents');
  const [showVerb, setShowVerb] = useState(false);
  const [conjOpen, setConjOpen] = useState(false);
  const [conjTense, setConjTense] = useState('presente');
  const inputRef = useRef(null);
  const closeConj = useCallback(() => setConjOpen(false), []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [deck.cardKey]);

  const next = (correct) => {
    setTyped('');
    setResult(null);
    setShowVerb(false);
    setConjOpen(false);
    if (correct) deck.markCorrect();
    else deck.markWrong();
  };

  const submit = (e) => {
    e.preventDefault();
    if (result) next(result.correct);
    else if (typed.trim()) setResult(checkAnswer(card, typed, { strictAccents: strictAccents || !!config.requireAccents }));
  };

  const openConj = () => {
    setConjTense(card.tense);
    setConjOpen(true);
  };

  if (!card) {
    return (
      <div className="empty">
        <p>There's nothing to practice with these settings.</p>
        <button className="link-btn" onClick={onQuit}>← Back to verbs</button>
      </div>
    );
  }

  return (
    <div className="session">
      <header className="session-header">
        <button className="link-btn" onClick={onQuit}>← Verbos</button>
        <h2>{config.title}</h2>
        <span className="round">Round {deck.round}</span>
      </header>

      <div className="piles">
        <span>Remaining: <strong>{deck.remaining}</strong></span>
        <span>Discard pile: <strong>{deck.discarded}</strong></span>
      </div>

      <div className="practice-card" key={deck.cardKey}>
        <span className="lang">{tenseLabel(card.tense)}</span>
        <span className="practice-prompt">{card.prompt.text}</span>
        {card.prompt.note && <span className="practice-note">({card.prompt.note})</span>}
        {card.prompt.frame && <span className="practice-frame">{card.prompt.frame}</span>}
        {showVerb ? (
          <span className="practice-verb">{card.entry.key}</span>
        ) : (
          !result && (
            <button type="button" className="link-btn" onClick={() => setShowVerb(true)}>
              Hint: show the verb
            </button>
          )
        )}

        <AnswerForm
          inputRef={inputRef}
          value={typed}
          onChange={setTyped}
          answered={!!result}
          onSubmit={submit}
          onShowAnswer={() => setResult({ correct: false })}
        />

        {result && (
          <div className={`practice-result ${result.correct ? 'is-correct' : 'is-wrong'}`} role="status">
            {result.correct ? (
              <p>
                <strong>✓ ¡Correcto!</strong>
                {result.accentSlip && <> Watch the accents: <strong>{card.answer}</strong></>}
              </p>
            ) : (
              <p>
                <strong>✗ Not quite.</strong>
                {result.otherForm && <> Without its accent, that's a different form of the verb.</>}
                {result.accentMiss && <> Check your accents.</>}
                {' '}The answer is <strong>{card.answer}</strong>
              </p>
            )}
            {card.alsoAccepted.length > 0 && (
              <p className="muted">Also accepted: {card.alsoAccepted.join(', ')}</p>
            )}
            <div className="practice-actions">
              <button type="button" className="conj-btn" onClick={openConj}>
                Conjugar {card.entry.key}
              </button>
              {!result.correct && typed.trim() && (
                <button type="button" className="link-btn" onClick={() => next(true)}>
                  I was right — count it
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {conjOpen && (
        <ConjugationPanel
          verb={{
            conjugation: conjugate(card.entry.infinitive, card.entry.reflexive),
            complement: card.entry.practice.complement,
          }}
          target={card.target}
          tense={conjTense}
          onTenseChange={setConjTense}
          onClose={closeConj}
        />
      )}
    </div>
  );
}
