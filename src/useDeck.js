import { useState } from 'react';

export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * The study loop shared by flashcards and verb practice: Correct removes the
 * card, Wrong moves it to the discard pile. When the deck runs out, the discard
 * pile is shuffled into a new round; with no discards left, the session ends.
 */
export default function useDeck(items, onComplete) {
  const [deck, setDeck] = useState(() => shuffle(items));
  const [discard, setDiscard] = useState([]);
  const [round, setRound] = useState(1);
  const [totalWrong, setTotalWrong] = useState(0);
  const [cardKey, setCardKey] = useState(0); // changes every time a new card is shown

  const advance = (remaining, newDiscard) => {
    setCardKey((k) => k + 1);
    if (remaining.length > 0) {
      setDeck(remaining);
      setDiscard(newDiscard);
    } else if (newDiscard.length === 0) {
      onComplete({ rounds: round, totalWrong, count: items.length });
    } else {
      setDeck(shuffle(newDiscard));
      setDiscard([]);
      setRound((r) => r + 1);
    }
  };

  return {
    current: deck[0],
    remaining: deck.length,
    discarded: discard.length,
    round,
    cardKey,
    markCorrect: () => advance(deck.slice(1), discard),
    markWrong: () => {
      setTotalWrong((n) => n + 1);
      advance(deck.slice(1), [...discard, deck[0]]);
    },
  };
}
