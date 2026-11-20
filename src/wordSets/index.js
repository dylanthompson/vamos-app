import spanish1 from './spanish1.js';
import spanish2 from './spanish2.js';
import spanish3 from './spanish3.js';
import spanish3Verbs from './spanish3Verbs.js';

// Each word set: { id, name, emoji, tags: { difficulty, theme }, faces?, drill?, words: [{ es, en }] }
// `faces` optionally relabels the card sides (defaults: Español / English).
// `drill` marks a conjugation drill (see spanish3Verbs.js).
const wordSets = [...spanish1, ...spanish2, ...spanish3, ...spanish3Verbs];

export default wordSets;
