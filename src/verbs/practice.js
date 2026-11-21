// Builds English → Spanish verb-practice cards and checks typed answers.
import { conjugate } from '../conjugation/conjugate.js';
import { matchAnswer, normalize } from '../answers.js';
import { shuffle } from '../useDeck.js';
import { englishPrompt, parseGloss } from './english.js';
import { VERBS } from './verbBank.js';

// Verbs that don't make sense to practice from an English prompt
const NO_PRACTICE = new Set(['soler', 'haber', 'tratarse']);
// Verbs that are rarely/never used in these forms
const NO_PROGRESSIVE = new Set(['ser', 'estar', 'poder', 'saber', 'caber', 'haber', 'soler', 'querer']);
const NO_IMPERATIVE = new Set(['poder', 'saber', 'caber', 'valer', 'querer', 'costar', 'parecer', 'merecer', 'soler', 'haber']);

const IMPERATIVE_SLOTS = ['tú+', 'tú-', 'usted+', 'usted-', 'nosotros+', 'ustedes+'];
const PERSON_SLOTS = [0, 1, 2, 3, 4];

export const canPractice = (entry) => !NO_PRACTICE.has(entry.key);

const slotsFor = (entry, tense) => {
  if (tense === 'progresivo' && NO_PROGRESSIVE.has(entry.infinitive)) return [];
  if (tense === 'imperativo') return NO_IMPERATIVE.has(entry.infinitive) ? [] : IMPERATIVE_SLOTS;
  return PERSON_SLOTS;
};

// Verbs whose practice meaning reads the same in English are accepted for each
// other ("to begin": empezar / comenzar; "to leave": salir / irse).
const meaningKey = (entry) => {
  const { head, rest, note } = parseGloss(entry.practice.en);
  return `${head} ${rest} ${note}`.trim();
};
const SAME_MEANING = new Map();
for (const v of VERBS.filter(canPractice)) {
  const k = meaningKey(v);
  SAME_MEANING.set(k, [...(SAME_MEANING.get(k) ?? []), v]);
}

function spanishAnswer(entry, tense, slot) {
  const conj = conjugate(entry.infinitive, entry.reflexive);
  if (tense === 'imperativo') {
    const row = conj.imperativo.find((r) => r.person === slot.slice(0, -1));
    return slot.endsWith('+') ? row.aff : row.neg;
  }
  return conj.tenses[tense][slot];
}

/**
 * Make a card for a verb + tense with a random person, so answers can't be
 * memorized. Persons in `usedSlots` are skipped while others remain.
 */
function dealCard(id, { entry, tense }, usedSlots) {
  const slots = slotsFor(entry, tense);
  const fresh = slots.filter((s) => !usedSlots.has(s));
  const options = fresh.length ? fresh : slots;
  const slot = options[Math.floor(Math.random() * options.length)];

  const verbOnly = spanishAnswer(entry, tense, slot);
  const { complement } = entry.practice;
  const synonyms = (SAME_MEANING.get(meaningKey(entry)) ?? []).filter((v) => v.key !== entry.key);
  usedSlots.add(slot);
  return {
    id,
    entry,
    tense,
    slot,
    prompt: englishPrompt(entry.practice.en, tense, slot),
    answer: complement ? `${verbOnly} ${complement}` : verbOnly,
    verbOnly,
    alsoAccepted: synonyms.map((v) => spanishAnswer(v, tense, slot)),
    target: tense === 'imperativo'
      ? { tense, row: slot.slice(0, -1), neg: slot.endsWith('-') }
      : { tense, person: slot },
  };
}

/**
 * Deal up to `size` cards from the given verbs and tenses, spread across as
 * many verbs as possible, each with a random person. The person is fixed for
 * the session (a missed card comes back the same). A verb + tense pair repeats
 * only when there aren't enough pairs to fill the deck, with a different
 * person each time.
 */
export function buildPracticeCards(entries, tenses, size = 20) {
  const verbs = entries.filter(canPractice);
  const pairs = shuffle(
    verbs.flatMap((entry) => tenses.filter((t) => slotsFor(entry, t).length > 0).map((tense) => ({ entry, tense })))
  );
  if (pairs.length === 0) return [];

  // One pair per verb first, then the remaining pairs
  const firsts = [];
  const others = [];
  const seenVerbs = new Set();
  for (const p of pairs) {
    (seenVerbs.has(p.entry.key) ? others : firsts).push(p);
    seenVerbs.add(p.entry.key);
  }
  const ordered = [...firsts, ...others];
  const distinctForms = pairs.reduce((n, p) => n + slotsFor(p.entry, p.tense).length, 0);
  const total = Math.min(size, distinctForms);
  const usedSlots = new Map(ordered.map((p) => [p, new Set()]));
  return Array.from({ length: total }, (_, id) => {
    const pair = ordered[id % ordered.length];
    return dealCard(id, pair, usedSlots.get(pair));
  });
}

export const practicableCount = (entries, tenses) =>
  entries.filter(canPractice).some((e) => tenses.some((t) => slotsFor(e, t).length > 0));

// ---- Answer checking

// Subject pronouns a learner may type before the verb, by table row
const SUBJECT_PRONOUNS = [
  ['yo'],
  ['tú', 'tu'],
  ['él', 'el', 'ella', 'usted', 'ud'],
  ['nosotros', 'nosotras'],
  ['ellos', 'ellas', 'ustedes', 'uds'],
];

function stripSubject(answer, card) {
  const allowed = SUBJECT_PRONOUNS[card.target.person] ?? []; // none for commands
  const [first, ...rest] = answer.split(' ');
  return rest.length && allowed.includes(first) ? rest.join(' ') : answer;
}

/**
 * Check a typed answer. A matching subject pronoun and the phrase's complement
 * are optional ("yo confío" and "confío en" are both fine; "yo confía" is not).
 * Accents follow `strictAccents` (see matchAnswer). Either way, a missing
 * accent that spells a different form of the verb is wrong (explico = "I
 * explain", not explicó = "he explained"): { correct: false, otherForm: true }.
 */
export function checkAnswer(card, typed, { strictAccents }) {
  const given = stripSubject(normalize(typed), card);
  const accepted = [card.answer, card.verbOnly, ...card.alsoAccepted];
  const result = matchAnswer([given], accepted, { strictAccents });
  if ((result.accentSlip || result.accentMiss) && allForms(card.entry).has(stripComplement(given, card))) {
    return { correct: false, otherForm: true };
  }
  return result;
}

const stripComplement = (given, card) => {
  const complement = normalize(card.entry.practice.complement);
  return complement && given.endsWith(' ' + complement) ? given.slice(0, -complement.length - 1) : given;
};

function allForms(entry) {
  const conj = conjugate(entry.infinitive, entry.reflexive);
  const forms = [...Object.values(conj.tenses).flat(), ...(conj.imperativo ?? []).flatMap((r) => [r.aff, r.neg])];
  return new Set(forms.map(normalize));
}
