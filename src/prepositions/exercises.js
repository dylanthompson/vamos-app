// Fill-in-the-blank preposition exercises (Mexican Spanish).
// Each item: { es: sentence with "___", en: translation, answers: [accepted…], why? }
// The first answer is the one shown as correct. NONE means nothing goes in the
// blank (only in exercises with `allowNone`).
export const NONE = '–';

export const PREPOSITION_EXERCISES = [
  {
    id: 'place',
    name: 'Prepositions of place',
    emoji: '📍',
    level: 1,
    description: 'Where is it? Under, next to, across from, between…',
    items: [
      { es: 'El gato está ___ la mesa.', en: 'The cat is under the table.', answers: ['debajo de', 'abajo de'] },
      { es: 'Mis llaves están ___ la mesa.', en: 'My keys are on the table.', answers: ['sobre', 'en', 'encima de', 'arriba de'] },
      { es: 'La farmacia está ___ el banco.', en: 'The pharmacy is next to the bank.', answers: ['al lado de', 'junto a'] },
      { es: 'Vivo ___ la escuela, así que camino.', en: 'I live close to school, so I walk.', answers: ['cerca de'] },
      { es: 'El aeropuerto está ___ la ciudad.', en: 'The airport is far from the city.', answers: ['lejos de'] },
      { es: 'El carro está ___ la casa.', en: 'The car is in front of the house.', answers: ['enfrente de', 'delante de', 'frente a'] },
      { es: 'El jardín está ___ la casa.', en: 'The garden is behind the house.', answers: ['detrás de', 'atrás de'] },
      { es: 'El parque está ___ la iglesia.', en: 'The park is across from the church.', answers: ['enfrente de', 'frente a'] },
      { es: 'El baño está ___ las dos recámaras.', en: 'The bathroom is between the two bedrooms.', answers: ['entre'] },
      { es: 'La leche está ___ el refri.', en: 'The milk is inside the fridge.', answers: ['dentro de', 'en', 'adentro de'] },
      { es: 'Los niños juegan ___ la casa.', en: 'The kids play outside the house.', answers: ['fuera de', 'afuera de'] },
      { es: 'La tienda está ___ del cine.', en: 'The store is to the right of the movie theater.', answers: ['a la derecha'] },
      { es: 'El hospital está ___ la estación.', en: 'The hospital is to the left of the station.', answers: ['a la izquierda de'] },
      { es: 'Hay árboles ___ la laguna.', en: 'There are trees around the lagoon.', answers: ['alrededor de'] },
      { es: 'Hoy estoy ___ casa.', en: "Today I'm at home.", answers: ['en'] },
      { es: 'El cuaderno está ___ la mochila.', en: 'The notebook is in the backpack.', answers: ['en', 'dentro de', 'adentro de'] },
      { es: 'La lámpara está ___ la cama.', en: 'The lamp is above the bed.', answers: ['encima de', 'arriba de', 'sobre'] },
      { es: 'El perro duerme ___ la puerta.', en: 'The dog sleeps next to the door.', answers: ['junto a', 'al lado de'] },
      { es: 'Somos ___ Guadalajara.', en: "We're from Guadalajara.", answers: ['de'] },
      { es: 'La escuela está ___ el parque y el mercado.', en: 'The school is between the park and the market.', answers: ['entre'] },
    ],
  },
  {
    id: 'personal-a',
    name: 'Personal a, al & del',
    emoji: '👤',
    level: 1,
    allowNone: true,
    description: 'Use a before a person; a + el = al, de + el = del. Sometimes nothing goes in the blank.',
    items: [
      { es: 'Veo ___ mi abuela los domingos.', en: 'I see my grandmother on Sundays.', answers: ['a'], why: 'Personal a: the object is a person.' },
      { es: 'Llamo ___ mis amigos.', en: 'I call my friends.', answers: ['a'], why: 'Personal a: the object is a person.' },
      { es: 'Busco ___ mi perro.', en: "I'm looking for my dog.", answers: ['a'], why: 'Personal a is also used with pets.' },
      { es: 'Conozco ___ tu hermano.', en: 'I know your brother.', answers: ['a'], why: 'Personal a: the object is a person.' },
      { es: 'Quiero mucho ___ mi mamá.', en: 'I love my mom a lot.', answers: ['a'], why: 'Personal a: the object is a person.' },
      { es: 'Escucho ___ la maestra.', en: 'I listen to the teacher.', answers: ['a'], why: 'Personal a: the object is a person.' },
      { es: 'Invité ___ Ana a la fiesta.', en: 'I invited Ana to the party.', answers: ['a'], why: 'Personal a: the object is a person.' },
      { es: 'Espero ___ mi hermano.', en: "I'm waiting for my brother.", answers: ['a'], why: 'Personal a: the object is a person.' },
      { es: 'Veo ___ la televisión.', en: 'I watch TV.', answers: [NONE], why: 'No personal a: television is a thing, not a person.' },
      { es: 'Escucho ___ música.', en: 'I listen to music.', answers: [NONE], why: 'No personal a: music is a thing. (Escuchar already means "listen to".)' },
      { es: 'Tengo ___ dos hermanos.', en: 'I have two brothers.', answers: [NONE], why: 'Tener normally does not take the personal a.' },
      { es: 'Visitamos ___ Monterrey.', en: 'We visited Monterrey.', answers: [NONE], why: 'No personal a with places.' },
      { es: 'Vamos ___ parque.', en: "We're going to the park.", answers: ['al'], why: 'a + el = al.' },
      { es: 'Le di el libro ___ maestro.', en: 'I gave the book to the teacher.', answers: ['al'], why: 'a + el = al.' },
      { es: 'Llegamos ___ aeropuerto a tiempo.', en: 'We got to the airport on time.', answers: ['al'], why: 'a + el = al.' },
      { es: 'Vengo ___ mercado.', en: "I'm coming from the market.", answers: ['del'], why: 'de + el = del.' },
      { es: 'Es la casa ___ profesor.', en: "It's the teacher's house.", answers: ['del'], why: 'de + el = del (possession).' },
      { es: 'Salimos ___ cine a las diez.', en: 'We left the movie theater at ten.', answers: ['del'], why: 'de + el = del.' },
      { es: 'El carro ___ señor García es nuevo.', en: "Mr. García's car is new.", answers: ['del'], why: 'de + el = del (possession).' },
      { es: 'Vamos ___ la playa.', en: "We're going to the beach.", answers: ['a'], why: 'Only a + el contracts. a + la stays a la.' },
    ],
  },
  {
    id: 'common',
    name: 'Common prepositions',
    emoji: '🧭',
    level: 2,
    description: 'With, without, during, until, according to, despite…',
    items: [
      { es: 'Voy a la escuela ___ mi hermana.', en: 'I go to school with my sister.', answers: ['con'] },
      { es: 'Tomo café ___ azúcar.', en: 'I drink coffee without sugar.', answers: ['sin'] },
      { es: 'La clase empieza ___ las ocho.', en: 'Class starts at eight.', answers: ['a'] },
      { es: 'Trabajé ___ las seis de la tarde.', en: 'I worked until six in the evening.', answers: ['hasta'] },
      { es: 'Vivo en Puebla ___ 2019.', en: "I've lived in Puebla since 2019.", answers: ['desde'] },
      { es: 'Llovió ___ la película.', en: 'It rained during the movie.', answers: ['durante'] },
      { es: 'Me lavo las manos ___ comer.', en: 'I wash my hands before eating.', answers: ['antes de'] },
      { es: 'Hacemos la tarea ___ cenar.', en: 'We do homework after dinner.', answers: ['después de'] },
      { es: 'Caminamos ___ el centro.', en: 'We walked toward downtown.', answers: ['hacia', 'para'] },
      { es: 'Hablamos ___ la película.', en: 'We talked about the movie.', answers: ['de', 'sobre', 'acerca de'] },
      { es: '___ el maestro, el examen es fácil.', en: 'According to the teacher, the test is easy.', answers: ['según'] },
      { es: 'Todos vinieron ___ Juan.', en: 'Everyone came except Juan.', answers: ['menos', 'excepto', 'salvo'] },
      { es: 'Juegan ___ el equipo de Monterrey.', en: "They're playing against the Monterrey team.", answers: ['contra'] },
      { es: 'Tomo agua ___ refresco.', en: 'I drink water instead of soda.', answers: ['en vez de', 'en lugar de'] },
      { es: 'Salimos ___ la lluvia.', en: 'We went out despite the rain.', answers: ['a pesar de'] },
      { es: 'Pasamos ___ el parque.', en: 'We went through the park.', answers: ['por', 'a través de'] },
      { es: 'Llegamos ___ tiempo.', en: 'We arrived on time.', answers: ['a'] },
      { es: 'Es un regalo ___ mi abuela.', en: "It's a gift from my grandmother.", answers: ['de'] },
      { es: 'Viajamos ___ autobús.', en: 'We traveled by bus.', answers: ['en'] },
      { es: '___ estudiar, también trabajo.', en: 'Besides studying, I also work.', answers: ['además de'] },
    ],
  },
  {
    id: 'por-para',
    name: 'Por vs. para',
    emoji: '⚖️',
    level: 2,
    description: 'Two words for "for" — and why each one is used.',
    items: [
      { es: 'Este regalo es ___ ti.', en: 'This gift is for you.', answers: ['para'], why: 'Para: the recipient.' },
      { es: 'Gracias ___ la ayuda.', en: 'Thanks for the help.', answers: ['por'], why: 'Por: the reason (gracias por…).' },
      { es: 'Estudio ___ ser doctora.', en: 'I study (in order) to be a doctor.', answers: ['para'], why: 'Para: purpose — "in order to".' },
      { es: 'Caminamos ___ el parque.', en: 'We walked through the park.', answers: ['por'], why: 'Por: movement through or along a place.' },
      { es: 'Mañana salgo ___ Monterrey.', en: "Tomorrow I'm leaving for Monterrey.", answers: ['para'], why: 'Para: destination.' },
      { es: 'Pagué doscientos pesos ___ la camisa.', en: 'I paid two hundred pesos for the shirt.', answers: ['por'], why: 'Por: exchange or price.' },
      { es: 'La tarea es ___ el lunes.', en: 'The homework is due Monday.', answers: ['para'], why: 'Para: deadline.' },
      { es: 'Hablo con mi abuela ___ teléfono.', en: 'I talk to my grandmother on the phone.', answers: ['por'], why: 'Por: means of communication.' },
      { es: 'Estuvimos en Oaxaca ___ dos semanas.', en: 'We were in Oaxaca for two weeks.', answers: ['por', 'durante'], why: 'Por: duration of time.' },
      { es: '___ mí, el español es fácil.', en: 'For me (in my opinion), Spanish is easy.', answers: ['para'], why: 'Para: opinion — "para mí".' },
      { es: 'Voy a la tienda ___ tortillas.', en: "I'm going to the store for (to get) tortillas.", answers: ['por'], why: 'Por: going to get or pick something up.' },
      { es: 'Mi papá trabaja ___ una empresa grande.', en: 'My dad works for a big company.', answers: ['para'], why: 'Para: the employer.' },
      { es: 'Lo hice ___ ti.', en: 'I did it because of you / on your behalf.', answers: ['por'], why: 'Por: cause, or on behalf of someone.' },
      { es: 'Llámame ___ la mañana.', en: 'Call me in the morning.', answers: ['por', 'en'], why: 'Por: part of the day. "En la mañana" is also very common in Mexico.' },
      { es: '___ ser niño, habla muy bien inglés.', en: 'For a kid, he speaks English very well.', answers: ['para'], why: 'Para: comparison against what is expected.' },
      { es: 'El tren pasa ___ Querétaro.', en: 'The train goes through Querétaro.', answers: ['por'], why: 'Por: through a place.' },
      { es: 'Necesito el reporte ___ mañana.', en: 'I need the report by tomorrow.', answers: ['para'], why: 'Para: deadline.' },
      { es: 'Cambié mi bici ___ una patineta.', en: 'I traded my bike for a skateboard.', answers: ['por'], why: 'Por: exchange.' },
      { es: 'Esta taza es ___ café.', en: 'This mug is for coffee.', answers: ['para'], why: 'Para: what something is used for.' },
      { es: '¡___ fin terminamos!', en: 'We finally finished!', answers: ['por'], why: 'Por: set phrase — "por fin" (finally).' },
    ],
  },
  {
    id: 'verbs',
    name: 'Verbs + preposition',
    emoji: '🔗',
    level: 3,
    description: 'Verbs that need a specific preposition: soñar con, depender de, acabar de…',
    items: [
      { es: 'Sueño ___ viajar a Japón.', en: 'I dream of traveling to Japan.', answers: ['con'], why: 'soñar con' },
      { es: 'Siempre pienso ___ mi familia.', en: 'I always think about my family.', answers: ['en'], why: 'pensar en (to think about)' },
      { es: 'Todo depende ___ ti.', en: 'Everything depends on you.', answers: ['de'], why: 'depender de' },
      { es: 'Acabo ___ llegar.', en: 'I just arrived.', answers: ['de'], why: 'acabar de + infinitive = to have just done' },
      { es: 'Mi tío dejó ___ fumar.', en: 'My uncle quit smoking.', answers: ['de'], why: 'dejar de + infinitive = to stop doing' },
      { es: 'Aprendí ___ manejar el año pasado.', en: 'I learned to drive last year.', answers: ['a'], why: 'aprender a' },
      { es: 'Empecé ___ estudiar a las siete.', en: 'I started studying at seven.', answers: ['a'], why: 'empezar a' },
      { es: 'Me ayudó ___ cocinar.', en: 'She helped me cook.', answers: ['a'], why: 'ayudar a' },
      { es: 'Trato ___ hablar más español.', en: 'I try to speak more Spanish.', answers: ['de'], why: 'tratar de + infinitive = to try to' },
      { es: 'Mi abuelo insiste ___ pagar.', en: 'My grandfather insists on paying.', answers: ['en'], why: 'insistir en' },
      { es: 'Puedes contar ___ nosotros.', en: 'You can count on us.', answers: ['con'], why: 'contar con' },
      { es: 'Mi prima se casó ___ su novio.', en: 'My cousin married her boyfriend.', answers: ['con'], why: 'casarse con' },
      { es: 'Me enamoré ___ ella.', en: 'I fell in love with her.', answers: ['de'], why: 'enamorarse de' },
      { es: 'Quedamos ___ vernos a las cinco.', en: 'We agreed to meet at five.', answers: ['en'], why: 'quedar en = to agree to' },
      { es: 'Fíjate ___ los detalles.', en: 'Pay attention to the details.', answers: ['en'], why: 'fijarse en' },
      { es: 'Tardó mucho ___ contestar.', en: 'He took a long time to answer.', answers: ['en'], why: 'tardar en' },
      { es: 'El pueblo se convirtió ___ una ciudad.', en: 'The town turned into a city.', answers: ['en'], why: 'convertirse en' },
      { es: 'Se me olvidó la cita. Siempre me olvido ___ todo.', en: 'I forgot the appointment. I always forget everything.', answers: ['de'], why: 'olvidarse de' },
      { es: 'Mi mamá se preocupa ___ mí.', en: 'My mom worries about me.', answers: ['por'], why: 'preocuparse por' },
      { es: 'El examen consiste ___ tres partes.', en: 'The test consists of three parts.', answers: ['en'], why: 'consistir en' },
      { es: 'Confía ___ mí.', en: 'Trust me.', answers: ['en'], why: 'confiar en' },
      { es: 'Se despidió ___ sus amigos.', en: 'She said goodbye to her friends.', answers: ['de'], why: 'despedirse de' },
    ],
  },
];

// ---- Answer checking

const normalize = (s) => s.toLowerCase().replace(/[¡!¿?.,;:]/g, '').replace(/\s+/g, ' ').trim();
const loosen = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const NONE_TYPED = ['–', '-', '—', 'nada', 'x', '0', 'ninguna', 'ninguno'];

/** Returns { correct, accentSlip } for a typed answer. */
export function checkPreposition(item, typed) {
  let given = normalize(typed);
  if (NONE_TYPED.includes(given)) given = NONE;
  const accepted = item.answers.map(normalize);
  if (accepted.includes(given)) return { correct: true, accentSlip: false };
  if (accepted.map(loosen).includes(loosen(given))) return { correct: true, accentSlip: true };
  return { correct: false, accentSlip: false };
}

/** The sentence with the blank filled in, split for highlighting: [before, answer, after]. */
export function fillBlank(item) {
  const [before, after] = item.es.split('___');
  const answer = item.answers[0];
  if (answer === NONE) return [before.trimEnd(), '', after.startsWith(' ') ? after : ' ' + after];
  const startsSentence = /^[¡¿]?$/.test(before);
  const filled = startsSentence ? answer.charAt(0).toUpperCase() + answer.slice(1) : answer;
  return [before, filled, after];
}
