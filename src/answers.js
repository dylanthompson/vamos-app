// Typed-answer matching shared by every practice exercise.

/** Lowercase, drop punctuation, collapse spaces. */
export const normalize = (s) => s.toLowerCase().replace(/[¡!¿?.,;:]/g, '').replace(/\s+/g, ' ').trim();

/** Drop accent marks (and ñ→n, ü→u) so two spellings can be compared loosely. */
export const loosen = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');

/**
 * Compare typed text against the accepted answers. `candidates` are the ways
 * of reading what was typed (e.g. with and without a subject pronoun), already
 * normalized. Returns:
 *   { correct: true }                      exact match
 *   { correct: true, accentSlip: true }    right apart from accents (lenient mode)
 *   { correct: false, accentMiss: true }   right apart from accents (strict mode)
 *   { correct: false }                     wrong
 */
export function matchAnswer(candidates, accepted, { strictAccents }) {
  const exact = accepted.map(normalize);
  if (candidates.some((c) => exact.includes(c))) return { correct: true };
  const loose = exact.map(loosen);
  if (candidates.some((c) => loose.includes(loosen(c)))) {
    return strictAccents ? { correct: false, accentMiss: true } : { correct: true, accentSlip: true };
  }
  return { correct: false };
}
