// Every verb in the program, collected from the word sets.
// Entries are keyed by infinitive (+ "se"): { key, infinitive, reflexive, en,
// phrases, levels, sets, practice, traits, categories }.
import wordSets from '../wordSets/index.js';
import { findVerb } from '../conjugation/detectVerb.js';
import { verbTraits } from '../conjugation/conjugate.js';
import { CATEGORIES } from './categories.js';

// English meanings for verbs that only appear in conjugation drills (or only in phrases)
const EXTRA_GLOSSES = {
  andar: 'to walk',
  bailar: 'to dance',
  caber: 'to fit',
  caer: 'to fall',
  componer: 'to compose',
  construir: 'to build',
  creer: 'to believe',
  cubrir: 'to cover',
  describir: 'to describe',
  descubrir: 'to discover',
  deshacer: 'to undo',
  devolver: 'to give back',
  freír: 'to fry',
  haber: 'to have (auxiliary)',
  imprimir: 'to print',
  lavarse: 'to wash (oneself)',
  morir: 'to die',
  abrir: 'to open',
  ofrecer: 'to offer',
  oír: 'to hear',
  producir: 'to produce',
  reír: 'to laugh',
  resolver: 'to solve',
  romper: 'to break',
  sacar: 'to take out',
  satisfacer: 'to satisfy',
  sentir: 'to feel / to be sorry',
  traducir: 'to translate',
  valer: 'to be worth',
  vestir: 'to dress (someone)',
};

function buildVerbBank() {
  const byKey = new Map();

  for (const set of wordSets) {
    const isDrill = !!set.drill;
    for (const word of set.words) {
      const verb = findVerb(word.es, isDrill);
      if (!verb) continue;
      const key = verb.infinitive + (verb.reflexive ? 'se' : '');
      let entry = byKey.get(key);
      if (!entry) {
        entry = { key, infinitive: verb.infinitive, reflexive: verb.reflexive, bareEn: null, phrases: [], levels: new Set(), sets: new Set() };
        byKey.set(key, entry);
      }
      entry.levels.add(set.tags.difficulty);
      entry.sets.add(set.name);
      if (isDrill) continue;

      if (verb.complement) {
        const es = word.es.replace(/\s*\(.*?\)/g, '').trim();
        if (!entry.phrases.some((p) => p.es === es)) {
          entry.phrases.push({ es, en: word.en, complement: verb.complement });
        }
      } else if (!entry.bareEn) {
        entry.bareEn = word.en;
      }
    }
  }

  return [...byKey.values()]
    .map(({ bareEn, ...e }) => {
      const en = bareEn ?? EXTRA_GLOSSES[e.key] ?? null;
      // What to practice: the verb on its own, or its first phrase ("lavarse las manos")
      const practice = en
        ? { en, complement: '' }
        : { en: e.phrases[0].en, complement: e.phrases[0].complement };
      const entry = {
        ...e,
        en: en ?? e.phrases[0].en,
        levels: [...e.levels].sort(),
        sets: [...e.sets],
        practice,
        traits: verbTraits(e.infinitive),
      };
      entry.categories = CATEGORIES.filter((c) => c.test(entry)).map((c) => c.id);
      return entry;
    })
    .sort((a, b) => a.key.localeCompare(b.key, 'es'));
}

export const VERBS = buildVerbBank();

export const verbsInCategory = (categoryId) =>
  categoryId === 'all' ? VERBS : VERBS.filter((v) => v.categories.includes(categoryId));
