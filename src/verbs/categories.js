// Verb study categories. Each verb bank entry is tested against every category,
// so a verb can belong to several (tener: -er, e→ie, yo-go, preterite, future).
// `tenses` are the tenses selected by default when practicing the category.
// `requireAccents` makes practice check accents even with strict accent mode off.

// Pronominal verbs: the pronoun is part of the verb or changes its meaning
// (irse = to leave, quejarse = to complain). Other "-se" verbs are reflexive:
// the subject does the action to itself (lavarse, peinarse).
const PRONOMINAL = new Set(
  'irse quedarse dormirse divertirse llevarse ganarse jubilarse graduarse inspirarse ponerse volverse hacerse sentirse alegrarse enojarse preocuparse aburrirse asustarse sorprenderse quejarse burlarse enamorarse despedirse darse acordarse olvidarse atreverse negarse arrepentirse equivocarse portarse tratarse mudarse'.split(' ')
);

const isCarGarZar = (inf) => /(car|gar|zar|guar)$/.test(inf);
const isGerGir = (inf) => /(ger|gir)$/.test(inf);
const isZc = (e) => /[aeiou](cer|cir)$/.test(e.infinitive) && !e.traits.irregularYo;
const isUir = (inf) => /[^gq]uir$/.test(inf);
const isYPreterite = (inf) => /(eer|aer|oír)$/.test(inf);
const hasSpellingChange = (e) =>
  isCarGarZar(e.infinitive) || isGerGir(e.infinitive) || isZc(e) || isUir(e.infinitive) || isYPreterite(e.infinitive);

const isRegular = (e) => {
  const t = e.traits;
  return !t.stemChange && !t.irregularYo && !t.strongPreterite && !t.irregularPreterite &&
    !t.irregularFuture && !t.irregularParticiple && !t.fullyIrregular && !hasSpellingChange(e);
};

export const CATEGORY_GROUPS = [
  'By ending',
  'Stem-changing (boot) verbs',
  'Spelling changes',
  'Irregular verbs',
  'Verbs with pronouns',
];

export const CATEGORIES = [
  // By ending
  {
    id: 'ar', group: 'By ending', name: '-ar verbs',
    rule: 'Present endings: -o, -as, -a, -amos, -an.',
    example: 'hablar → hablo, hablas, habla, hablamos, hablan',
    tenses: ['presente', 'preterito'],
    test: (e) => e.traits.ending === 'ar',
  },
  {
    id: 'er', group: 'By ending', name: '-er verbs',
    rule: 'Present endings: -o, -es, -e, -emos, -en.',
    example: 'comer → como, comes, come, comemos, comen',
    tenses: ['presente', 'preterito'],
    test: (e) => e.traits.ending === 'er',
  },
  {
    id: 'ir', group: 'By ending', name: '-ir verbs',
    rule: 'Present endings: -o, -es, -e, -imos, -en.',
    example: 'vivir → vivo, vives, vive, vivimos, viven',
    tenses: ['presente', 'preterito'],
    test: (e) => e.traits.ending === 'ir',
  },
  {
    id: 'regular', group: 'By ending', name: 'Fully regular verbs',
    rule: 'No stem, spelling, or irregular changes in any tense — just learn the endings.',
    example: 'estudiar, beber, vivir, ayudar, compartir',
    tenses: ['presente', 'preterito', 'imperfecto', 'futuro'],
    test: isRegular,
  },

  // Stem-changing
  {
    id: 'stem-ie', group: 'Stem-changing (boot) verbs', name: 'e → ie',
    rule: 'The stressed e becomes ie in the present — every form except nosotros.',
    example: 'pensar → pienso, piensas, piensa, pensamos, piensan',
    tenses: ['presente', 'subjPresente'],
    test: (e) => e.traits.stemChange === 'ie',
  },
  {
    id: 'stem-ue', group: 'Stem-changing (boot) verbs', name: 'o → ue',
    rule: 'The stressed o becomes ue in the present — every form except nosotros.',
    example: 'poder → puedo, puedes, puede, podemos, pueden',
    tenses: ['presente', 'subjPresente'],
    test: (e) => e.traits.stemChange === 'ue',
  },
  {
    id: 'stem-i', group: 'Stem-changing (boot) verbs', name: 'e → i',
    rule: 'Only -ir verbs: the stressed e becomes i in the present — except nosotros.',
    example: 'pedir → pido, pides, pide, pedimos, piden',
    tenses: ['presente', 'subjPresente'],
    test: (e) => e.traits.stemChange === 'i',
  },
  {
    id: 'stem-u', group: 'Stem-changing (boot) verbs', name: 'u → ue (jugar)',
    rule: 'Jugar is the only u → ue verb.',
    example: 'jugar → juego, juegas, juega, jugamos, juegan',
    tenses: ['presente', 'subjPresente'],
    test: (e) => e.traits.stemChange === 'u-ue',
  },
  {
    id: 'stem-ir-preterite', group: 'Stem-changing (boot) verbs', name: '-ir stem changers in the preterite',
    rule: '-ir stem-changing verbs also change in the él/ellos preterite (e → i, o → u), and in the gerund.',
    example: 'dormir → durmió, durmieron, durmiendo · pedir → pidió, pidieron, pidiendo',
    tenses: ['preterito', 'progresivo'],
    test: (e) => e.traits.ending === 'ir' && ['ie', 'ue', 'i'].includes(e.traits.stemChange),
  },

  // Spelling changes
  {
    id: 'car-gar-zar', group: 'Spelling changes', name: '-car, -gar, -zar',
    rule: 'Before e: c → qu, g → gu, z → c. Shows up in the yo preterite and the subjunctive.',
    example: 'buscar → busqué · llegar → llegué · empezar → empecé · averiguar → averigüé',
    tenses: ['preterito', 'subjPresente'],
    test: (e) => isCarGarZar(e.infinitive),
  },
  {
    id: 'ger-gir', group: 'Spelling changes', name: '-ger, -gir',
    rule: 'g → j before a or o, to keep the soft sound. Yo present and the subjunctive.',
    example: 'proteger → protejo · exigir → exijo, exija',
    tenses: ['presente', 'subjPresente'],
    test: (e) => isGerGir(e.infinitive),
  },
  {
    id: 'zc', group: 'Spelling changes', name: '-cer, -cir → -zco',
    rule: 'After a vowel, -cer/-cir verbs end in -zco in the yo present (and -zca in the subjunctive).',
    example: 'conocer → conozco · ofrecer → ofrezco · traducir → traduzco',
    tenses: ['presente', 'subjPresente'],
    test: isZc,
  },
  {
    id: 'uir', group: 'Spelling changes', name: '-uir verbs (add y)',
    rule: 'Add a y before endings that don’t start with i.',
    example: 'destruir → destruyo, destruyes, destruye, destruimos, destruyen · destruyó',
    tenses: ['presente', 'preterito'],
    test: (e) => isUir(e.infinitive),
  },
  {
    id: 'y-preterite', group: 'Spelling changes', name: 'i → y between vowels',
    rule: 'An unstressed i between two vowels becomes y in the él/ellos preterite and the gerund.',
    example: 'leer → leyó, leyeron, leyendo · caer → cayó · oír → oyeron',
    tenses: ['preterito', 'progresivo'],
    test: (e) => isYPreterite(e.infinitive) && !e.traits.strongPreterite, // not traer (traje)
  },
  {
    id: 'accent', group: 'Spelling changes', name: 'Accented í / ú',
    rule: 'Write an accent on the stressed í or ú in the present — except nosotros.',
    example: 'confiar → confío, confías · graduarse → me gradúo',
    tenses: ['presente', 'subjPresente'],
    requireAccents: true, // the accents are the lesson: always checked
    test: (e) => ['í', 'ú'].includes(e.traits.stemChange),
  },

  // Irregular
  {
    id: 'yo-go', group: 'Irregular verbs', name: 'Yo-go verbs',
    rule: 'The yo form ends in -go. The present subjunctive is built from it.',
    example: 'tener → tengo · hacer → hago · salir → salgo · decir → digo',
    tenses: ['presente', 'subjPresente'],
    test: (e) => /go$/.test(e.traits.irregularYo ?? ''),
  },
  {
    id: 'yo-oy', group: 'Irregular verbs', name: 'Yo-oy verbs',
    rule: 'The yo form ends in -oy.',
    example: 'ser → soy · estar → estoy · dar → doy · ir → voy',
    tenses: ['presente'],
    test: (e) => /oy$/.test(e.traits.irregularYo ?? ''),
  },
  {
    id: 'strong-preterite', group: 'Irregular verbs', name: 'Irregular preterite stems',
    rule: 'Special stems with the endings -e, -iste, -o, -imos, -ieron — and no accents.',
    example: 'tener → tuve · poder → pude · querer → quise · decir → dije',
    tenses: ['preterito', 'subjImperfecto'],
    requireAccents: true, // "no accents" is part of the lesson: always checked
    test: (e) => e.traits.strongPreterite,
  },
  {
    id: 'future-stems', group: 'Irregular verbs', name: 'Irregular future stems',
    rule: 'Irregular stems in the future and conditional; the endings stay regular.',
    example: 'tener → tendré · hacer → haré · decir → diría · saber → sabría',
    tenses: ['futuro', 'condicional'],
    test: (e) => e.traits.irregularFuture,
  },
  {
    id: 'participles', group: 'Irregular verbs', name: 'Irregular participles',
    rule: 'Irregular past participles, used in the perfect tenses (he hecho, has visto).',
    example: 'hacer → hecho · escribir → escrito · volver → vuelto · ver → visto',
    tenses: ['perfecto'],
    test: (e) => e.traits.irregularParticiple,
  },
  {
    id: 'fully-irregular', group: 'Irregular verbs', name: 'Totally irregular',
    rule: 'Irregular in many tenses. These just have to be memorized.',
    example: 'ser, ir, estar, dar, ver, haber',
    tenses: ['presente', 'preterito', 'imperfecto'],
    test: (e) => e.traits.fullyIrregular,
  },

  // Pronouns
  {
    id: 'reflexive', group: 'Verbs with pronouns', name: 'Reflexive verbs',
    rule: 'The subject does the action to itself. Use me, te, se, nos, se before the verb.',
    example: 'levantarse → me levanto · lavarse las manos → me lavo las manos',
    tenses: ['presente', 'preterito'],
    test: (e) => e.reflexive && !PRONOMINAL.has(e.key),
  },
  {
    id: 'pronominal', group: 'Verbs with pronouns', name: 'Pronominal verbs',
    rule: 'Always used with the pronoun, or the pronoun changes the meaning.',
    example: 'ir (to go) → irse (to leave) · quejarse de · darse cuenta de',
    tenses: ['presente', 'preterito'],
    test: (e) => e.reflexive && PRONOMINAL.has(e.key),
  },
];

export const ALL_VERBS_CATEGORY = {
  id: 'all', name: 'All verbs',
  rule: 'Every verb in the app, from every word set.',
  example: '',
  tenses: ['presente', 'preterito'],
};

export const categoryById = (id) =>
  id === 'all' ? ALL_VERBS_CATEGORY : CATEGORIES.find((c) => c.id === id);
