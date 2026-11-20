import { useCallback, useMemo, useState } from 'react';
import { tagValues, tagLabel } from './tags.js';
import { findVerb, drillTarget } from './conjugation/detectVerb.js';
import { dealDrillCard } from './conjugation/dealDrill.js';
import ConjugationPanel from './ConjugationPanel.jsx';
import useDeck from './useDeck.js';

export default function FlashcardSession({ wordSet, onComplete, onQuit }) {
  // Conjugation drills get a random subject per card when the set starts; it
  // stays the same for the session, including when a card returns from the
  // discard pile.
  const [cards] = useState(() => wordSet.words.map((w) => dealDrillCard(wordSet, w)));
  const deck = useDeck(cards, onComplete);
  const [flipped, setFlipped] = useState(false);
  const [conjOpen, setConjOpen] = useState(false);
  const [conjTense, setConjTense] = useState('presente'); // remembered across cards

  const { current, round, cardKey } = deck;

  // Verb on this card, if any. Vocab cards show conjugations on the Spanish
  // (front) side; conjugation drills show them on the answer side, since the
  // table would give the answer away on the prompt.
  const isDrill = !!wordSet.drill;
  const verbSide = isDrill ? 'back' : 'front';
  const verb = useMemo(() => current && findVerb(current.es, isDrill), [current, isDrill]);
  const target = useMemo(() => current && drillTarget(wordSet, current), [current, wordSet]);

  const openConjugation = (e) => {
    e.stopPropagation(); // don't flip the card
    if (target?.tense) setConjTense(target.tense);
    setConjOpen(true);
  };
  const closeConjugation = useCallback(() => setConjOpen(false), []);

  // The card element is keyed by cardKey, so each new card mounts face-up
  // without animating the flip-back (which would reveal the next answer).
  const next = (mark) => () => {
    setFlipped(false);
    setConjOpen(false);
    mark();
  };
  const markCorrect = next(deck.markCorrect);
  const markWrong = next(deck.markWrong);

  if (!current) return null;

  const conjugateButton = (side) =>
    verb && side === verbSide ? (
      <button className="conj-btn" onClick={openConjugation}>
        Conjugar
      </button>
    ) : null;

  return (
    <div className="session">
      <header className="session-header">
        <button className="link-btn" onClick={onQuit}>← Menu</button>
        <h2>{wordSet.emoji} {wordSet.name}</h2>
        <span className="round">
          {tagValues(wordSet, 'difficulty').map((v) => tagLabel('difficulty', v)).join(', ')} · Round {round}
        </span>
      </header>

      <div className="piles">
        <span>Remaining: <strong>{deck.remaining}</strong></span>
        <span>Discard pile: <strong>{deck.discarded}</strong></span>
      </div>

      <div className="card-scene" onClick={() => setFlipped((f) => !f)}>
        <div key={cardKey} className={flipped ? 'card is-flipped' : 'card'}>
          <div className="card-face card-front">
            <span className="lang">{wordSet.faces?.front ?? 'Español'}</span>
            <span className="word">{current.display ?? current.es}</span>
            {conjugateButton('front')}
            <span className="hint">Click to flip</span>
          </div>
          <div className="card-face card-back">
            <span className="lang">{wordSet.faces?.back ?? 'English'}</span>
            <span className="word">{current.en}</span>
            {conjugateButton('back')}
            <span className="hint">Click to flip</span>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="btn btn-wrong" onClick={markWrong}>✗ Wrong</button>
        <button className="btn btn-correct" onClick={markCorrect}>✓ Correct</button>
      </div>

      {conjOpen && verb && (
        <ConjugationPanel
          verb={verb}
          target={target}
          tense={conjTense}
          onTenseChange={setConjTense}
          onClose={closeConjugation}
        />
      )}
    </div>
  );
}
