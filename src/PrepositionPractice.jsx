import { useEffect, useRef, useState } from 'react';
import useDeck from './useDeck.js';
import AnswerForm from './AnswerForm.jsx';
import Translation from './Translation.jsx';
import { useSetting } from './settings.jsx';
import { NONE, checkPreposition, fillBlank } from './prepositions/exercises.js';

// Fill-in-the-blank preposition practice: read the sentence, type the missing word.
export default function PrepositionPractice({ exercise, onComplete, onQuit }) {
  const deck = useDeck(exercise.items, onComplete);
  const item = deck.current;

  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null); // see checkPreposition
  const [strictAccents] = useSetting('strictAccents');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [deck.cardKey]);

  const next = (correct) => {
    setTyped('');
    setResult(null);
    if (correct) deck.markCorrect();
    else deck.markWrong();
  };

  const submit = (e) => {
    e.preventDefault();
    if (result) next(result.correct);
    else if (typed.trim()) setResult(checkPreposition(item, typed, { strictAccents }));
  };

  if (!item) return null;

  const [before, filled, after] = fillBlank(item);
  const [blankBefore, blankAfter] = item.es.split('___');
  const answerText = (a) => (a === NONE ? 'nothing (no preposition)' : a);
  const others = item.answers.slice(1);

  return (
    <div className="session">
      <header className="session-header">
        <button className="link-btn" onClick={onQuit}>← Preposiciones</button>
        <h2>{exercise.emoji} {exercise.name}</h2>
        <span className="round">Round {deck.round}</span>
      </header>

      <div className="piles">
        <span>Remaining: <strong>{deck.remaining}</strong></span>
        <span>Discard pile: <strong>{deck.discarded}</strong></span>
      </div>

      <div className="practice-card" key={deck.cardKey}>
        <span className="lang">Completa la frase</span>
        <span className="practice-prompt prep-sentence" lang="es">
          {result ? (
            <>
              {before}
              {filled && <mark className="prep-fill">{filled}</mark>}
              {after}
            </>
          ) : (
            <>
              {blankBefore}
              <span className="prep-blank" aria-label="blank">____</span>
              {blankAfter}
            </>
          )}
        </span>
        <Translation text={item.en} answered={!!result} />
        {exercise.allowNone && !result && (
          <span className="practice-note">If nothing goes in the blank, type – (or “nada”).</span>
        )}

        <AnswerForm
          inputRef={inputRef}
          value={typed}
          onChange={setTyped}
          answered={!!result}
          onSubmit={submit}
          onShowAnswer={() => setResult({ correct: false })}
          extraKeys={exercise.allowNone ? [NONE] : []}
        />

        {result && (
          <div className={`practice-result ${result.correct ? 'is-correct' : 'is-wrong'}`} role="status">
            {result.correct ? (
              <p>
                <strong>✓ ¡Correcto!</strong>
                {result.accentSlip && <> Watch the accents: <strong>{item.answers[0]}</strong></>}
              </p>
            ) : (
              <p>
                <strong>✗ Not quite.</strong>
                {result.accentMiss && <> Check your accents.</>} The answer is <strong>{answerText(item.answers[0])}</strong>
              </p>
            )}
            {others.length > 0 && (
              <p className="muted">Also correct: {others.map(answerText).join(', ')}</p>
            )}
            {item.why && <p className="prep-why">💡 {item.why}</p>}
            {!result.correct && typed.trim() && (
              <div className="practice-actions">
                <button type="button" className="link-btn" onClick={() => next(true)}>
                  I was right — count it
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
