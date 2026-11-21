// Ser vs estar fill-in-the-blank exercises (Mexican Spanish).
// Each item: { es: sentence with "___", en, answers: [conjugated forms…], use, note? }
// The first answer is the one shown as correct; `use` explains why (see USES).
import { conjugate } from '../conjugation/conjugate.js';
import { shuffle } from '../useDeck.js';
import { loosen, matchAnswer, normalize } from '../answers.js';

export const USES = {
  // Ser
  description: { verb: 'ser', label: 'Description', rule: 'Traits that define someone or something: looks, personality, what it is like.', example: 'Mi hermano es alto.' },
  occupation: { verb: 'ser', label: 'Occupation', rule: 'Jobs and roles — what someone does for a living.', example: 'Mi mamá es doctora.' },
  identity: { verb: 'ser', label: 'Identity & relationships', rule: 'Who or what someone is: names, relationships, nouns.', example: 'Ella es mi prima.' },
  origin: { verb: 'ser', label: 'Origin', rule: 'Ser de: where someone or something is from.', example: 'Somos de Oaxaca.' },
  material: { verb: 'ser', label: 'Material & possession', rule: 'Ser de: what it is made of, or whose it is.', example: 'La mesa es de madera.' },
  time: { verb: 'ser', label: 'Time & dates', rule: 'Telling time, days, dates, and “it’s late / early”.', example: 'Son las tres. Hoy es lunes.' },
  event: { verb: 'ser', label: 'Events', rule: 'Where or when an event takes place uses ser — even though it’s a location.', example: 'La fiesta es en mi casa.' },
  total: { verb: 'ser', label: 'Totals', rule: '¿Cuánto es? asks for the total amount to pay.', example: '¿Cuánto es todo?' },
  passive: { verb: 'ser', label: 'Passive voice', rule: 'Ser + participle describes an action done (by someone).', example: 'El puente fue construido en 1950.' },
  impersonal: { verb: 'ser', label: 'Impersonal expressions', rule: 'Es importante / necesario / mejor / posible…', example: 'Es importante llegar a tiempo.' },
  purpose: { verb: 'ser', label: 'Ser para', rule: 'Ser para: who or what something is intended for.', example: 'Este regalo es para ti.' },
  meaningSer: { verb: 'ser', label: 'Meaning changes', rule: 'Some adjectives mean something different with ser.', example: 'Es listo. (He’s clever.)' },

  // Estar
  location: { verb: 'estar', label: 'Location', rule: 'Where a person, place, or thing is.', example: 'El libro está en la mesa.' },
  condition: { verb: 'estar', label: 'Condition', rule: 'Physical states and health — how someone or something is right now.', example: 'Estoy cansado.' },
  emotion: { verb: 'estar', label: 'Emotion', rule: 'How someone feels.', example: 'Ella está nerviosa.' },
  progressive: { verb: 'estar', label: 'Progressive', rule: 'Estar + -ando / -iendo: an action in progress.', example: 'Estamos estudiando.' },
  result: { verb: 'estar', label: 'Result of an action', rule: 'Estar + participle: the state left after something happened.', example: 'La ventana está abierta.' },
  death: { verb: 'estar', label: 'Death', rule: 'Estar muerto — death is treated as a resulting state, even though it’s permanent.', example: 'Mi bisabuelo está muerto.' },
  temporaryRole: { verb: 'estar', label: 'Estar de', rule: 'Estar de + job/activity: a temporary role or situation (de mesero, de vacaciones).', example: 'Está de mesero este verano.' },
  dateEstar: { verb: 'estar', label: 'Estamos a / en', rule: 'Estamos a + date, estamos en + season or month: where we are in the calendar.', example: 'Estamos en otoño.' },
  price: { verb: 'estar', label: 'Changing prices', rule: '¿A cuánto está? asks for a price that changes (per kilo, today’s rate).', example: '¿A cuánto está el kilo?' },
  appearance: { verb: 'estar', label: 'Looks / tastes', rule: 'How someone looks or something tastes right now, or a change you notice.', example: '¡Qué alto estás!' },
  expression: { verb: 'estar', label: 'Set expressions', rule: 'Fixed phrases: estar bien, estar de acuerdo, estar por (about to).', example: 'Estoy de acuerdo.' },
  weather: { verb: 'estar', label: 'Weather', rule: 'Estar nublado / despejado — the state of the sky right now.', example: 'Hoy está nublado.' },
  meaningEstar: { verb: 'estar', label: 'Meaning changes', rule: 'Some adjectives mean something different with estar.', example: 'Está listo. (He’s ready.)' },
};

const item = (es, en, answers, use, note) => ({
  es, en, answers: Array.isArray(answers) ? answers : [answers], use, note,
});

// The ser and estar sentences for one meaning-changing adjective: [es, en, answer] each
const meaningPair = (note, [serEs, serEn, serAnswer], [estarEs, estarEn, estarAnswer]) => [
  item(serEs, serEn, serAnswer, 'meaningSer', note),
  item(estarEs, estarEn, estarAnswer, 'meaningEstar', note),
];

export const SER_ESTAR_EXERCISES = [
  {
    id: 'basics',
    name: 'The basics',
    emoji: '🧱',
    level: 1,
    description: 'Description, occupation, origin, time — or location, condition, emotion?',
    items: [
      item('Mi mamá ___ doctora.', 'My mom is a doctor.', 'es', 'occupation'),
      item('Yo ___ estudiante.', 'I am a student.', 'soy', 'occupation'),
      item('Nosotros ___ de Oaxaca.', "We're from Oaxaca.", 'somos', 'origin'),
      item('Mi hermano ___ muy alto.', 'My brother is very tall.', 'es', 'description'),
      item('Tú ___ muy simpático.', "You're very nice.", 'eres', 'description'),
      item('Ustedes ___ muy inteligentes.', 'You all are very smart.', 'son', 'description'),
      item('Ella ___ mi mejor amiga.', 'She is my best friend.', 'es', 'identity'),
      item('Hoy ___ viernes.', 'Today is Friday.', 'es', 'time'),
      item('___ las tres y media.', "It's three thirty.", 'son', 'time'),
      item('La mesa ___ de madera.', 'The table is made of wood.', 'es', 'material'),
      item('El carro ___ de mi papá.', "The car is my dad's.", 'es', 'material'),
      item('El libro ___ en la mesa.', 'The book is on the table.', 'está', 'location'),
      item('¿Dónde ___ tus papás?', 'Where are your parents?', 'están', 'location'),
      item('Yo ___ en la casa de mi tía.', "I'm at my aunt's house.", 'estoy', 'location'),
      item('Yo ___ cansado hoy.', "I'm tired today.", 'estoy', 'condition'),
      item('Mi abuela ___ enferma.', 'My grandmother is sick.', 'está', 'condition'),
      item('¿Cómo ___ tú?', 'How are you?', 'estás', 'condition'),
      item('Mis amigos ___ contentos.', 'My friends are happy.', 'están', 'emotion'),
      item('Ella ___ nerviosa por el examen.', "She's nervous about the test.", 'está', 'emotion'),
      item('Nosotros ___ estudiando para el examen.', "We're studying for the test.", 'estamos', 'progressive'),
      item('La ventana ___ abierta.', 'The window is open.', 'está', 'result'),
    ],
  },
  {
    id: 'events',
    name: 'Events vs. location',
    emoji: '📍',
    level: 2,
    description: 'Things and people are somewhere with estar — but events take place with ser.',
    items: [
      item('La fiesta ___ en mi casa.', 'The party is at my house.', 'es', 'event'),
      item('Mi casa ___ en la calle Juárez.', 'My house is on Juárez Street.', 'está', 'location'),
      item('El concierto ___ en el estadio.', 'The concert is at the stadium.', 'es', 'event'),
      item('El estadio ___ cerca del centro.', 'The stadium is near downtown.', 'está', 'location'),
      item('¿Dónde ___ la boda?', 'Where is the wedding?', 'es', 'event'),
      item('¿Dónde ___ los novios?', 'Where are the bride and groom?', 'están', 'location'),
      item('La reunión ___ a las cinco en la oficina.', 'The meeting is at five in the office.', 'es', 'event'),
      item('La oficina ___ en el segundo piso.', 'The office is on the second floor.', 'está', 'location'),
      item('El examen ___ en el salón 12.', 'The test is in room 12.', 'es', 'event'),
      item('Los estudiantes ___ en el salón 12.', 'The students are in room 12.', 'están', 'location'),
      item('La clase de yoga ___ en el parque los sábados.', 'Yoga class is in the park on Saturdays.', 'es', 'event'),
      item('Guadalajara ___ en Jalisco.', 'Guadalajara is in Jalisco.', 'está', 'location', 'Cities and countries are places, so they use estar.'),
      item('El partido ___ mañana en Monterrey.', 'The game is tomorrow in Monterrey.', 'es', 'event'),
      item('¿Dónde ___ el baño?', 'Where is the bathroom?', 'está', 'location'),
      item('La graduación ___ en el auditorio.', 'The graduation is in the auditorium.', 'es', 'event'),
      item('El auditorio ___ al lado de la biblioteca.', 'The auditorium is next to the library.', 'está', 'location'),
    ],
  },
  {
    id: 'meaning',
    name: 'Adjectives that change meaning',
    emoji: '🎭',
    level: 2,
    description: 'Listo, aburrido, rico, malo, verde, vivo, seguro… mean different things with ser and estar. The second half of each sentence tells you which.',
    // Every sentence has two parts: the blank, then a clue showing whether the
    // adjective is a trait (ser) or a state (estar).
    items: [
      meaningPair('ser listo = clever · estar listo = ready',
        ['Mi prima ___ muy lista; siempre saca diez en matemáticas.', 'My cousin is very clever; she always gets top marks in math.', 'es'],
        ['Los niños ya ___ listos; tienen los zapatos puestos y la mochila en la mano.', 'The kids are ready now; they have their shoes on and their backpacks in hand.', 'están']),
      meaningPair('ser aburrido = boring · estar aburrido = bored',
        ['Esta película ___ muy aburrida; nunca pasa nada interesante.', 'This movie is really boring; nothing interesting ever happens.', 'es'],
        ['Yo ___ muy aburrido; no hay nada que hacer en esta casa.', "I'm really bored; there's nothing to do in this house.", 'estoy']),
      meaningPair('ser rico = rich · estar rico = delicious',
        ['Ese señor ___ muy rico; tiene tres casas y un yate.', 'That man is very rich; he has three houses and a yacht.', 'es'],
        ['Los tacos ___ muy ricos; ¿me das otro?', 'The tacos are delicious; can I have another one?', 'están']),
      meaningPair('ser verde = green (color) · estar verde = unripe, or inexperienced',
        ['Mi carro ___ verde, del mismo color que la bandera.', 'My car is green, the same color as the flag.', 'es'],
        ['Los plátanos todavía ___ verdes; hay que esperar unos días para comerlos.', 'The bananas are still unripe; we have to wait a few days to eat them.', 'están']),
      meaningPair('ser malo = bad, mean · estar malo = sick (or spoiled)',
        ['Ese perro ___ malo; muerde a todos los que pasan.', 'That dog is mean; it bites everyone who walks by.', 'es'],
        ['Mi abuelo ___ malo; tiene gripa y no se levanta de la cama.', "My grandfather is sick; he has the flu and won't get out of bed.", 'está']),
      meaningPair('ser bueno = good, kind · estar bueno = tastes good (and, colloquially, attractive)',
        ['Mi maestra ___ muy buena; siempre nos ayuda cuando no entendemos.', "My teacher is very good; she always helps us when we don't understand.", 'es'],
        ['Este pastel ___ buenísimo; sabe a chocolate y canela.', 'This cake tastes amazing; it tastes like chocolate and cinnamon.', 'está']),
      meaningPair('ser vivo = sharp, quick-witted · estar vivo = alive',
        ['Ese niño ___ muy vivo; nadie lo puede engañar.', 'That kid is very sharp; nobody can fool him.', 'es'],
        ['El pez todavía ___ vivo; se está moviendo en la bolsa.', "The fish is still alive; it's moving in the bag.", 'está']),
      meaningPair('ser seguro = safe · estar seguro = sure',
        ['Este barrio ___ muy seguro; casi nunca hay robos.', 'This neighborhood is very safe; there are hardly ever any robberies.', 'es'],
        ['Mi papá ___ seguro de que va a llover; vio el pronóstico esta mañana.', "My dad is sure it's going to rain; he saw the forecast this morning.", 'está']),
      meaningPair('ser callado = a quiet person · estar callado = silent right now',
        ['Mi hermano ___ muy callado; casi nunca habla con nadie.', 'My brother is very quiet; he hardly ever talks to anyone.', 'es'],
        ['Hoy ___ muy callada; ¿te pasa algo?', "You're very quiet today; is something wrong?", 'estás']),
      meaningPair('ser orgulloso = arrogant, proud (trait) · estar orgulloso de = proud of',
        ['Él ___ muy orgulloso; nunca pide perdón.', "He's very proud; he never apologizes.", 'es'],
        ['Ella ___ muy orgullosa de su hijo; hoy se graduó de la universidad.', "She's very proud of her son; he graduated from college today.", 'está']),
      meaningPair('ser despierto = bright, alert · estar despierto = awake',
        ['Mi hija ___ muy despierta; aprende todo rapidísimo.', 'My daughter is very bright; she learns everything really fast.', 'es'],
        ['¿Todavía ___ despierta? Ya son las dos de la mañana.', "Are you still awake? It's already two in the morning.", 'estás']),
      meaningPair('ser cansado = tiring · estar cansado = tired',
        ['Este trabajo ___ muy cansado; cargo cajas todo el día.', 'This job is really tiring; I carry boxes all day.', 'es'],
        ['Yo ___ muy cansado; anoche dormí solo tres horas.', 'I’m really tired; I only slept three hours last night.', 'estoy']),
      meaningPair('ser atento = thoughtful, courteous · estar atento = paying attention',
        ['Mi vecino ___ muy atento; siempre me trae algo cuando estoy enfermo.', "My neighbor is very thoughtful; he always brings me something when I'm sick.", 'es'],
        ['Hoy los alumnos ___ muy atentos; mañana es el examen.', 'Today the students are paying close attention; the test is tomorrow.', 'están']),
      meaningPair('ser interesado = self-serving · estar interesado = interested',
        ['Mi primo ___ muy interesado; solo te llama cuando necesita dinero.', 'My cousin is very self-serving; he only calls you when he needs money.', 'es'],
        ['Mi primo ___ muy interesado en el puesto; ya mandó su currículum.', "My cousin is very interested in the job; he's already sent his résumé.", 'está']),
    ].flat(),
  },
  {
    id: 'tricky',
    name: 'Tricky cases',
    emoji: '🧩',
    level: 3,
    description: 'Death, marital status, dates, prices, estar de, passive voice, set expressions…',
    items: [
      item('Mi bisabuelo ya ___ muerto.', 'My great-grandfather is dead.', 'está', 'death'),
      item('Mi tía ___ casada con un ingeniero.', 'My aunt is married to an engineer.', ['está', 'es'], 'result', 'Estar casado is the most common. In Mexico, es casado / es soltero is also heard, describing someone’s status.'),
      item('Mi primo ___ soltero.', 'My cousin is single.', ['es', 'está'], 'description', 'Both are used. Ser soltero states his status; estar soltero suggests his current situation.'),
      item('¿Qué hora ___?', 'What time is it?', 'es', 'time'),
      item('___ la una.', "It's one o'clock.", 'es', 'time', 'Es la una (singular) — every other hour is son las…'),
      item('Ya ___ tarde; vámonos.', "It's late already; let's go.", 'es', 'time'),
      item('___ a 15 de septiembre.', "It's September 15th.", 'estamos', 'dateEstar', 'You can also say Hoy es 15 de septiembre (ser).'),
      item('___ en otoño.', "It's fall.", 'estamos', 'dateEstar'),
      item('¿A cuánto ___ el kilo de tomate?', 'How much is a kilo of tomatoes (today)?', 'está', 'price'),
      item('¿Cuánto ___ todo?', 'How much is everything?', 'es', 'total'),
      item('Mi hermano ___ de mesero este verano.', 'My brother is working as a waiter this summer.', 'está', 'temporaryRole', 'Compare: Mi hermano es mesero (that’s his job).'),
      item('Nosotros ___ de vacaciones en Cancún.', "We're on vacation in Cancún.", 'estamos', 'temporaryRole'),
      item('El puente ___ construido en 1950.', 'The bridge was built in 1950.', 'fue', 'passive', 'An action that happened (someone built it) → ser. Compare: el puente está cerrado (its state).'),
      item('El puente ___ cerrado por obras.', 'The bridge is closed for construction.', 'está', 'result'),
      item('___ importante llegar a tiempo.', "It's important to arrive on time.", 'es', 'impersonal'),
      item('___ bien, no te preocupes.', "It's fine, don't worry.", 'está', 'expression'),
      item('Mi papá ___ de acuerdo contigo.', 'My dad agrees with you.', 'está', 'expression'),
      item('El camión ___ por salir.', 'The bus is about to leave.', 'está', 'expression', 'Estar por + infinitive = to be about to (like estar a punto de).'),
      item('Este regalo ___ para ti.', 'This gift is for you.', 'es', 'purpose'),
      item('¡Qué alto ___! Ya me pasaste.', "You've gotten so tall! You're taller than me now.", 'estás', 'appearance', 'Estar points out a change you notice. Eres alto would just describe you.'),
      item('Mi abuela ___ muy joven para su edad.', 'My grandmother looks very young for her age.', 'está', 'appearance'),
      item('La sopa ___ muy salada.', 'The soup is (tastes) very salty.', 'está', 'appearance'),
      item('Hoy ___ nublado.', "It's cloudy today.", 'está', 'weather', 'Most weather uses hacer (hace calor) — but the sky is nublado / despejado with estar.'),
    ],
  },
  {
    id: 'past',
    name: 'In the past',
    emoji: '⏳',
    level: 3,
    description: 'Fue or era? Estuve or estaba? Same rules, plus preterite vs. imperfect.',
    items: [
      item('Cuando ___ niño, vivía en Puebla.', 'When I was a child, I lived in Puebla.', 'era', 'identity', 'Imperfect: background description in the past.'),
      item('Mi abuelo ___ muy alto y tenía ojos verdes.', 'My grandfather was very tall and had green eyes.', 'era', 'description'),
      item('Mi bisabuelo ___ de Zacatecas.', 'My great-grandfather was from Zacatecas.', 'era', 'origin'),
      item('Mi abuela ___ maestra por treinta años.', 'My grandmother was a teacher for thirty years.', 'fue', 'occupation', 'Preterite: a finished period (por treinta años).'),
      item('___ las diez cuando llegamos.', 'It was ten o’clock when we arrived.', 'eran', 'time', 'Time in the past always uses the imperfect: era la una, eran las diez.'),
      item('El concierto ___ en el Auditorio Nacional.', 'The concert was at the Auditorio Nacional.', 'fue', 'event'),
      item('La novela ___ escrita por Juan Rulfo.', 'The novel was written by Juan Rulfo.', 'fue', 'passive'),
      item('La fiesta ___ increíble.', 'The party was amazing.', ['fue', 'estuvo'], 'event', 'Both work. Fue increíble is standard; in Mexico estuvo increíble (estuvo padrísima) is very common.'),
      item('El examen ___ muy difícil.', 'The test was very hard.', ['fue', 'estuvo'], 'description', 'Both work. Estuvo difícil is very common in Mexico.'),
      item('Ayer ___ enfermo todo el día.', 'Yesterday I was sick all day.', 'estuve', 'condition', 'Preterite: a finished period (todo el día).'),
      item('Ella ___ muy nerviosa antes del examen.', 'She was very nervous before the test.', 'estaba', 'emotion'),
      item('La casa ___ muy limpia cuando llegué.', 'The house was very clean when I arrived.', 'estaba', 'result'),
      item('Mis papás ___ en México la semana pasada.', 'My parents were in Mexico last week.', ['estuvieron', 'estaban'], 'location'),
      item('¿Dónde ___ anoche? Te llamé.', 'Where were you last night? I called you.', ['estabas', 'estuviste'], 'location'),
      item('Nosotros ___ estudiando cuando se fue la luz.', 'We were studying when the power went out.', 'estábamos', 'progressive', 'Imperfect: the action in progress when something else happened.'),
    ],
  },
];

/** A random mix of items from every exercise. */
export function mixedExercise(size = 25) {
  return {
    id: 'mixed',
    name: 'Mix of everything',
    emoji: '🎲',
    items: shuffle(SER_ESTAR_EXERCISES.flatMap((ex) => ex.items)).slice(0, size),
  };
}

// ---- Answer checking

const formsOf = (inf) => {
  const conj = conjugate(inf, false);
  return new Set([inf, ...Object.values(conj.tenses).flat()].map(normalize));
};
const FORMS = { ser: formsOf('ser'), estar: formsOf('estar') };

/**
 * Check a typed answer (see matchAnswer for the result and `strictAccents`).
 * A leading subject pronoun is ignored. Also sets rightVerb: wrong, but a
 * form of the right verb.
 */
export function checkSerEstar(item, typed, { strictAccents }) {
  const words = normalize(typed).split(' ');
  const given = words.length > 1 ? words.slice(1).join(' ') : words[0];
  const result = matchAnswer([normalize(typed), given], item.answers, { strictAccents });
  if (result.correct || result.accentMiss) return result;
  const forms = FORMS[USES[item.use].verb];
  return { ...result, rightVerb: [...forms].some((f) => loosen(f) === loosen(given)) };
}

/** The sentence with the blank filled in, split for highlighting: [before, answer, after]. */
export function fillBlank(item) {
  const [before, after] = item.es.split('___');
  const answer = item.answers[0];
  const startsSentence = /^[¡¿]?$/.test(before);
  return [before, startsSentence ? answer.charAt(0).toUpperCase() + answer.slice(1) : answer, after];
}
