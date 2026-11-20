import { conjugate } from './conjugate.js';

const ARTICLES = new Set(['el', 'la', 'los', 'las', 'el/la', 'un', 'una', 'lo']);
// Common non-verbs that happen to end in -ar/-er/-ir
const NOT_VERBS = new Set(
  'mar lugar hogar bar par azar altar collar pilar dólar militar popular familiar similar particular regular singular solar polar lunar escolar celular titular mujer ayer placer taller alquiler carácter líder súper suéter elixir mártir'.split(' ')
);
const VERB_RE = /^([a-záéíóúüñ]*?)(ar|er|ir|ír)(se)?$/;

// Row index in the conjugation tables (no vosotros row)
const SUBJECTS = {
  yo: 0, 'tú': 1, 'él/ella': 2, usted: 2, '(hay)': 2,
  nosotros: 3, ellos: 4, 'ellos/ellas': 4, ustedes: 4,
};

/**
 * Find the verb on a card, if its Spanish text is a verb or verb phrase.
 * Returns { infinitive, reflexive, complement, conjugation } or null.
 * e.g. "romperse el brazo" → { infinitive: 'romper', reflexive: true, complement: 'el brazo' }
 */
export function findVerb(text, isDrill = false) {
  const source = isDrill ? text.split('·')[0] : text;
  const clean = source.replace(/\(.*?\)/g, '').replace(/…/g, '').trim();
  const [first = '', ...rest] = clean.split(/\s+/);
  const word = first.toLowerCase();
  if (ARTICLES.has(word) || NOT_VERBS.has(word)) return null;

  const m = word.match(VERB_RE);
  if (!m) return null;
  const infinitive = m[1] + m[2];
  const reflexive = !!m[3];

  try {
    const conjugation = conjugate(infinitive, reflexive);
    return { infinitive, reflexive, complement: isDrill ? '' : rest.join(' '), conjugation };
  } catch {
    return null;
  }
}

/**
 * For conjugation-drill cards, which cell of the table the card is asking about.
 * Returns { tense, person } | { tense: 'imperativo', row: 'tú', neg } | { participle: true }
 *   | { gerund: true } | null
 */
export function drillTarget(set, word) {
  if (!set.drill) return null;
  const { tense } = set.drill;
  if (tense === 'participio') return { participle: true };
  if (tense === 'gerundio') return { gerund: true };
  if (tense === 'imperativo') return { tense, row: 'tú', neg: word.es.includes('–') };

  const parts = word.es.split('·').map((s) => s.trim());
  return {
    tense: tense === 'fromPrompt' ? parts[2] : tense,
    person: SUBJECTS[parts[1]],
  };
}
