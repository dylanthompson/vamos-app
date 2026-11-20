import { useEffect, useRef, useState } from 'react';
import useDeck from './useDeck.js';
import AnswerForm from './AnswerForm.jsx';
import { USES, checkSerEstar, fillBlank } from './serEstar/exercises.js';

// Fill-in-the-blank ser/estar practice: read the sentence, type the conjugated verb.
export default function SerEstarPractice({ exercise, onComplete, onQuit }) {
  const deck = useDeck(exercise.items, onComplete);
  const item = deck.current;

  const [typed, setTyped] = useState('');
  const [result, setResult] = useState(null); // { correct, accentSlip, rightVerb }
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
    else if (typed.trim()) setResult(checkSerEstar(item, typed));
  };

  if (!item) return null;

  const [before, filled, after] = fillBlank(item);
  const [blankBefore, blankAfter] = item.es.split('___');
  const use = USES[item.use];
  const others = item.answers.slice(1);

  return (
    <div className="session">
      <header className="session-header">
        <button className="link-btn" onClick={onQuit}>← Ser y estar</button>
        <h2>{exercise.emoji} {exercise.name}</h2>
        <span className="round">Round {deck.round}</span>
      </header>

      <div className="piles">
        <span>Remaining: <strong>{deck.remaining}</strong></span>
        <span>Discard pile: <strong>{deck.discarded}</strong></span>
      </div>

      <div className="practice-card" key={deck.cardKey}>
        <span className="lang">¿Ser o estar?</span>
        <span className="practice-prompt prep-sentence" lang="es">
          {result ? (
            <>
              {before}
              <mark className="prep-fill">{filled}</mark>
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
        <span className="practice-note">{item.en}</span>

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
                {result.accentSlip && <> Watch the accents: <strong>{item.answers[0]}</strong></>}
              </p>
            ) : (
              <p>
                <strong>✗ Not quite.</strong>
                {result.rightVerb && <> Right verb ({use.verb}), wrong form.</>}
                {' '}The answer is <strong>{item.answers[0]}</strong>
              </p>
            )}
            {others.length > 0 && <p className="muted">Also correct: {others.join(', ')}</p>}
            <p className="prep-why">
              💡 <span className={`se-verb se-${use.verb}`}>{use.verb}</span> {use.label}: {use.rule}
            </p>
            {item.note && <p className="muted">{item.note}</p>}
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
