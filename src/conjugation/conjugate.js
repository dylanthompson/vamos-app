// Spanish verb conjugator.
// Regular -ar/-er/-ir patterns, stem changes, spelling changes (c→qu, g→gu,
// z→c, g→j, c→zc, y-insertion…), and the common irregular verbs. Compounds of
// irregular bases (mantener, proponer, deshacer…) are derived from the base.

// Persons shown to the learner (no vosotros — see conjugate()).
export const PERSONS = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'ellos/ellas/ustedes'];
// Internal tables still have six slots, in the standard order.
const VOSOTROS = 4;
const REFLEXIVE = ['me', 'te', 'se', 'nos', 'os', 'se'];
const BOOT = [0, 1, 2, 5]; // persons whose stem is stressed ("boot" verbs)

const VOWELS = 'aeiouáéíóúü';
const STRONG = 'aeoáéíóú'; // accented i/u act as strong vowels (break diphthongs)
const ACCENT = { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' };
const UNACCENT = { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u' };

const isVowel = (c) => !!c && VOWELS.includes(c);
const stripAccents = (s) => s.replace(/[áéíóú]/g, (c) => UNACCENT[c]);

const ENDINGS = {
  presente: {
    ar: ['o', 'as', 'a', 'amos', 'áis', 'an'],
    er: ['o', 'es', 'e', 'emos', 'éis', 'en'],
    ir: ['o', 'es', 'e', 'imos', 'ís', 'en'],
  },
  preterito: {
    ar: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
    er: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
    ir: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
  },
  imperfecto: {
    ar: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'],
    er: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
    ir: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
  },
  subj: {
    ar: ['e', 'es', 'e', 'emos', 'éis', 'en'],
    er: ['a', 'as', 'a', 'amos', 'áis', 'an'],
    ir: ['a', 'as', 'a', 'amos', 'áis', 'an'],
  },
};
const FUTURE = ['é', 'ás', 'á', 'emos', 'éis', 'án'];
const CONDITIONAL = ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'];
const STRONG_PRETERITE = ['e', 'iste', 'o', 'imos', 'isteis', 'ieron'];
const HABER_PRESENT = ['he', 'has', 'ha', 'hemos', 'habéis', 'han'];
const ESTAR_PRESENT = ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'];

// ie: e→ie, ue: o→ue, u-ue: u→ue (jugar), i: e→i, í/ú: written accent (confío, gradúo)
const STEM_CHANGES = {};
const addChanges = (type, verbs) => verbs.split(' ').forEach((v) => (STEM_CHANGES[v] = type));
addChanges('ie', 'pensar empezar comenzar cerrar despertar sentar negar recomendar calentar nevar atravesar querer entender perder encender defender tener venir sentir mentir preferir sugerir advertir arrepentir divertir convertir requerir hervir');
addChanges('ue', 'poder volver devolver envolver resolver soler mover llover doler torcer dormir morir acordar acostar almorzar contar costar encontrar mostrar probar recordar soñar volar colgar rogar');
addChanges('i', 'pedir despedir servir repetir seguir conseguir perseguir vestir medir competir elegir corregir decir reír');
addChanges('u-ue', 'jugar');
addChanges('í', 'confiar desconfiar enviar esquiar guiar fiar');
addChanges('ú', 'graduar continuar actuar evaluar');

const FUI = ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'];

const IRREGULAR = {
  ser: {
    presente: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
    preterito: FUI,
    imperfecto: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
    subjPresente: ['sea', 'seas', 'sea', 'seamos', 'seáis', 'sean'],
    imperTu: 'sé',
    gerund: 'siendo',
  },
  ir: {
    presente: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
    preterito: FUI,
    imperfecto: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban'],
    subjPresente: ['vaya', 'vayas', 'vaya', 'vayamos', 'vayáis', 'vayan'],
    imperTu: 've',
    imperNos: 'vamos',
    gerund: 'yendo',
  },
  estar: {
    presente: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
    pretStem: 'estuv',
    subjPresente: ['esté', 'estés', 'esté', 'estemos', 'estéis', 'estén'],
    imperTu: 'está',
  },
  dar: {
    presente: ['doy', 'das', 'da', 'damos', 'dais', 'dan'],
    preterito: ['di', 'diste', 'dio', 'dimos', 'disteis', 'dieron'],
    subjPresente: ['dé', 'des', 'dé', 'demos', 'deis', 'den'],
  },
  ver: {
    presente: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
    preterito: ['vi', 'viste', 'vio', 'vimos', 'visteis', 'vieron'],
    imperfecto: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'],
    subjStem: 've',
  },
  haber: {
    presente: ['he', 'has', 'ha (hay)', 'hemos', 'habéis', 'han'],
    pretStem: 'hub',
    futStem: 'habr',
    subjStem: 'hay',
    noImperative: true,
  },
  tener: { yo: 'tengo', pretStem: 'tuv', futStem: 'tendr', imperTu: 'ten' },
  venir: { yo: 'vengo', pretStem: 'vin', futStem: 'vendr', imperTu: 'ven' },
  poner: { yo: 'pongo', pretStem: 'pus', futStem: 'pondr', imperTu: 'pon' },
  salir: { yo: 'salgo', futStem: 'saldr', imperTu: 'sal' },
  valer: { yo: 'valgo', futStem: 'valdr' },
  hacer: { yo: 'hago', pretStem: 'hic', pret3s: 'hizo', futStem: 'har', imperTu: 'haz' },
  decir: { yo: 'digo', pretStem: 'dij', futStem: 'dir', imperTu: 'di' },
  poder: { pretStem: 'pud', futStem: 'podr', gerund: 'pudiendo' },
  querer: { pretStem: 'quis', futStem: 'querr' },
  saber: { yo: 'sé', pretStem: 'sup', futStem: 'sabr', subjStem: 'sep' },
  caber: { yo: 'quepo', pretStem: 'cup', futStem: 'cabr' },
  andar: { pretStem: 'anduv' },
  traer: { yo: 'traigo', pretStem: 'traj' },
  caer: { yo: 'caigo' },
  oír: { presente: ['oigo', 'oyes', 'oye', 'oímos', 'oís', 'oyen'], subjStem: 'oig' },
  reír: {
    presente: ['río', 'ríes', 'ríe', 'reímos', 'reís', 'ríen'],
    preterito: ['reí', 'reíste', 'rió', 'reímos', 'reísteis', 'rieron'],
    subjPresente: ['ría', 'rías', 'ría', 'riamos', 'riáis', 'rían'],
    gerund: 'riendo',
  },
};

// Verbs built on an irregular base: mantener, proponer, deshacer, sonreír…
const COMPOUND_BASES = ['tener', 'poner', 'hacer', 'venir', 'traer', 'reír'];

const IRREGULAR_PARTICIPLES = [
  ['scribir', 'scrito'], ['cubrir', 'cubierto'], ['abrir', 'abierto'],
  ['poner', 'puesto'], ['hacer', 'hecho'], ['decir', 'dicho'],
  ['volver', 'vuelto'], ['solver', 'suelto'], ['romper', 'roto'],
  ['morir', 'muerto'], ['freír', 'frito'], ['imprimir', 'impreso'],
];

function irregularParticiple(inf) {
  if (inf === 'ver' || inf === 'prever') return inf.slice(0, -2) + 'isto';
  for (const [suffix, replacement] of IRREGULAR_PARTICIPLES) {
    if (inf.endsWith(suffix)) return inf.slice(0, -suffix.length) + replacement;
  }
  return null;
}

// ---- Stress & written accents (for attaching pronouns: levántate, sentémonos)

function nuclei(word) {
  const w = word.toLowerCase();
  const out = [];
  let cur = null;
  for (let i = 0; i < w.length; i++) {
    const c = w[i];
    const silentU = c === 'u' && (w[i - 1] === 'q' || (w[i - 1] === 'g' && 'eiéí'.includes(w[i + 1] ?? '-')));
    if (!isVowel(c) || silentU) {
      cur = null;
    } else if (cur && !(STRONG.includes(c) && STRONG.includes(w[cur.end]))) {
      cur.end = i;
    } else {
      cur = { start: i, end: i };
      out.push(cur);
    }
  }
  return out;
}

function stressIndex(word) {
  const n = nuclei(word);
  const accented = n.findIndex(({ start, end }) => /[áéíóú]/.test(word.slice(start, end + 1)));
  if (accented >= 0) return accented;
  if (n.length < 2) return 0;
  return /[aeiouns]$/.test(word) ? n.length - 2 : n.length - 1;
}

function accentNucleus(word, { start, end }) {
  let idx = -1;
  for (let i = start; i <= end; i++) if ('aeo'.includes(word[i])) idx = i;
  if (idx < 0) idx = end; // only weak vowels (ui/iu): accent the second
  return word.slice(0, idx) + (ACCENT[word[idx]] ?? word[idx]) + word.slice(idx + 1);
}

// Attach enclitic pronoun(s), adding a written accent where stress requires it.
function attach(base, suffix, dropLast = false) {
  const si = stressIndex(base);
  const word = (dropLast ? base.slice(0, -1) : base) + suffix;
  if (/[áéíóú]/.test(base)) {
    return nuclei(base).length === 1 ? stripAccents(word) : word; // dé + se → dese
  }
  const n = nuclei(word);
  return n.length - si >= 3 ? accentNucleus(word, n[si]) : word;
}

// ---- Core helpers

// Join stem + ending, applying Spanish spelling rules.
function join(stem, ending, cls) {
  const e0 = ending[0];
  if (cls === 'ar') {
    if ('eé'.includes(e0)) {
      if (stem.endsWith('gu')) return stem.slice(0, -2) + 'gü' + ending; // averigüé
      if (stem.endsWith('c')) return stem.slice(0, -1) + 'qu' + ending; // busqué
      if (stem.endsWith('g')) return stem + 'u' + ending; // llegué
      if (stem.endsWith('z')) return stem.slice(0, -1) + 'c' + ending; // empecé
    }
    return stem + ending;
  }
  const last = stem.slice(-1);
  if ('aoá'.includes(e0)) {
    if (stem.endsWith('gu')) return stem.slice(0, -2) + 'g' + ending; // sigo
    if (last === 'g') return stem.slice(0, -1) + 'j' + ending; // protejo
    if (last === 'c') return stem.slice(0, -1) + (isVowel(stem.slice(-2, -1)) ? 'zc' : 'z') + ending; // conozco, tuerzo
  }
  const silentU = stem.endsWith('gu') || stem.endsWith('qu');
  if (!silentU && isVowel(last)) {
    if (e0 === 'i' && isVowel(ending[1])) return stem + 'y' + ending.slice(1); // leyó, cayendo
    if (last === 'u' && cls === 'ir' && 'aeoáé'.includes(e0)) return stem + 'y' + ending; // destruyo
    if ('aeo'.includes(last) && e0 === 'i') return stem + 'í' + ending.slice(1); // leíste, oído
  }
  return stem + ending;
}

function changeStem(stem, type, weak) {
  const rep = (from, to) => {
    const i = stem.lastIndexOf(from);
    return i < 0 ? stem : stem.slice(0, i) + to + stem.slice(i + from.length);
  };
  if (weak) {
    if (type === 'ie' || type === 'i') return rep('e', 'i');
    if (type === 'ue') return rep('o', 'u');
    return stem;
  }
  switch (type) {
    case 'ie': return rep('e', 'ie');
    case 'ue': return rep('o', 'ue');
    case 'u-ue': return rep('u', 'ue');
    case 'i': return rep('e', 'i');
    case 'í': return rep('i', 'í');
    case 'ú': return rep('u', 'ú');
    default: return stem;
  }
}

function mapForms(raw, fn) {
  const out = {};
  for (const [k, v] of Object.entries(raw)) {
    out[k] = Array.isArray(v) ? v.map(fn) : typeof v === 'string' ? fn(v) : v;
  }
  return out;
}

// Non-reflexive forms for an infinitive
function buildRaw(inf) {
  if (inf === 'satisfacer') {
    return mapForms(buildRaw('hacer'), (f) => 'satisf' + f.slice(1));
  }
  for (const base of COMPOUND_BASES) {
    if (inf !== base && inf.endsWith(base)) {
      const baseRaw = buildRaw(base);
      const raw = mapForms(baseRaw, (f) => inf.slice(0, -base.length) + f);
      // ten → mantén, pon → propón (stress now falls on a final syllable ending in n)
      if (nuclei(baseRaw.imperTu).length === 1 && /n$/.test(baseRaw.imperTu)) {
        const n = nuclei(raw.imperTu);
        raw.imperTu = accentNucleus(raw.imperTu, n[n.length - 1]);
      }
      raw.participle = irregularParticiple(inf) ?? raw.participle;
      return raw;
    }
  }

  const o = IRREGULAR[inf] ?? {};
  const cls = inf.endsWith('ar') ? 'ar' : inf.endsWith('er') ? 'er' : 'ir';
  const stem = inf.slice(0, -2);
  const type = STEM_CHANGES[inf];
  const bootStem = type ? changeStem(stem, type, false) : stem;
  const weakStem = type && cls === 'ir' ? changeStem(stem, type, true) : stem;

  const presente = o.presente ?? ENDINGS.presente[cls].map((e, i) => join(BOOT.includes(i) ? bootStem : stem, e, cls));
  if (o.yo && !o.presente) presente[0] = o.yo;

  let subjPresente;
  if (o.subjPresente) subjPresente = o.subjPresente;
  else if (o.subjStem || o.yo) {
    const s = o.subjStem ?? o.yo.slice(0, -1);
    subjPresente = ENDINGS.subj[cls].map((e) => s + e);
  } else {
    subjPresente = ENDINGS.subj[cls].map((e, i) =>
      join(BOOT.includes(i) ? bootStem : weakStem, e, cls)
    );
  }

  let preterito;
  const pretStem = o.pretStem ?? (inf.endsWith('ducir') ? stem.slice(0, -1) + 'j' : null);
  if (o.preterito) preterito = o.preterito;
  else if (pretStem) {
    preterito = STRONG_PRETERITE.map((e) => pretStem + e);
    if (pretStem.endsWith('j')) preterito[5] = pretStem + 'eron'; // dijeron, trajeron
    if (o.pret3s) preterito[2] = o.pret3s;
  } else {
    preterito = ENDINGS.preterito[cls].map((e, i) => join(i === 2 || i === 5 ? weakStem : stem, e, cls));
  }

  const imperfecto = o.imperfecto ?? ENDINGS.imperfecto[cls].map((e) => join(stem, e, cls));
  const futStem = o.futStem ?? stripAccents(inf);

  const impStem = preterito[5].slice(0, -3); // hablaron → habla
  const impStemAccented = impStem.slice(0, -1) + (ACCENT[impStem.slice(-1)] ?? impStem.slice(-1));
  const subjImperfecto = ['ra', 'ras', 'ra', 'ramos', 'rais', 'ran'].map(
    (e, i) => (i === 3 ? impStemAccented : impStem) + e
  );

  return {
    cls,
    presente,
    preterito,
    imperfecto,
    futuro: FUTURE.map((e) => futStem + e),
    condicional: CONDITIONAL.map((e) => futStem + e),
    subjPresente,
    subjImperfecto,
    gerund: o.gerund ?? (cls === 'ar' ? stem + 'ando' : join(weakStem, 'iendo', cls)),
    participle: irregularParticiple(inf) ?? (cls === 'ar' ? stem + 'ado' : join(stem, 'ido', cls)),
    imperTu: o.imperTu ?? presente[2],
    imperNos: o.imperNos ?? null,
    noImperative: !!o.noImperative,
  };
}

const FULLY_IRREGULAR = ['ser', 'ir', 'estar', 'dar', 'ver', 'haber'];

/**
 * Describe how a verb conjugates, for grouping verbs into study categories.
 * Compounds report their base's traits (mantener → tener).
 */
export function verbTraits(inf) {
  const base = inf === 'satisfacer'
    ? 'hacer'
    : COMPOUND_BASES.find((b) => inf !== b && inf.endsWith(b)) ?? inf;
  const o = IRREGULAR[base] ?? {};
  return {
    ending: inf.endsWith('ar') ? 'ar' : inf.endsWith('er') ? 'er' : 'ir',
    stemChange: STEM_CHANGES[base] ?? null,
    irregularYo: o.yo ?? o.presente?.[0] ?? null, // e.g. 'tengo', 'soy'
    strongPreterite: !!o.pretStem || inf.endsWith('ducir'), // tuve, dije, traduje
    irregularPreterite: !!o.preterito,
    irregularFuture: !!o.futStem,
    irregularParticiple: !!irregularParticiple(inf),
    fullyIrregular: FULLY_IRREGULAR.includes(inf),
  };
}

export const TENSES = [
  { id: 'presente', label: 'Presente', mood: 'Indicativo' },
  { id: 'preterito', label: 'Pretérito', mood: 'Indicativo' },
  { id: 'imperfecto', label: 'Imperfecto', mood: 'Indicativo' },
  { id: 'futuro', label: 'Futuro', mood: 'Indicativo' },
  { id: 'condicional', label: 'Condicional', mood: 'Indicativo' },
  { id: 'progresivo', label: 'Pres. progresivo', mood: 'Indicativo' },
  { id: 'perfecto', label: 'Pres. perfecto', mood: 'Indicativo' },
  { id: 'subjPresente', label: 'Presente', mood: 'Subjuntivo' },
  { id: 'subjImperfecto', label: 'Imperfecto', mood: 'Subjuntivo' },
  { id: 'imperativo', label: 'Mandatos', mood: 'Imperativo' },
];

/**
 * Conjugate a Spanish verb.
 * @param {string} infinitive e.g. "tener", "reír" (without reflexive "se")
 * @param {boolean} reflexive whether to conjugate as "tenerse" (me/te/se…)
 */
export function conjugate(infinitive, reflexive = false) {
  const raw = buildRaw(infinitive);
  // Forms are built for all six persons, then vosotros (index 4) is dropped:
  // the app teaches Latin American (Mexican) Spanish, which uses ustedes instead.
  const withPronoun = (arr) =>
    arr.map((f, i) => (reflexive ? `${REFLEXIVE[i]} ${f}` : f)).filter((_, i) => i !== VOSOTROS);

  const tenses = {
    presente: withPronoun(raw.presente),
    preterito: withPronoun(raw.preterito),
    imperfecto: withPronoun(raw.imperfecto),
    futuro: withPronoun(raw.futuro),
    condicional: withPronoun(raw.condicional),
    progresivo: withPronoun(ESTAR_PRESENT.map((e) => `${e} ${raw.gerund}`)),
    perfecto: withPronoun(HABER_PRESENT.map((h) => `${h} ${raw.participle}`)),
    subjPresente: withPronoun(raw.subjPresente),
    subjImperfecto: withPronoun(raw.subjImperfecto),
  };

  let imperativo = null;
  if (!raw.noImperative) {
    const sub = raw.subjPresente;
    const neg = (i) => `no ${reflexive ? REFLEXIVE[i] + ' ' : ''}${sub[i]}`;
    const nosBase = raw.imperNos ?? sub[3];
    imperativo = [
      { person: 'tú', aff: reflexive ? attach(raw.imperTu, 'te') : raw.imperTu, neg: neg(1) },
      { person: 'usted', aff: reflexive ? attach(sub[2], 'se') : sub[2], neg: neg(2) },
      { person: 'nosotros', aff: reflexive ? attach(nosBase, 'nos', true) : nosBase, neg: neg(3) },
      { person: 'ustedes', aff: reflexive ? attach(sub[5], 'se') : sub[5], neg: neg(5) },
    ];
  }

  return {
    infinitive: infinitive + (reflexive ? 'se' : ''),
    gerund: reflexive ? attach(raw.gerund, 'se') : raw.gerund,
    participle: raw.participle,
    tenses,
    imperativo,
  };
}
