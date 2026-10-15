/* Secuencia, meditaciones, letanías y navegación del Rosario.
   Se carga después de app.js y antes de focus.js / immersive.js. */
(() => {
  'use strict';

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayGroups = ['Gloriosos', 'Gozosos', 'Dolorosos', 'Gloriosos', 'Luminosos', 'Dolorosos', 'Gozosos'];
  const dateKey = () => {
    const d = new Date();
    return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
  };
  // Denominaciones y distribución semanal del devocionario de Opus Dei.
  const mysteryNames = {
    Gozosos: [
      'La Encarnación', 'La Visitación de Nuestra Señora a su prima Santa Isabel',
      'El Nacimiento del Hijo de Dios en Belén', 'La Purificación de Nuestra Señora',
      'El Niño perdido y hallado en el Templo'
    ],
    Dolorosos: [
      'La oración en el huerto', 'La flagelación del Señor',
      'La coronación de espinas', 'La Cruz a cuestas', 'Jesús muere en la Cruz'
    ],
    Gloriosos: [
      'La Resurrección del Señor', 'La Ascensión del Señor',
      'La venida del Espíritu Santo', 'La Asunción de Nuestra Señora',
      'La Coronación de María Santísima'
    ],
    Luminosos: [
      'El Bautismo del Señor', 'Las bodas de Caná', 'El anuncio del Reino de Dios',
      'La Transfiguración del Señor', 'La institución de la Eucaristía'
    ]
  };
  const meditations = {
    Gozosos: [
      'María acoge con fe el anuncio del ángel y se pone enteramente en las manos de Dios. Contemplemos su disponibilidad y pidamos un corazón abierto a su voluntad.',
      'María sale al encuentro de Isabel para compartir su alegría y servirla. Pidamos aprender a reconocer las necesidades de los demás y acudir con amor.',
      'El Hijo de Dios nace en la humildad de Belén. Contemplemos a Jesús, cercano a los pequeños, y pidamos sencillez y gratitud.',
      'María y José presentan a Jesús en el templo y escuchan las palabras de Simeón. Pidamos ofrecer nuestra vida a Dios con confianza.',
      'María y José buscan con angustia a Jesús y lo encuentran en el templo. Pidamos perseverancia para buscarlo y escuchar su palabra.'
    ],
    Luminosos: [
      'Jesús recibe el bautismo en el Jordán y el Padre manifiesta su amor por él. Recordemos nuestro bautismo y renovemos el deseo de vivir como hijos de Dios.',
      'En Caná, María confía en Jesús e invita a hacer lo que él diga. Pidamos escuchar sus palabras y confiar en él incluso cuando no comprendamos todo.',
      'Jesús anuncia la cercanía del Reino e invita a la conversión. Pidamos un corazón dispuesto a cambiar y a acoger la misericordia de Dios.',
      'En el monte, Jesús manifiesta su gloria ante sus discípulos. Pidamos aprender a escuchar al Hijo amado, también en los días difíciles.',
      'Jesús se entrega a los suyos en la Eucaristía. Demos gracias por su presencia y pidamos aprender a amar y servir como él.'
    ],
    Dolorosos: [
      'En Getsemaní, Jesús ora en medio de su angustia y confía en el Padre. Pidamos fortaleza para afrontar nuestras pruebas sin dejar la oración.',
      'Jesús acepta el sufrimiento de la flagelación. Contemplemos su entrega y pidamos un corazón compasivo ante el dolor ajeno.',
      'Jesús soporta las burlas y la corona de espinas. Pidamos humildad y valentía para defender la dignidad de cada persona.',
      'Jesús camina hacia el Calvario cargando la cruz. Pidamos fuerza para llevar nuestras dificultades con esperanza y acompañar a quien sufre.',
      'Jesús entrega su vida en la cruz y perdona a quienes lo hieren. Pidamos aprender a perdonar y a confiar en el amor que vence al pecado.'
    ],
    Gloriosos: [
      'Jesús resucita y abre para nosotros un camino de vida nueva. Pidamos una fe viva y esperanza aun en medio de la oscuridad.',
      'Jesús asciende al Padre y encomienda a sus discípulos la misión de anunciar el Evangelio. Pidamos fidelidad y valentía para dar testimonio.',
      'El Espíritu Santo desciende sobre los discípulos reunidos en oración. Pidamos sus dones para vivir unidos y compartir la fe con alegría.',
      'Contemplamos a María acogida en la gloria del cielo. Pidamos caminar con esperanza hacia la vida plena que Dios promete.',
      'María es coronada Reina del cielo y de la tierra. Pidamos su intercesión y que nuestra vida refleje la humildad y la alegría del Evangelio.'
    ]
  };
  Object.keys(mysteryNames).forEach(group => { groups[group] = mysteryNames[group]; });

  prayers.Jaculatoria = 'María, Madre de gracia, Madre de misericordia, en la vida y en la muerte ampáranos, gran Señora.';
  prayers['Alabanzas al Santísimo'] =
    'Alabanzas y gracias sean dadas en todo momento al Santísimo y Divinísimo Sacramento del Altar.\n\n' +
    'Y bendita sea por siempre la Santa e Inmaculada Concepción de la Bienaventurada siempre Virgen María, Madre de Dios y Madre nuestra.';
  prayers.Salve =
    'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. ' +
    'A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando en este valle de lágrimas. ' +
    'Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; ' +
    'y después de este destierro, muéstranos a Jesús, fruto bendito de tu vientre. ' +
    '¡Oh clementísima, oh piadosa, oh dulce siempre Virgen María!';
  prayers['Ruega por nosotros'] =
    'Ruega por nosotros, Santa Madre de Dios.\n\nPara que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.';
  prayers['Bajo tu amparo'] =
    'Bajo tu amparo nos acogemos, Santa Madre de Dios: no desprecies las súplicas que te dirigimos en nuestras necesidades; ' +
    'antes bien, líbranos siempre de todos los peligros, Virgen gloriosa y bendita.';
  prayers['Oración final'] =
    'Te suplicamos, Señor, que derrames tu gracia en nuestras almas, para que aquellos que, por el anuncio del ángel, ' +
    'han conocido la Encarnación de tu Hijo Jesucristo, por su pasión y cruz, sean llevados a la gloria de su resurrección. ' +
    'Por Jesucristo nuestro Señor. Amén.';

  const litanyOpening = [
    'Señor, ten piedad.',
    'Cristo, ten piedad.',
    'Señor, ten piedad.',
    'Cristo, óyenos.',
    'Cristo, escúchanos.',
    'Dios, Padre celestial, ten piedad de nosotros.',
    'Dios Hijo, Redentor del mundo, ten piedad de nosotros.',
    'Dios Espíritu Santo, ten piedad de nosotros.',
    'Santísima Trinidad, un solo Dios, ten piedad de nosotros.'
  ];
  const litanyInvocations = [
    'Santa María', 'Santa Madre de Dios', 'Santa Virgen de las vírgenes',
    'Madre de Cristo', 'Madre de la Iglesia', 'Madre de la misericordia',
    'Madre de la divina gracia', 'Madre de la esperanza', 'Madre purísima',
    'Madre castísima', 'Madre siempre virgen', 'Madre inmaculada',
    'Madre amable', 'Madre admirable', 'Madre del buen consejo',
    'Madre del Creador', 'Madre del Salvador', 'Virgen prudentísima',
    'Virgen digna de veneración', 'Virgen digna de alabanza',
    'Virgen poderosa', 'Virgen clemente', 'Virgen fiel', 'Espejo de justicia',
    'Trono de la sabiduría', 'Causa de nuestra alegría', 'Vaso espiritual',
    'Vaso digno de honor', 'Vaso de insigne devoción', 'Rosa mística',
    'Torre de David', 'Torre de marfil', 'Casa de oro', 'Arca de la Alianza',
    'Puerta del cielo', 'Estrella de la mañana', 'Salud de los enfermos',
    'Refugio de los pecadores', 'Consuelo de los migrantes',
    'Consoladora de los afligidos', 'Auxilio de los cristianos',
    'Reina de los Ángeles', 'Reina de los Patriarcas', 'Reina de los Profetas',
    'Reina de los Apóstoles', 'Reina de los Mártires', 'Reina de los Confesores',
    'Reina de las Vírgenes', 'Reina de todos los Santos',
    'Reina concebida sin pecado original', 'Reina asunta a los cielos',
    'Reina del Santísimo Rosario', 'Reina de la familia', 'Reina de la paz'
  ];
  const litanyLines = litanyOpening.concat(litanyInvocations.map(name => name + ', ruega por nosotros.'));
  const litanyPairs = litanyLines.map((line, i) => {
    if (i < 5) return { verse: line, response: line };
    if (i < 9) {
      const separator = ', ten misericordia de nosotros.';
      return { verse: line.slice(0, -separator.length) + ',', response: 'ten misericordia de nosotros.' };
    }
    return { verse: line.replace(/ ruega por nosotros\.$/, ''), response: 'ruega por nosotros.' };
  });
  const lambLines = [
    'Cordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.',
    'Cordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.',
    'Cordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.'
  ];
  const fullLitany = litanyPairs.map(pair => '℣. ' + pair.verse + '\n℟. ' + pair.response).join('\n\n') +
    '\n\n' + lambLines.join('\n\n');
  prayers['Letanías'] = fullLitany;
  prayers['Cordero de Dios'] = lambLines.join('\n\n');
  prayers['Estación al Santísimo Sacramento'] =
    '℣. Alabado sea el Santísimo Sacramento del Altar.\n℟. Sea por siempre bendito y alabado.';
  // La antigua etiqueta era incorrecta: esta fórmula corresponde a la Estación.
  delete prayers['Alabanzas al Santísimo'];
  prayers['Comunión espiritual'] =
    'Yo quisiera, Señor, recibiros con aquella pureza, humildad y devoción con que os recibió vuestra Santísima Madre, con el espíritu y fervor de los santos.';
  // Respuestas en dos intervenciones, igual que en el Padrenuestro y el Avemaría.
  prayers.Gloria = 'Gloria al Padre, y al Hijo, y al Espíritu Santo.\n\nComo era en el principio, ahora y siempre, por los siglos de los siglos. Amén.';
  prayers['Señor mío Jesucristo'] =
    'Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío: por ser Vos quien sois y porque os amo sobre todas las cosas, me pesa de todo corazón haberos ofendido.\n\n' +
    'Propongo firmemente nunca más pecar, apartarme de todas las ocasiones de ofenderos, confesarme y cumplir la penitencia que me fuera impuesta.\n\n' +
    'Ofrezco, Señor, mi vida, obras y trabajos en satisfacción de todos mis pecados; y, así como lo suplico, confío en vuestra bondad y misericordia infinita que los perdonaréis por los méritos de vuestra preciosísima sangre, pasión y muerte, y me daréis gracia para enmendarme y perseverar en vuestro santo amor y servicio hasta el fin de mi vida. Amén.';
  prayers['Versículos iniciales'] =
    '℣. Señor, ábreme los labios.\n℟. Y mi boca proclamará tu alabanza.\n\n℣. Dios mío, ven en mi auxilio.\n℟. Señor, date prisa en socorrerme.';
  prayers['Intenciones finales'] = 'Por las necesidades de la Iglesia y del Estado; por el obispo de esta diócesis y sus intenciones; y por las benditas ánimas del purgatorio.';
  const stationPair = {
    title: 'Estación al Santísimo Sacramento', kind: 'dialogue', m: -1,
    verse: 'Alabado sea el Santísimo Sacramento del Altar.',
    response: 'Sea por siempre bendito y alabado.'
  };

  // Conservar el lugar correspondiente a la oración guardada antes de añadir pasos.
  const previousSteps = steps.slice();
  const previousIndex = Math.max(0, Math.min(Number(state.index) || 0, previousSteps.length));
  const previousStep = previousSteps[previousIndex];
  // Jaculatorias configurables, conservadas entre aperturas.
  const validJaculatorias = ['maria', 'alabanzas', 'fatima'];
  const previouslySelected = Array.isArray(saved.jaculatorias)
    ? [...saved.jaculatorias] : ['maria', 'alabanzas'];
  if (Number(saved.sequenceVersion || 0) < 6 && previouslySelected.includes('maria') &&
      !previouslySelected.includes('alabanzas')) previouslySelected.push('alabanzas');
  state.jaculatorias = validJaculatorias.filter(id => previouslySelected.includes(id));
  prayers['Alabanzas y gracias'] =
    'Alabanzas y gracias sean dadas en todo momento al Santísimo y Divinísimo Sacramento del Altar.\n\n' +
    'Y bendita sea por siempre la Santa e Inmaculada Concepción de la Bienaventurada siempre Virgen María, Madre de Dios y Madre nuestra.';
  prayers['Jaculatoria de Fátima'] =
    'Oh Jesús mío, perdona nuestras culpas, presérvanos del fuego del infierno, lleva al cielo a todas las almas, especialmente a las más necesitadas de tu misericordia. Amén.';
  const originalAvemaria = prayers.Avemaría;

  // Intenciones guardadas en el mismo almacenamiento local que el progreso.
  const initialIntentions = [
    'Por la paz y la reconciliación en el mundo.',
    'Por las familias y quienes atraviesan dificultades.',
    'Por las personas enfermas y quienes las cuidan.',
    'Por quienes viven solos o necesitan compañía.',
    'Por los niños y los jóvenes.',
    'Por quienes buscan trabajo y estabilidad.',
    'Por las vocaciones y la vida de la Iglesia.',
    'Por los migrantes y las personas desplazadas.',
    'Por nuestros difuntos y las almas del purgatorio.',
    'Por quienes han pedido nuestras oraciones.'
  ];
  state.intentionPool = Array.isArray(saved.intentionPool)
    ? [...new Set(saved.intentionPool.filter(t => typeof t === 'string').map(t => t.trim()).filter(Boolean))].slice(0,200)
    : [...initialIntentions];
  state.randomIntentionsEnabled = saved.randomIntentionsEnabled === true;
  state.intentionCycle = Array.isArray(saved.intentionCycle) &&
    saved.intentionCycle.length === 5 ? saved.intentionCycle : [null,null,null,null,null];
  function intentionFor(m) {
    if (!state.randomIntentionsEnabled || !state.intentionPool.length) return '';
    // La elección se conserva durante la decena: no cambia con cada render.
    const current = state.intentionCycle[m];
    if (current && state.intentionPool.includes(current)) return current;
    const used = state.intentionCycle.filter((t,i) => i !== m && state.intentionPool.includes(t));
    const available = state.intentionPool.filter(t => !used.includes(t));
    const pool = available.length ? available : state.intentionPool;
    const choice = pool[Math.floor(Math.random() * pool.length)];
    state.intentionCycle[m] = choice;
    persist();
    return choice;
  }
  function resetIntentionCycle() {
    state.intentionCycle = [null,null,null,null,null];
    persist();
  }
  window.rosarioIntentionFor = intentionFor;
  window.rosarioResetIntentionCycle = resetIntentionCycle;

  function buildRosarySteps(legacy = false) {
  // Estación, comunión espiritual y oraciones introductorias.
  const nextSteps = [];
  // Estación completa tres veces: invocación, Padrenuestro, Avemaría y Gloria.
  for (let i = 0; i < 3; i++) {
    nextSteps.push({ ...stationPair, stationNumber: i + 1 });
    nextSteps.push({ title: 'Padrenuestro', m: -1, stationNumber: i + 1 });
    nextSteps.push({ title: 'Avemaría', m: -1, stationNumber: i + 1 });
    nextSteps.push({ title: 'Gloria', m: -1, stationNumber: i + 1 });
  }
  nextSteps.push({ title: 'Comunión espiritual', m: -1 });
  nextSteps.push({ title: 'Señal de la cruz', m: -1 });
  nextSteps.push({ title: 'Señor mío Jesucristo', m: -1 });
  nextSteps.push({ title: 'Versículos iniciales', kind: 'dialogue-group', m: -1,
    dialogues: [
      { verse: 'Señor, ábreme los labios.', response: 'Y mi boca proclamará tu alabanza.' },
      { verse: 'Dios mío, ven en mi auxilio.', response: 'Señor, date prisa en socorrerme.' }
    ] });
  nextSteps.push({ title: 'Gloria', m: -1 });
  for (let m = 0; m < 5; m++) {
    nextSteps.push({ title: 'Anuncio del misterio', kind: 'mystery', m });
    nextSteps.push({ title: 'Padrenuestro', m, bead: m * 11 });
    for (let n = 1; n <= 10; n++) nextSteps.push({ title: 'Avemaría', m, n, bead: m * 11 + n });
    nextSteps.push({ title: 'Gloria', m });
    const selected = legacy ? ['maria', 'alabanzas'] : state.jaculatorias;
    for (const id of selected) {
      if (id === 'maria') nextSteps.push({ title: 'Jaculatoria', m, kind: 'jaculatory' });
      if (id === 'alabanzas') nextSteps.push({ title: 'Alabanzas y gracias', m, kind: 'jaculatory' });
      if (id === 'fatima') nextSteps.push({ title: 'Jaculatoria de Fátima', m, kind: 'jaculatory' });
    }
  }
  // Las tres Avemarías finales figuran antes de las letanías en el devocionario.
  [
    { invocation: 'Hija de Dios Padre', occasion: 'antes del parto' },
    { invocation: 'Madre de Dios Hijo', occasion: 'en el parto' },
    { invocation: 'Esposa de Dios Espíritu Santo', occasion: 'después del parto' }
  ].forEach(({ invocation, occasion }, i) => {
    nextSteps.push({
      title: 'Virgen purísima y castísima', kind: 'dialogue', m: 5, dedication: i,
      verse: 'Virgen purísima y castísima, ' + occasion + ', hacednos mansos, humildes y castos.',
      response: 'En pensamiento, palabra y obra.'
    });
    nextSteps.push({
      title: 'Avemaría', m: 5, kind: 'dedication', dedication: i,
      text: originalAvemaria.replace('Dios te salve, María,', 'Dios te salve, María, ' + invocation + ',')
    });
  });
  // Se conservan la Salve y su respuesta como oraciones independientes.
  nextSteps.push({ title: 'Salve', m: 5 });
  nextSteps.push({ title: 'Ruega por nosotros', m: 5, kind: 'dialogue',
    verse: 'Ruega por nosotros, Santa Madre de Dios.',
    response: 'Para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.' });
  litanyLines.forEach((line, i) => nextSteps.push({
    title: 'Letanías', kind: 'litany', m: 5, text: line,
    verse: litanyPairs[i].verse, response: litanyPairs[i].response, litanyIndex: i
  }));
  lambLines.forEach((line, i) => nextSteps.push({
    title: 'Cordero de Dios', kind: 'final', m: 5, text: line, part: i,
    verse: 'Cordero de Dios, que quitas los pecados del mundo,',
    response: ['perdónanos, Señor.', 'escúchanos, Señor.', 'ten misericordia de nosotros.'][i]
  }));
  nextSteps.push({ title: 'Bajo tu amparo', m: 5 });
  nextSteps.push({ title: 'Ruega por nosotros', m: 5, kind: 'dialogue',
    verse: 'Ruega por nosotros, Santa Madre de Dios.',
    response: 'Para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.' });
  nextSteps.push({ title: 'Oración final', m: 5 });
  [
    { name: 'La Iglesia y el Estado', intro: 'Por las necesidades de la Iglesia y del Estado:', rest: false },
    { name: 'El obispo', intro: 'Por la persona e intenciones del obispo de esta diócesis:', rest: false },
    { name: 'Las almas del purgatorio', intro: 'Por las benditas ánimas del purgatorio:', rest: true }
  ].forEach((intention, i) => {
    // Resaltar la intención junto a la oración siguiente, sin un swipe redundante.
    nextSteps.push({ title: 'Padrenuestro', m: 5, intentionNumber: i, intention: intention.intro });
    nextSteps.push({ title: 'Avemaría', m: 5, intentionNumber: i });
    if (intention.rest) nextSteps.push({ title: 'Descansen en paz', m: 5,
      intentionNumber: i, text: 'Descansen en paz. Amén.' });
    else nextSteps.push({ title: 'Gloria', m: 5, intentionNumber: i });
  });
    return nextSteps;
  }
  steps = buildRosarySteps();

  // Identifica una oración sin depender de su índice tras cambios de secuencia.
  const sameStep = (a, b) => a && b && a.title === b.title && a.m === b.m &&
    a.n === b.n && a.kind === b.kind && a.stationNumber === b.stationNumber &&
    a.dedication === b.dedication && a.litanyIndex === b.litanyIndex &&
    a.part === b.part && a.verse === b.verse &&
    a.intentionNumber === b.intentionNumber;
  const findStep = previous => steps.findIndex(step => sameStep(step, previous));
  function updateJaculatorias(ids) {
    const current = steps[state.index];
    const oldIndex = state.index;
    state.jaculatorias = validJaculatorias.filter(id => ids.includes(id));
    steps = buildRosarySteps();
    let next = findStep(current);
    if (next < 0 && current && current.m >= 0 && current.m < 5) {
      next = steps.findIndex(step => step.m === current.m && step.title === 'Jaculatoria de Fátima');
      if (next < 0) next = steps.findIndex(step => step.kind === 'mystery' && step.m === current.m + 1);
      if (next < 0) next = steps.findIndex(step => step.kind === 'dedication');
    }
    if (next < 0) next = Math.min(oldIndex, steps.length);
    state.index = next;
    state.sequenceVersion = 6;
    render();
  }

  function buildLegacyVersionFive() {
    // Reproduce los pasos de la versión anterior para migrar sin variar la oración.
    const old = [];
    old.push({ ...stationPair });
    for (let i = 0; i < 3; i++) {
      old.push({ title:'Padrenuestro',m:-1,stationNumber:i+1 });
      old.push({ title:'Avemaría',m:-1,stationNumber:i+1 });
      old.push({ title:'Gloria',m:-1,stationNumber:i+1 });
    }
    old.push({ ...stationPair }, { title:'Comunión espiritual',m:-1 },
      { title:'Señal de la cruz',m:-1 }, { title:'Señor mío Jesucristo',m:-1 });
    old.push({ title:'Versículos iniciales',kind:'dialogue',m:-1,
      verse:'Señor, ábreme los labios.' });
    old.push({ title:'Versículos iniciales',kind:'dialogue',m:-1,
      verse:'Dios mío, ven en mi auxilio.' });
    old.push({ title:'Gloria',m:-1 });
    for(let m=0;m<5;m++){
      old.push({ title:'Anuncio del misterio',kind:'mystery',m });
      old.push({ title:'Padrenuestro',m,bead:m*11 });
      for(let n=1;n<=10;n++)old.push({ title:'Avemaría',m,n,bead:m*11+n });
      old.push({title:'Gloria',m});
      const ids=Array.isArray(saved.jaculatorias)?saved.jaculatorias:['maria'];
      ids.forEach(id=>{
        if(id==='maria'){old.push({title:'Jaculatoria',m,kind:'jaculatory'});
          old.push({title:'Alabanzas y gracias',m,kind:'praise'});}
        if(id==='fatima')old.push({title:'Jaculatoria de Fátima',m,kind:'jaculatory'});
      });
    }
    ['Hija de Dios Padre','Madre de Dios Hijo','Esposa de Dios Espíritu Santo'].forEach((inv,i)=>
      old.push({title:'Avemaría',m:5,kind:'dedication',dedication:i}));
    old.push({title:'Salve',m:5},
      {title:'Ruega por nosotros',m:5,kind:'dialogue',verse:'Ruega por nosotros, Santa Madre de Dios.'});
    litanyLines.forEach((v,i)=>old.push({title:'Letanías',m:5,kind:'litany',
      litanyIndex:i,verse:litanyPairs[i].verse}));
    lambLines.forEach((v,i)=>old.push({title:'Cordero de Dios',m:5,kind:'final',
      part:i,verse:'Cordero de Dios, que quitas los pecados del mundo,'}));
    old.push({title:'Bajo tu amparo',m:5},
      {title:'Ruega por nosotros',m:5,kind:'dialogue',verse:'Ruega por nosotros, Santa Madre de Dios.'},
      {title:'Oración final',m:5});
    for(let i=0;i<3;i++){
      old.push({title:'Intenciones finales',m:5,kind:'intention',intentionNumber:i});
      old.push({title:'Padrenuestro',m:5,intentionNumber:i});
      old.push({title:'Avemaría',m:5,intentionNumber:i});
      old.push({title:i===2?'Descansen en paz':'Gloria',m:5,intentionNumber:i});
    }
    return old;
  }

  let restoredIndex;
  if (Number(saved.sequenceVersion) >= 6) {
    restoredIndex = Number(saved.index);
  } else if (Number(saved.sequenceVersion) === 5) {
    // El índice guardado se refiere a la secuencia anterior.
    const old = buildLegacyVersionFive();
    const prev = old[Math.max(0, Math.min(Number(saved.index) || 0, old.length))];
    restoredIndex = prev ? findStep(prev) : steps.length;
    if (restoredIndex < 0 && prev?.kind === 'intention')
      restoredIndex = steps.findIndex(step => step.title === 'Padrenuestro' &&
        step.m === 5 && step.intentionNumber === prev.intentionNumber);
    if (restoredIndex < 0 && prev)
      restoredIndex = steps.findIndex(step => step.title === prev.title &&
        step.m === prev.m && step.n === prev.n &&
        (prev.litanyIndex === undefined || step.litanyIndex === prev.litanyIndex));
  } else if (Number(saved.sequenceVersion) === 4) {
    const legacySteps = buildLegacyVersionFive();
    const original = legacySteps[Math.max(0, Math.min(Number(saved.index) || 0, legacySteps.length))];
    restoredIndex = original ? findStep(original) : steps.length;
    if (restoredIndex < 0 && original?.kind === 'intention')
      restoredIndex = steps.findIndex(step => step.title === 'Padrenuestro' &&
        step.m === 5 && step.intentionNumber === original.intentionNumber);
    if (restoredIndex < 0 && original)
      restoredIndex = steps.findIndex(step => step.title === original.title &&
        step.m === original.m && step.n === original.n &&
        (original.litanyIndex === undefined || step.litanyIndex === original.litanyIndex));
    if (restoredIndex < 0 && original && original.m >= 0 && original.m < 5)
      restoredIndex = steps.findIndex(step => step.kind === 'mystery' && step.m === original.m + 1);
  } else if (!previousStep) {
    restoredIndex = steps.length;
  } else if (previousStep.kind === 'litany') {
    restoredIndex = steps.findIndex(item => item.kind === 'litany' && item.litanyIndex === (previousStep.litanyIndex || 0));
  } else {
    restoredIndex = steps.findIndex(item =>
      item.title === previousStep.title && item.m === previousStep.m &&
      item.n === previousStep.n &&
      (previousStep.kind !== 'mystery' || item.kind === 'mystery')
    );
  }
  state.index = Number.isFinite(restoredIndex) && restoredIndex >= 0
    ? Math.max(0, Math.min(restoredIndex, steps.length)) : 0;
  state.sequenceVersion = 6;
  if (saved.dayDate !== dateKey() || !Number.isInteger(saved.day)) {
    state.day = new Date().getDay();
    state.group = dayGroups[state.day];
    state.intentionCycle = [null,null,null,null,null];
  } else {
    state.day = saved.day;
    state.group = groups[saved.group] ? saved.group : (dayGroups[state.day] || dayGroups[new Date().getDay()]);
  }
  state.dayDate = dateKey();
  const alignments = ['justify', 'left', 'center', 'right'];
  state.textAlign = alignments.includes(saved.textAlign) ? saved.textAlign : 'justify';

  const mysterySingular = {
    Gozosos: 'gozoso', Dolorosos: 'doloroso',
    Gloriosos: 'glorioso', Luminosos: 'luminoso'
  };
  const announcement = step => {
    const ordinals = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'];
    return 'En el ' + ordinals[step.m] + ' misterio ' + mysterySingular[state.group] +
      ' contemplamos:\n\n' + groups[state.group][step.m] + '.';
  };
  const stepText = step => {
    if (!step) return '';
    if (step.kind === 'mystery') return announcement(step);
    if (step.text) return step.text;
    return prayers[step.title] || '';
  };
  const rawRender = render;
  render = function () {
    const step = steps[state.index];
    if (step) {
      if (step.kind === 'mystery') prayers['Anuncio del misterio'] = announcement(step);
      if (step.kind === 'dialogue') prayers[step.title] = '℣. ' + step.verse + '\n℟. ' + step.response;
      if (step.kind === 'dialogue-group') prayers[step.title] = step.dialogues
        .map(part => '℣. ' + part.verse + '\n℟. ' + part.response).join('\n\n');
      if (step.title === 'Avemaría' && step.kind !== 'dedication') prayers.Avemaría = originalAvemaria;
      if (step.kind === 'dedication' || step.kind === 'intention') prayers[step.title] = step.text;
      if (step.title === 'Descansen en paz') prayers[step.title] = step.text;
      if (step.kind === 'litany') prayers['Letanías'] = '℣. ' + step.verse + '\n℟. ' + step.response;
      if (step.title === 'Cordero de Dios') prayers['Cordero de Dios'] = '℣. ' + step.verse + '\n℟. ' + step.response;
    }
    rawRender();
    if (step && step.kind === 'mystery') {
      $('prayerTitle').textContent = 'Anuncio del ' + ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'][step.m] + ' misterio';
    }
    if (step && step.kind === 'litany') {
      $('progressLabel').textContent = 'Letanía ' + (step.litanyIndex + 1) + ' de ' + litanyLines.length;
      $('prayerTitle').textContent = 'Letanías lauretanas';
    }
  };

  // Esperar a que los módulos de cuentas y pantalla inmersiva hayan terminado.
  document.addEventListener('DOMContentLoaded', () => {
    const reading = document.querySelector('.immersive-prayer');
    if (!reading) return;

    const style = document.createElement('style');
    style.textContent = [
      '.litany-wheel[hidden],.meditation-tools[hidden],.meditation-copy[hidden]{display:none!important}',
      '.nav-quick{position:fixed;z-index:8;right:calc(env(safe-area-inset-right,0px) + 129px);top:calc(env(safe-area-inset-top,0px) + 14px);width:42px;height:42px;border-radius:15px;border:1px solid rgba(119,105,80,.14);background:rgba(255,254,250,.9);color:#56574f;display:grid;place-items:center;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);touch-action:none;-webkit-tap-highlight-color:transparent;box-shadow:0 3px 16px #00000008}',
      '.nav-quick svg{width:21px;height:21px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}',
      '.dark .nav-quick{background:#263029ed;color:#e1decf;border-color:#ffffff24}',
      ':root:fullscreen .nav-quick{right:calc(env(safe-area-inset-right,0px) + 58px);top:calc(env(safe-area-inset-top,0px) + 10px);background:transparent;border-color:transparent;box-shadow:none}',
      '.immersive-prayer p,.meditation-copy,#fullPrayerText,.prayer{text-align:var(--rosary-text-align,justify);hyphens:auto}',
      '.dialogue-line{display:block;margin-bottom:14px}.verse-mark{display:inline-grid;place-items:center;min-width:28px;height:28px;margin-right:8px;padding:0 5px;border:1px solid #a78e663e;border-radius:9px;font:700 11px system-ui;color:#9b7742;vertical-align:middle;white-space:nowrap}',
      '.dark .verse-mark{color:#d4b579;border-color:#dbbe8740}',
      '.wheel-main .verse-mark,.wheel-response .verse-mark{margin-right:10px}',
      '.nav-align-option{align-items:center!important}.nav-align-option[aria-pressed="true"]{background:#b89b6a1e;border-color:#b89b6a}',
      '.align-example{font:17px/1.7 Georgia,serif;max-width:34ch;color:#6c7166;margin:8px 3px 15px}',
      '.nav-tabs{grid-template-columns:repeat(4,1fr)!important}',
      '.nav-list.align-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));max-height:none}',
      '@media(max-width:420px){.nav-quick{right:calc(env(safe-area-inset-right,0px) + 117px)}}',
      '.litany-wheel{width:100%;min-height:270px;display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:6px;text-align:center}',
      '.litany-wheel .wheel-label{font:10px system-ui;letter-spacing:2px;text-transform:uppercase;color:#998a6b;margin-bottom:4px}',
      '.litany-wheel .wheel-side{font:17px/1.4 Georgia,serif;min-height:52px;max-height:58px;overflow:hidden;border:0;background:none;color:#8a907f;opacity:.38;padding:8px 12px;display:flex;align-items:center;justify-content:center;width:100%;touch-action:none}',
      '.litany-wheel .wheel-side:disabled{opacity:0;pointer-events:none}',
      '.litany-wheel .wheel-current{display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:130px;padding:18px 5px;border-top:1px solid #b8a27d35;border-bottom:1px solid #b8a27d35}',
      '.litany-wheel .wheel-main{font:clamp(21px,3vw,30px)/1.35 Georgia,serif;color:#50594e}',
      '.litany-wheel .wheel-response{font:14px/1.6 Georgia,serif;color:#98815c;margin-top:12px}',
      '.litany-wheel .wheel-progress{font:10px system-ui;letter-spacing:2px;color:#979a8b;margin-top:10px}',
      '.dark .litany-wheel .wheel-main{color:#e1e0d4}.dark .litany-wheel .wheel-side{color:#d2d4c7}.dark .litany-wheel .wheel-response{color:#c3a978}',
      '.meditation-tools{margin-top:18px}.meditation-tools button{border:0;background:transparent;padding:10px 0;min-height:44px;color:#9b7742;font:13px system-ui;touch-action:none}',
      '.meditation-copy{font:16px/1.7 Georgia,serif;color:#687064;max-height:34dvh;overflow:auto;white-space:normal;margin-top:7px}',
      '.dark .meditation-copy{color:#d3d5c9}.dark .meditation-tools button{color:#d8bb82}',
      '.immersive-prayer.is-litany #immersiveText,.immersive-prayer.is-litany #immersiveCount,.immersive-prayer.is-litany #readFull{display:none!important}',
      '.immersive-prayer.is-litany{overflow:visible}',
      '.nav-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin:20px 0 15px;background:#eae8df;padding:5px;border-radius:14px}',
      '.nav-tabs button{border:0;border-radius:11px;background:transparent;padding:12px 4px;font-size:12px}',
      '.nav-tabs button[aria-selected="true"]{background:#fff;box-shadow:0 2px 8px #00000010}',
      '.nav-list{display:flex;flex-direction:column;gap:6px;max-height:52vh;overflow:auto;overscroll-behavior:contain}',
      '.nav-item{display:flex;flex-direction:column;align-items:flex-start;text-align:left;gap:3px;padding:12px 14px;min-height:46px;border:1px solid #e6e2d6;border-radius:12px;background:transparent;font-size:14px}',
      '.nav-item small{font:11px system-ui;color:#909184}',
      '.nav-item.active{border-color:#b89b6a;background:#b89b6a13}',
      '.dark .nav-tabs{background:#303b32}.dark .nav-tabs button[aria-selected="true"]{background:#4a594a}',
      '.dark .nav-item{border-color:#455143}.dark .nav-item.active{border-color:#b89b6a;background:#b89b6a16}',
      '@media(max-width:450px){.litany-wheel .wheel-main{font-size:23px}.litany-wheel .wheel-side{font-size:15px}}'
    ].join('\n');
    document.head.append(style);

    const wheel = document.createElement('div');
    wheel.className = 'litany-wheel';
    wheel.hidden = true;
    wheel.setAttribute('aria-label', 'Letanías, una invocación por deslizamiento');
    wheel.innerHTML =
      '<div class="wheel-label">Letanías lauretanas</div>' +
      '<button type="button" class="wheel-side" id="litanyPrevious" aria-label="Letanía anterior"></button>' +
      '<div class="wheel-current" role="button" tabindex="0" aria-label="Ver todas las letanías" aria-live="polite">' +
      '<div class="wheel-main"><span class="verse-mark" aria-label="Versículo">℣.</span><span id="litanyCurrent"></span></div>' +
      '<div class="wheel-response voice-assembly"><span class="verse-mark" aria-label="Respuesta">℟.</span><span id="litanyResponse"></span></div>' +
      '<div class="wheel-progress" id="litanyProgress"></div></div>' +
      '<button type="button" class="wheel-side" id="litanyNext" aria-label="Letanía siguiente"></button>';
    reading.insertBefore(wheel, $('immersiveCount'));
    const meditationBox = document.createElement('div');
    meditationBox.className = 'meditation-tools';
    meditationBox.hidden = true;
    meditationBox.innerHTML = '<button type="button" id="meditationToggle" aria-label="Leer meditación completa">Ver meditación <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button>';
    reading.insertBefore(meditationBox, $('immersiveCount'));

    function litanyLabel(line) {
      return line.replace(/, ruega por nosotros\.$/, '');
    }
    function openLitanyList() {
      const current = steps[state.index];
      if (current?.kind !== 'litany') return;
      show('<h2>Letanías lauretanas</h2><p class="jac-intro">Selecciona una invocación para continuar desde ella.</p><div class="litany-directory" id="litanyDirectory"></div>');
      const container = $('litanyDirectory');
      const positions = steps.map((st,i)=>st.kind==='litany'?i:-1).filter(i=>i>=0);
      positions.forEach((idx,n)=>{
        const pair = litanyPairs[n];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'litany-directory-item' + (idx === state.index ? ' selected' : '');
        btn.setAttribute('aria-current', idx === state.index ? 'true' : 'false');
        const title = document.createElement('span');
        title.textContent = pair.verse;
        const response = document.createElement('small');
        response.textContent = pair.response;
        btn.append(title,response);
        btn.onclick = () => goTo(idx);
        container.append(btn);
      });
      requestAnimationFrame(()=>{
        const active = container.querySelector('.selected');
        if (active) container.scrollTop = active.offsetTop - container.offsetTop -
          (container.clientHeight - active.clientHeight)/2;
      });
    }
    window.rosarioOpenLitanies = openLitanyList;
    function formatDialogue(step) {
      const paragraph = $('immersiveText');
      paragraph.replaceChildren();
      [
        ['V/', step.verse, 'Versículo'],
        ['R/', step.response, 'Respuesta']
      ].forEach(([mark, text, label]) => {
        const line = document.createElement('span');
        line.className = 'dialogue-line';
        const badge = document.createElement('span');
        badge.className = 'verse-mark';
        badge.textContent = mark;
        badge.setAttribute('aria-label', label);
        line.append(badge, document.createTextNode(text));
        paragraph.append(line);
      });
    }
    function applyAlignment() {
      document.documentElement.style.setProperty('--rosary-text-align', state.textAlign);
    }
    function goTo(index) {
      state.index = Math.max(0, Math.min(index, steps.length));
      render();
      if ($('modal').open) $('modal').close();
      const toolbar = document.querySelector('.prayer-toolbar');
      if (toolbar) toolbar.hidden = true;
    }
    $('litanyPrevious').onclick = openLitanyList;
    $('litanyNext').onclick = openLitanyList;
    wheel.querySelector('.wheel-current').onclick = openLitanyList;
    wheel.querySelector('.wheel-current').onkeydown = e => {
      if(e.key==='Enter'||e.key===' '){e.preventDefault();openLitanyList();}
    };
    function openMeditation(m) {
      if (m < 0 || m > 4) return;
      const complete = window.rosaryFullMeditations?.[state.group]?.[m];
      const text = complete || meditations[state.group]?.[m] || '';
      show('<div class="meditation-dialog"><div class="meditation-kicker">Meditación · Misterio ' +
        (m+1) + '</div><h2 id="meditationTitle"></h2><div class="meditation-full" id="meditationFull"></div></div>');
      $('meditationTitle').textContent = groups[state.group][m];
      if (window.rosaryFormatAmens) window.rosaryFormatAmens($('meditationFull'),text);
      else $('meditationFull').textContent=text;
      $('modal').scrollTop=0;
    }
    window.rosarioOpenMeditation=openMeditation;
    $('meditationToggle').onclick=()=>{
      const current=steps[state.index];
      if(current?.kind==='mystery') openMeditation(current.m);
    };

    const immersiveRender = render;
    render = function () {
      immersiveRender();
      updateEnhancements();
    };
    function updateEnhancements() {
      const step = steps[state.index];
      const isLitany = step?.kind === 'litany';
      const isAnnouncement = step?.kind === 'mystery';
      reading.classList.toggle('is-litany', isLitany);
      wheel.hidden = !isLitany;
      meditationBox.hidden = !isAnnouncement;
      applyAlignment();
      if (step && !isLitany && step.verse && step.response) formatDialogue(step);
      if (isLitany) {
        const i = step.litanyIndex;
        const pair = litanyPairs[i];
        $('litanyCurrent').textContent = pair.verse;
        $('litanyResponse').textContent = pair.response;
        $('litanyProgress').textContent = (i + 1) + ' / ' + litanyLines.length;
        $('litanyPrevious').textContent = i > 0 ? litanyPairs[i - 1].verse : '';
        $('litanyPrevious').disabled = i === 0;
        $('litanyNext').textContent = i < litanyLines.length - 1 ? litanyPairs[i + 1].verse : '';
        $('litanyNext').disabled = i === litanyLines.length - 1;
      }
      if (isAnnouncement) $('meditationToggle').setAttribute('aria-label', 'Leer meditación completa del misterio');
      // Mientras se anuncian los misterios, centrar la cuenta de su decena.
      if (isAnnouncement && typeof chain !== 'undefined') {
        const bead = step.m * 11;
        const w = document.documentElement.clientWidth;
        const h = window.innerHeight;
        const track = chain.querySelector('.chain-track');
        if (track) {
          window.rosarioChainOrigin={
            x:Math.min(w*.22,220)-89, y:h/2-point(bead).y
          };
          if(window.rosarioApplyChainPan) window.rosarioApplyChainPan();
          else track.style.transform='translate('+window.rosarioChainOrigin.x+
            'px,'+window.rosarioChainOrigin.y+'px)';
        }
        chain.querySelectorAll('.focus-bead').forEach(el => {
          const active = Number(el.dataset.bead) === bead;
          el.classList.toggle('active', active);
          el.setAttribute('aria-current', active ? 'step' : 'false');
        });
      }
      if (isAnnouncement) $('readFull').hidden = true;
    }

    function appendOption(container, label, subtitle, action, active) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'nav-item' + (active ? ' active' : '');
      button.textContent = label;
      if (subtitle) {
        const sub = document.createElement('small');
        sub.textContent = subtitle;
        button.append(sub);
      }
      button.onclick = action;
      container.append(button);
      return button;
    }

    function openNavigation(tab = 'days') {
      show('<h2>Navegar por el rosario</h2>' +
        '<div class="nav-tabs" role="tablist" aria-label="Secciones del rosario">' +
        '<button type="button" data-nav="days" role="tab">Días</button>' +
        '<button type="button" data-nav="mysteries" role="tab">Misterios</button>' +
        '<button type="button" data-nav="prayers" role="tab">Oraciones</button>' +
        '<button type="button" data-nav="jaculatorias" role="tab">Jaculatorias</button>' +
        '<button type="button" data-nav="intentions" role="tab">Intenciones</button>' +
        '<button type="button" data-nav="text" role="tab">Texto</button>' +
        '<button type="button" data-nav="voices" role="tab">Voces</button></div>' +
        '<div class="nav-list" id="navList"></div>' +
        '<section class="nav-detail" id="navDetail" hidden aria-label="Consulta de oración"></section>');
      const tabs = ['days','mysteries','prayers','jaculatorias','intentions','text','voices'];
      let currentTab = tab;
      let savedScroll = 0;
      function openPreview(title,content) {
        const list=$('navList'),detail=$('navDetail');
        savedScroll=list.scrollTop;
        list.hidden=true;
        detail.hidden=false;
        detail.replaceChildren();
        const back=document.createElement('button');
        back.type='button';
        back.className='nav-preview-back';
        back.textContent='← Volver a la lista';
        back.onclick=()=>{
          detail.hidden=true;
          list.hidden=false;
          list.scrollTop=savedScroll;
        };
        const heading=document.createElement('h3');
        heading.textContent=title;
        const body=document.createElement('div');
        body.className='nav-preview-reading';
        if(window.rosaryFormatAmens)window.rosaryFormatAmens(body,content);
        else body.textContent=content;
        detail.append(back,heading,body);
        $('modal').scrollTop=0;
        detail.scrollTop=0;
      }
      function addPreviewRow(list,label,subtitle,go,active,previewTitle,previewContent,previewLabel='Leer'){
        const wrapper=document.createElement('div');
        wrapper.className='nav-entry';
        appendOption(wrapper,label,subtitle,go,active);
        const look=document.createElement('button');
        look.type='button';
        look.className='nav-preview-link';
        look.textContent=previewLabel+' ↗';
        look.setAttribute('aria-label',previewLabel+': '+previewTitle);
        look.onclick=()=>openPreview(previewTitle,previewContent);
        wrapper.append(look);
        list.append(wrapper);
      }
      function prayerPreview(title,step) {
        if(title==='Letanías')return fullLitany;
        if(title==='Cordero de Dios')return lambLines.join('\n\n');
        if(title==='Tres Avemarías')return originalAvemaria;
        if(title==='Anuncio del misterio')return announcement({m:Math.max(0,Math.min(4,step?.m||0))});
        return step?.text || prayers[title] || '';
      }
      function fill(selected) {
        currentTab=selected;
        $('navDetail').hidden=true;
        $('navList').hidden=false;
        $('modal').querySelectorAll('[data-nav]').forEach(btn => {
          btn.setAttribute('aria-selected', String(btn.dataset.nav === selected));
        });
        const list = $('navList');
        list.replaceChildren();
        list.classList.toggle('align-list', selected === 'text');
        if (selected === 'days') {
          dayNames.forEach((day, i) => {
            appendOption(list, day, 'Misterios ' + dayGroups[i].toLowerCase(), () => {
              state.day = i;
              state.group = dayGroups[i];
              state.dayDate = dateKey();
              resetIntentionCycle();
              goTo(steps.findIndex(item => item.kind === 'mystery'));
            }, state.day === i);
          });
        } else if (selected === 'mysteries') {
          groups[state.group].forEach((name,i)=>{
            const full=window.rosaryFullMeditations?.[state.group]?.[i] ||
              meditations[state.group]?.[i] || '';
            addPreviewRow(list,(i+1)+'. '+name,state.group,()=>{
              goTo(steps.findIndex(item=>item.kind==='mystery'&&item.m===i));
            },steps[state.index]?.m===i,name,full,'Meditación');
          });
        } else if (selected === 'prayers') {
          const titles = [
            ['Estación al Santísimo Sacramento', 'Antes de comenzar'],
            ['Comunión espiritual', 'Antes del rosario'],
            ['Señal de la cruz', 'Inicio'],
            ['Señor mío Jesucristo', 'Acto de contrición'],
            ['Versículos iniciales', 'Diálogo V/ y R/'],
            ['Anuncio del misterio', 'Antes de cada decena'],
            ['Padrenuestro', 'Cada decena'],
            ['Avemaría', 'Diez veces por misterio'],
            ['Gloria', 'Al terminar la decena'],
            ['Jaculatoria', 'María, Madre de gracia'],
            ['Alabanzas y gracias', 'Jaculatoria opcional tras el Gloria'],
            ['Jaculatoria de Fátima', 'Oh Jesús mío'],
            ['Tres Avemarías', 'Al terminar los cinco misterios'],
            ['Virgen purísima y castísima', 'Antes de cada Avemaría final'],
            ['Salve', 'Oración final de los cinco misterios'],
            ['Ruega por nosotros', 'Respuesta a la Virgen'],
            ['Letanías', 'Una invocación por deslizamiento'],
            ['Cordero de Dios', 'Tres peticiones'],
            ['Bajo tu amparo', 'Oración a la Virgen'],
            ['Oración final', 'Conclusión'],
            ['Padrenuestro', 'Intenciones finales: Iglesia, obispo y ánimas']
          ];
          titles.forEach(([title, subtitle]) => {
            const lookup = title === 'Tres Avemarías' ? 'Avemaría' : title;
            const positions = steps.map((item, i) => item.title === lookup &&
              (title !== 'Tres Avemarías' || item.kind === 'dedication') ? i : -1).filter(i => i >= 0);
            if (!positions.length) return;
            const closest = positions.find(i => i >= state.index) ?? positions[0];
            const display=title==='Jaculatoria'?'María, Madre de gracia':title;
            addPreviewRow(list,display,subtitle,()=>goTo(closest),
              steps[state.index]?.title===title,display,
              prayerPreview(title,steps[closest]));
          });
        } else if (selected === 'jaculatorias') {
          const info = document.createElement('p');
          info.className = 'jac-intro';
          info.textContent = 'Elige las jaculatorias que se rezarán después del Gloria de cada misterio. Se utilizarán en el orden indicado.';
          list.append(info);
          [
            ['maria', 'María, Madre de gracia', prayers.Jaculatoria],
            ['alabanzas', 'Alabanzas y gracias', prayers['Alabanzas y gracias']],
            ['fatima', 'Oh Jesús mío', prayers['Jaculatoria de Fátima']]
          ].forEach(([id, label, content]) => {
            const row = document.createElement('label');
            row.className = 'jac-choice';
            const check = document.createElement('input');
            check.type = 'checkbox';
            check.checked = state.jaculatorias.includes(id);
            const section = document.createElement('span');
            const title = document.createElement('strong');
            title.textContent = label;
            const preview = document.createElement('small');
            preview.textContent = content;
            section.append(title, preview);
            row.append(check, section);
            check.onchange = () => {
              updateJaculatorias(check.checked
                ? [...state.jaculatorias, id] : state.jaculatorias.filter(value => value !== id));
            };
            list.append(row);
          });
          const notice = document.createElement('p');
          notice.className = 'jac-intro';
          notice.textContent = 'Puedes activar cualquiera de las tres jaculatorias, por separado o en combinación. Se rezarán después del Gloria, en el orden de la lista.';
          list.append(notice);
        } else if (selected === 'intentions') {
          const caption=document.createElement('p');
          caption.className='jac-intro';
          caption.textContent='Las intenciones se guardan únicamente en este dispositivo. Antes de cada misterio aparecerá una de la lista, elegida al azar y conservada durante esa decena.';
          list.append(caption);
          const switchRow=document.createElement('label');
          switchRow.className='jac-choice';
          const check=document.createElement('input');
          check.type='checkbox';
          check.checked=state.randomIntentionsEnabled;
          const label=document.createElement('span');
          const bold=document.createElement('strong');
          bold.textContent='Mostrar intenciones aleatorias';
          const small=document.createElement('small');
          small.textContent='Activar o desactivar antes de cada misterio.';
          label.append(bold,small);
          switchRow.append(check,label);
          check.onchange=()=>{
            state.randomIntentionsEnabled=check.checked;
            if(check.checked && state.intentionPool.length===0){
              state.intentionPool=[...initialIntentions];
            }
            resetIntentionCycle();
            render();
            fill('intentions');
          };
          list.append(switchRow);
          const addRow=document.createElement('div');
          addRow.className='intention-add';
          const input=document.createElement('input');
          input.type='text';
          input.maxLength=350;
          input.placeholder='Escribe una nueva intención';
          input.setAttribute('aria-label','Nueva intención');
          const add=document.createElement('button');
          add.type='button';
          add.textContent='Agregar';
          add.onclick=()=>{
            const value=input.value.trim();
            if(!value || state.intentionPool.includes(value) || state.intentionPool.length>=200)return;
            state.intentionPool.push(value);
            persist();
            fill('intentions');
          };
          input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();add.click();}};
          addRow.append(input,add);
          list.append(addRow);
          state.intentionPool.forEach((value,i)=>{
            const row=document.createElement('div');
            row.className='intention-entry';
            const span=document.createElement('span');
            span.textContent=value;
            const edit=document.createElement('button');
            edit.type='button';
            edit.className='intention-small-btn';
            edit.textContent='Editar';
            edit.setAttribute('aria-label','Editar intención '+(i+1));
            edit.onclick=()=>{
              row.replaceChildren();
              const field=document.createElement('textarea');
              field.rows=2;
              field.maxLength=350;
              field.value=value;
              const save=document.createElement('button');
              save.type='button';
              save.className='intention-small-btn';
              save.textContent='Guardar';
              save.onclick=()=>{
                const updated=field.value.trim();
                if(!updated || (updated!==value && state.intentionPool.includes(updated)))return;
                state.intentionPool[i]=updated;
                state.intentionCycle=state.intentionCycle.map(t=>t===value?updated:t);
                persist();
                fill('intentions');
              };
              const cancel=document.createElement('button');
              cancel.type='button';
              cancel.className='intention-small-btn';
              cancel.textContent='Cancelar';
              cancel.onclick=()=>fill('intentions');
              row.append(field,save,cancel);
              field.focus();
            };
            const del=document.createElement('button');
            del.type='button';
            del.className='intention-small-btn danger';
            del.textContent='Quitar';
            del.setAttribute('aria-label','Eliminar intención '+(i+1));
            del.onclick=()=>{
              state.intentionPool.splice(i,1);
              state.intentionCycle=state.intentionCycle.map(t=>t===value?null:t);
              persist();
              fill('intentions');
            };
            row.append(span,edit,del);
            list.append(row);
          });
          const backup=document.createElement('div');
          backup.className='intention-backup';
          const backupLabel=document.createElement('p');
          backupLabel.className='jac-intro';
          backupLabel.textContent='Copia de seguridad: exporta la lista o pega aquí una lista JSON para restaurarla.';
          const exportButton=document.createElement('button');
          exportButton.type='button';
          exportButton.textContent='Exportar JSON';
          exportButton.onclick=()=>{
            const payload=JSON.stringify({intentions:state.intentionPool},null,2);
            const blob=new Blob([payload],{type:'application/json'});
            const url=URL.createObjectURL(blob);
            const a=document.createElement('a');
            a.href=url;
            a.download='rosario-intenciones.json';
            a.click();
            setTimeout(()=>URL.revokeObjectURL(url),1000);
          };
          const restore=document.createElement('textarea');
          restore.placeholder='Pega aquí el contenido de tu copia JSON';
          restore.rows=3;
          restore.setAttribute('aria-label','JSON para restaurar intenciones');
          const restoreButton=document.createElement('button');
          restoreButton.type='button';
          restoreButton.textContent='Restaurar lista';
          const feedback=document.createElement('small');
          restoreButton.onclick=()=>{
            try{
              const parsed=JSON.parse(restore.value);
              const arr=Array.isArray(parsed)?parsed:parsed.intentions;
              if(!Array.isArray(arr)||arr.length>200||arr.some(x=>typeof x!=='string'||x.length>350))
                throw Error('Archivo no válido');
              state.intentionPool=[...new Set(arr.map(x=>x.trim()).filter(Boolean))];
              resetIntentionCycle();
              fill('intentions');
            }catch{feedback.textContent='No se pudo leer la lista. Comprueba el formato JSON.';}
          };
          backup.append(backupLabel,exportButton,restore,restoreButton,feedback);
          list.append(backup);
        } else if (selected === 'voices') {
          const description=document.createElement('p');
          description.className='jac-intro';
          description.textContent='Personaliza las intervenciones del guía y la asamblea. La respuesta se destaca en dorado.';
          list.append(description);
          [
            ['voiceLabels','Mostrar «Guía» y «Asamblea»','Conserva las etiquetas de cada intervención.'],
            ['voiceColors','Diferenciar las voces por color','Desactívalo para rezar en solitario con un solo color.']
          ].forEach(([key,title,description])=>{
            const row=document.createElement('label');
            row.className='jac-choice';
            const check=document.createElement('input');
            check.type='checkbox';
            check.checked=state[key]!==false;
            const info=document.createElement('span');
            const strong=document.createElement('strong');
            strong.textContent=title;
            const small=document.createElement('small');
            small.textContent=description;
            info.append(strong,small);
            row.append(check,info);
            check.onchange=()=>{
              state[key]=check.checked;
              persist();
              render();
            };
            list.append(row);
          });
        } else if (selected === 'text') {
          const modes = [
            ['justify', 'Justificar'], ['left', 'Izquierda'],
            ['center', 'Centrar'], ['right', 'Derecha']
          ];
          modes.forEach(([value, label]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'nav-item nav-align-option' + (state.textAlign === value ? ' active' : '');
            button.textContent = label;
            button.setAttribute('aria-pressed', String(state.textAlign === value));
            button.onclick = () => {
              state.textAlign = value;
              applyAlignment();
              persist();
              fill('text');
            };
            list.append(button);
          });
          const preview = document.createElement('div');
          preview.className = 'align-example';
          preview.style.gridColumn = '1 / -1';
          preview.style.textAlign = state.textAlign;
          preview.textContent = 'El texto de las oraciones y las meditaciones se mostrará con esta alineación.';
          list.append(preview);
        }
      }
      $('modal').querySelectorAll('[data-nav]').forEach(button => {
        button.onclick = () => fill(button.dataset.nav);
      });
      // Swipe horizontal entre las pestañas del menú, sin interceptar el scroll vertical.
      let touch=null;
      const surface=$('modalContent');
      surface.addEventListener('touchstart',e=>{
        if(e.touches.length!==1 || e.target.closest('textarea,input,select'))return;
        touch={x:e.touches[0].clientX,y:e.touches[0].clientY};
      },{passive:true});
      surface.addEventListener('touchend',e=>{
        if(!touch)return;
        const p=touch;touch=null;
        const t=e.changedTouches[0];
        if(!t)return;
        const dx=t.clientX-p.x,dy=t.clientY-p.y;
        if(Math.abs(dx)<55||Math.abs(dx)<=Math.abs(dy)*1.3)return;
        e.preventDefault();
        const index=tabs.indexOf(currentTab);
        fill(tabs[Math.max(0,Math.min(tabs.length-1,index+(dx<0?1:-1)))]);
      },{passive:false});
      surface.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
      fill(tab);
    }

    // El menú reemplaza el atajo aislado a los misterios: días, misterios y oraciones.
    const navButton = $('iMysteries');
    navButton.textContent = 'Navegar';
    navButton.setAttribute('aria-label', 'Abrir menú de días, misterios y oraciones');
    navButton.onclick = () => openNavigation('days');
    window.rosarioOpenVoiceSettings = () => openNavigation('voices');
    // La configuración general también da acceso a las preferencias de voces.
    const originalSettings = $('settings').onclick;
    $('settings').onclick = () => {
      originalSettings();
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'voice-settings-link';
      btn.textContent = 'Configurar guía y asamblea';
      btn.onclick = () => {
        $('modal').close();
        openNavigation('voices');
      };
      $('modalContent').append(btn);
    };
    // Acceso permanente, sin tener que revelar la barra inferior oculta.
    const quickNav = document.createElement('button');
    quickNav.type = 'button';
    quickNav.className = 'nav-quick';
    quickNav.id = 'iNavigate';
    quickNav.title = 'Navegar por el rosario';
    quickNav.setAttribute('aria-label', 'Abrir menú de navegación');
    quickNav.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    // Controles agrupados: el icono de menú comparte la misma barra que tema y pantalla.
    quickNav.classList.add('top-control');
    quickNav.classList.remove('nav-quick');
    document.querySelector('.top-controls').prepend(quickNav);
    quickNav.onclick = () => openNavigation('days');

    // En pantalla completa se oculta junto con los demás controles dentro del punto.
    // El mismo grupo superior reaparece al tocar ese punto.
    $('allMysteries').onclick = () => openNavigation('mysteries');

    const alignButton=document.createElement('button');
    alignButton.type='button';
    alignButton.className='modal-align-button';
    alignButton.title='Cambiar alineación del texto';
    $('modal').querySelector('.close').after(alignButton);
    const alignNames={justify:'Justificado',left:'Izquierda',center:'Centrado',right:'Derecha'};
    const alignIcons={
      justify:'<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>',
      left:'<path d="M4 6h16M4 10h11M4 14h16M4 18h10"/>',
      center:'<path d="M4 6h16M7 10h10M4 14h16M8 18h8"/>',
      right:'<path d="M4 6h16M9 10h11M4 14h16M10 18h10"/>'
    };
    function updateModalAlign(){
      alignButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+alignIcons[state.textAlign]+'</svg>';
      alignButton.setAttribute('aria-label','Alineación: '+alignNames[state.textAlign]+'. Pulsar para cambiar.');
    }
    alignButton.onclick=()=>{
      state.textAlign=alignments[(alignments.indexOf(state.textAlign)+1)%alignments.length];
      applyAlignment();
      persist();
      updateModalAlign();
    };
    updateModalAlign();
    new MutationObserver(()=>{if($('modal').open)updateModalAlign();})
      .observe($('modal'),{attributes:true,attributeFilter:['open']});

    // El devocionario conserva las letanías completas como texto de consulta.
    $('prayers').onclick = () => {
      const options = Object.keys(prayers).filter(name => name !== 'Anuncio del misterio');
      show('<h2>Oraciones</h2><select id="prayerSelect"></select>' +
        '<div class="prayer" id="reading"></div>' +
        '<p><a href="https://opusdei.org/es/prayers/section/?section1=25&section2=35#dm-prayer-145" target="_blank" rel="noopener">Estructura del Rosario · Opus Dei ↗</a></p>');
      const select = $('prayerSelect');
      options.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name === 'Jaculatoria' ? 'María, Madre de gracia' : name;
        select.append(option);
      });
      const showSelectedPrayer = () => {
        const text = select.value === 'Letanías' ? fullLitany :
          select.value === 'Cordero de Dios' ? lambLines.map((line,i) =>
            '℣. Cordero de Dios, que quitas los pecados del mundo,\n℟. ' +
            ['perdónanos, Señor.','escúchanos, Señor.','ten misericordia de nosotros.'][i]).join('\n\n') :
          prayers[select.value];
        $('reading').replaceChildren();
        if (window.rosaryFormatAmens) window.rosaryFormatAmens($('reading'), text);
        else $('reading').textContent = text;
      };
      select.onchange = showSelectedPrayer;
      showSelectedPrayer();
    };

    // Cambiar de día automáticamente al iniciar el primer rezo del día siguiente.
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && state.dayDate !== dateKey()) {
        state.day = new Date().getDay();
        state.group = dayGroups[state.day];
        state.dayDate = dateKey();
        resetIntentionCycle();
        render();
      }
    });
    render();
  });
})();