// English conjugation, for the prompts on verb-practice cards
// ("you (tú) practiced", "Mom wants us to leave").

const IRREGULAR = {
  have: ['had', 'had'], do: ['did', 'done'], undo: ['undid', 'undone'], go: ['went', 'gone'],
  come: ['came', 'come'], become: ['became', 'become'], overcome: ['overcame', 'overcome'],
  make: ['made', 'made'], say: ['said', 'said'], see: ['saw', 'seen'], give: ['gave', 'given'],
  forgive: ['forgave', 'forgiven'], know: ['knew', 'known'], eat: ['ate', 'eaten'],
  drink: ['drank', 'drunk'], sleep: ['slept', 'slept'], speak: ['spoke', 'spoken'],
  read: ['read', 'read'], write: ['wrote', 'written'], think: ['thought', 'thought'],
  begin: ['began', 'begun'], lose: ['lost', 'lost'], understand: ['understood', 'understood'],
  stand: ['stood', 'stood'], find: ['found', 'found'], tell: ['told', 'told'],
  show: ['showed', 'shown'], get: ['got', 'gotten'], put: ['put', 'put'], leave: ['left', 'left'],
  bring: ['brought', 'brought'], buy: ['bought', 'bought'], fall: ['fell', 'fallen'],
  feel: ['felt', 'felt'], forget: ['forgot', 'forgotten'], fight: ['fought', 'fought'],
  hear: ['heard', 'heard'], run: ['ran', 'run'], swim: ['swam', 'swum'], drive: ['drove', 'driven'],
  take: ['took', 'taken'], wear: ['wore', 'worn'], pay: ['paid', 'paid'], sit: ['sat', 'sat'],
  break: ['broke', 'broken'], build: ['built', 'built'], cost: ['cost', 'cost'], fit: ['fit', 'fit'],
  wake: ['woke', 'woken'], keep: ['kept', 'kept'], meet: ['met', 'met'], send: ['sent', 'sent'],
  spend: ['spent', 'spent'], teach: ['taught', 'taught'], catch: ['caught', 'caught'],
  choose: ['chose', 'chosen'], fly: ['flew', 'flown'], grow: ['grew', 'grown'], win: ['won', 'won'],
  sell: ['sold', 'sold'], hold: ['held', 'held'], lead: ['led', 'led'], mean: ['meant', 'meant'],
  set: ['set', 'set'], cut: ['cut', 'cut'], shut: ['shut', 'shut'], hit: ['hit', 'hit'],
  sing: ['sang', 'sung'], throw: ['threw', 'thrown'], draw: ['drew', 'drawn'],
};
// Multi-syllable verbs that double their final consonant (preferred, regretting)
const DOUBLES = new Set('prefer regret occur refer admit commit permit control forget begin omit submit upset'.split(' '));

const doublesFinal = (v) => DOUBLES.has(v) || /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(v);

function third(v) {
  if (v === 'have') return 'has';
  if (/(s|sh|ch|x|z|o)$/.test(v)) return v + 'es';
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + 'ies';
  return v + 's';
}

function regularPast(v) {
  if (v.endsWith('e')) return v + 'd';
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + 'ied';
  if (doublesFinal(v)) return v + v.slice(-1) + 'ed';
  return v + 'ed';
}

const past = (v) => IRREGULAR[v]?.[0] ?? regularPast(v);
const participle = (v) => IRREGULAR[v]?.[1] ?? regularPast(v);

function gerund(v) {
  if (v === 'be') return 'being';
  if (v.endsWith('ie')) return v.slice(0, -2) + 'ying';
  if (/[^eoy]e$/.test(v)) return v.slice(0, -1) + 'ing';
  if (doublesFinal(v)) return v + v.slice(-1) + 'ing';
  return v + 'ing';
}

// English subject for each Spanish person (index into the 5-row tables)
const S = {
  I: { text: 'I', am: 'am', was: 'was', has: 'have', third: false, poss: 'my', refl: 'myself', obj: 'me' },
  youT: { text: 'you (tú)', am: 'are', was: 'were', has: 'have', third: false, poss: 'your', refl: 'yourself', obj: 'you (tú)' },
  he: { text: 'he', am: 'is', was: 'was', has: 'has', third: true, poss: 'his', refl: 'himself', obj: 'him' },
  she: { text: 'she', am: 'is', was: 'was', has: 'has', third: true, poss: 'her', refl: 'herself', obj: 'her' },
  youU: { text: 'you (usted)', am: 'are', was: 'were', has: 'have', third: false, poss: 'your', refl: 'yourself', obj: 'you (usted)' },
  we: { text: 'we', am: 'are', was: 'were', has: 'have', third: false, poss: 'our', refl: 'ourselves', obj: 'us' },
  they: { text: 'they', am: 'are', was: 'were', has: 'have', third: false, poss: 'their', refl: 'themselves', obj: 'them' },
  youAll: { text: 'you all (ustedes)', am: 'are', was: 'were', has: 'have', third: false, poss: 'your', refl: 'yourselves', obj: 'you all (ustedes)' },
};
const PERSON_SUBJECTS = [[S.I], [S.youT], [S.he, S.she, S.youU], [S.we], [S.they, S.youAll]];
const IMPERATIVE_SUBJECTS = { 'tú': S.youT, usted: S.youU, nosotros: S.we, ustedes: S.youAll };

/** "to know (facts) / to be acquainted" → { head: 'know', rest: '', note: 'facts' } */
export function parseGloss(gloss) {
  let g = gloss.split(' / ')[0].trim().replace(/^to /, '');
  let note = '';
  const m = g.match(/^(.*?)\s*\(([^)]*)\)$/);
  if (m) [, g, note] = m;
  const [head, ...rest] = g.split(' ');
  return { head, rest: rest.join(' '), note };
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * English prompt for practicing `gloss` in a tense.
 * `slot` is the person index (0–4), or for the imperative e.g. "tú+" / "nosotros-".
 * Returns { text, note, frame } — `frame` is the Spanish sentence the answer fits into.
 */
export function englishPrompt(gloss, tense, slot) {
  const { head, rest, note } = parseGloss(gloss);
  const be = head === 'be';

  if (tense === 'imperativo') {
    const person = slot.slice(0, -1);
    const negative = slot.endsWith('-');
    const s = IMPERATIVE_SUBJECTS[person];
    const tail = personalize(rest, s);
    const verb = `${head}${tail ? ' ' + tail : ''}`;
    const text = person === 'nosotros'
      ? `Let's ${negative ? 'not ' : ''}${verb}!`
      : `${negative ? "Don't " : ''}${negative ? verb : capitalize(verb)}!`;
    return { text: person === 'nosotros' ? text : `(${person}) ${text}`, note, frame: '' };
  }

  const s = pick(PERSON_SUBJECTS[slot]);
  const tail = personalize(rest, s);
  const withTail = (v) => (tail ? `${v} ${tail}` : v);

  switch (tense) {
    case 'subjPresente':
      return { text: `Mom wants ${s.obj} to ${withTail(head)}`, note, frame: 'Mamá quiere que ___' };
    case 'subjImperfecto':
      return { text: `Mom wanted ${s.obj} to ${withTail(head)}`, note, frame: 'Mamá quería que ___' };
    default: {
      const verb = {
        presente: be ? s.am : s.third ? third(head) : head,
        preterito: be ? s.was : past(head),
        imperfecto: `used to ${head}`,
        futuro: `will ${head}`,
        condicional: `would ${head}`,
        progresivo: `${s.am} ${gerund(head)}`,
        perfecto: `${s.has} ${be ? 'been' : participle(head)}`,
      }[tense];
      return { text: capitalize(`${s.text} ${withTail(verb)}`), note, frame: '' };
    }
  }
}

function personalize(rest, s) {
  return rest.replace(/\bone's\b/g, s.poss).replace(/\boneself\b/g, s.refl);
}
