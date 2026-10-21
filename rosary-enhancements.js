/* Secuencia, meditaciones, letanías y navegación del Rosario.
   Se carga después de app.js y antes de focus.js / immersive.js. */
(() => {
  'use strict';

  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const mondayFirst=[1,2,3,4,5,6,0]; // Conservar números JS para fechas.
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
    'hemos conocido la Encarnación de tu Hijo Jesucristo, por su pasión y cruz, seamos llevados a la gloria de su resurrección. ' +
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
    'Trinidad Santa, un solo Dios, ten piedad de nosotros.'
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
    'Consuelo de los afligidos', 'Auxilio de los cristianos',
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
      return { verse: line.endsWith(separator)
        ? line.slice(0,-separator.length)+',' : line.replace(/,?\s*ten piedad de nosotros\.$/,','),
        response: 'ten piedad de nosotros.' };
    }
    return { verse: line.replace(/ ruega por nosotros\.$/, ''), response: 'ruega por nosotros.' };
  });
  const baseLitanyPairs=litanyPairs.map(pair=>({...pair}));
  const lambLines = [
    'Cordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.',
    'Cordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.',
    'Cordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.'
  ];
  const baseLambLines=lambLines.slice();
  const fullLitany = litanyPairs.map(pair => '℣. ' + pair.verse + '\n℟. ' + pair.response).join('\n\n') +
    '\n\n' + lambLines.join('\n\n');
  prayers['Letanías'] = fullLitany;
  prayers['Cordero de Dios'] = lambLines.join('\n\n');
  prayers['Estación al Santísimo Sacramento'] =
    '℣. Alabado sea el Santísimo Sacramento del Altar.\n℟. Sea por siempre bendito y alabado.';
  // La antigua etiqueta era incorrecta: esta fórmula corresponde a la Estación.
  delete prayers['Alabanzas al Santísimo'];
  prayers['Comunión espiritual'] =
    'Yo quisiera, Señor, recibiros con aquella pureza, humildad y devoción con que os recibió vuestra Santísima Madre, con el espíritu y fervor de los santos. Amén.';
  // Respuestas en dos intervenciones, igual que en el Padrenuestro y el Avemaría.
  prayers.Gloria = 'Gloria al Padre, y al Hijo, y al Espíritu Santo.\n\nComo era en el principio, ahora y siempre, por los siglos de los siglos. Amén.';
  prayers['Señor mío Jesucristo'] =
    'Señor mío Jesucristo, Dios y Hombre verdadero, Creador, Padre y Redentor mío: por ser Vos quien sois y porque os amo sobre todas las cosas, me pesa de todo corazón haberos ofendido.\n\n' +
    'Propongo firmemente nunca más pecar, apartarme de todas las ocasiones de ofenderos, confesarme y cumplir la penitencia que me fuera impuesta.\n\n' +
    'Ofrezco, Señor, mi vida, obras y trabajos en satisfacción de todos mis pecados; y, así como lo suplico, confío en vuestra bondad y misericordia infinita que los perdonaréis por los méritos de vuestra preciosísima sangre, pasión y muerte, y me daréis gracia para enmendarme y perseverar en vuestro santo amor y servicio hasta el fin de mi vida. Amén.';
  const contritionTraditional=prayers['Señor mío Jesucristo']; 
  prayers['Acto de contrición (Jesús, mi Señor y Redentor)'] =
    'Jesús, mi Señor y Redentor, yo me arrepiento de todos los pecados que he cometido hasta hoy, '+
    'y me pesa de todo corazón porque con ellos he ofendido a un Dios tan bueno. '+
    'Propongo firmemente no volver a pecar y confío en que por tu infinita misericordia '+
    'me has de conceder el perdón de mis culpas y me has de llevar a la vida eterna. Amén.';
  // Dos textos, una sola estación; cambiar de versión nunca mueve la cuenta.
  state.contritionVersion=saved.contritionVersion==='redentor'?'redentor':'jesucristo';
  window.rosarioContritionText=()=>{
    return state.contritionVersion==='redentor'
      ?prayers['Acto de contrición (Jesús, mi Señor y Redentor)']
      :prayers['Señor mío Jesucristo'];
  };
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
  // La Salve permanece al final salvo elección expresa del usuario.
  state.salvePosition=saved.salvePosition==='after-dedication'
    ?'after-dedication':'final';

  // Catálogo de intenciones del Rosario, vinculado al apartado ya existente.
  // Las intenciones personales continúan siendo editables en Navegación > Intenciones.
  const mysteryIntentions = {
    "Gozosos": [
      [
        "Por quienes buscan descubrir la voluntad de Dios.",
        "Por las madres que esperan un hijo.",
        "Por quienes temen aceptar nuevos caminos.",
        "Por los jóvenes llamados a la vida consagrada.",
        "Por quienes necesitan confiar en las promesas de Dios."
      ],
      [
        "Por las familias que necesitan reconciliarse.",
        "Por quienes cuidan a sus familiares enfermos.",
        "Por las mujeres que viven embarazos difíciles.",
        "Por quienes sirven silenciosamente al prójimo.",
        "Por los ancianos que viven en soledad."
      ],
      [
        "Por los niños que nacen en condiciones de pobreza.",
        "Por las familias que carecen de un hogar.",
        "Por quienes pasarán la Navidad en soledad.",
        "Por los corazones que necesitan recuperar la alegría.",
        "Por los recién nacidos y sus padres."
      ],
      [
        "Por los padres que educan a sus hijos en la fe.",
        "Por los niños que reciben el bautismo.",
        "Por quienes consagran su vida al Señor.",
        "Por los ancianos que esperan con fe.",
        "Por las familias que buscan vivir en santidad."
      ],
      [
        "Por los padres que sufren la ausencia de sus hijos.",
        "Por los niños desaparecidos y sus familias.",
        "Por quienes se han alejado de la Iglesia.",
        "Por los jóvenes que buscan sentido a su vida.",
        "Por quienes desean reencontrarse con Dios."
      ]
    ],
    "Luminosos": [
      [
        "Por quienes recibirán el sacramento del bautismo.",
        "Por los cristianos que han olvidado su fe.",
        "Por los padrinos y su compromiso espiritual.",
        "Por quienes buscan renovar su vida en Cristo.",
        "Por la fidelidad a nuestras promesas bautismales."
      ],
      [
        "Por los matrimonios que atraviesan dificultades.",
        "Por los esposos que desean fortalecer su amor.",
        "Por las familias que necesitan un milagro.",
        "Por quienes preparan su matrimonio cristiano.",
        "Por los hogares donde se ha perdido la alegría."
      ],
      [
        "Por la conversión de los corazones endurecidos.",
        "Por quienes viven alejados del Evangelio.",
        "Por los sacerdotes que anuncian la Palabra.",
        "Por quienes luchan contra sus propios pecados.",
        "Por quienes necesitan descubrir la misericordia divina."
      ],
      [
        "Por quienes atraviesan una crisis de fe.",
        "Por los enfermos que necesitan esperanza.",
        "Por quienes buscan la luz en la oscuridad.",
        "Por los jóvenes que disciernen su vocación.",
        "Por quienes desean contemplar la gloria de Dios."
      ],
      [
        "Por quienes recibirán su primera comunión.",
        "Por los sacerdotes y su fidelidad eucarística.",
        "Por quienes han dejado de recibir la Eucaristía.",
        "Por los cristianos perseguidos a causa de su fe.",
        "Por quienes encuentran fortaleza en la adoración."
      ]
    ],
    "Dolorosos": [
      [
        "Por quienes sufren ansiedad y angustia.",
        "Por quienes enfrentan decisiones dolorosas.",
        "Por los enfermos que temen la muerte.",
        "Por quienes se sienten abandonados.",
        "Por quienes necesitan aceptar la voluntad divina."
      ],
      [
        "Por las víctimas de violencia y maltrato.",
        "Por quienes padecen enfermedades dolorosas.",
        "Por las personas sometidas a torturas.",
        "Por quienes sufren injusticias en silencio.",
        "Por la dignidad de quienes son humillados."
      ],
      [
        "Por quienes son despreciados a causa de su fe.",
        "Por las víctimas de burlas y humillaciones.",
        "Por quienes sufren abusos de autoridad.",
        "Por los gobernantes que necesitan humildad.",
        "Por quienes soportan acusaciones injustas."
      ],
      [
        "Por quienes cargan grandes responsabilidades familiares.",
        "Por los padres que luchan contra la pobreza.",
        "Por quienes cuidan a enfermos dependientes.",
        "Por los que han perdido su trabajo.",
        "Por quienes necesitan fortaleza ante las dificultades."
      ],
      [
        "Por quienes se encuentran en sus últimos momentos.",
        "Por las familias que lloran a sus difuntos.",
        "Por el perdón entre quienes se han herido.",
        "Por las víctimas de guerras y conflictos.",
        "Por quienes necesitan experimentar el amor de Cristo."
      ]
    ],
    "Gloriosos": [
      [
        "Por quienes han perdido la esperanza.",
        "Por las familias que viven un duelo.",
        "Por quienes desean comenzar una nueva vida.",
        "Por los cristianos que dudan de su fe.",
        "Por quienes necesitan experimentar la alegría pascual."
      ],
      [
        "Por quienes buscan alcanzar la santidad.",
        "Por los misioneros que anuncian a Cristo.",
        "Por quienes viven apegados a los bienes materiales.",
        "Por los cristianos llamados a dar testimonio.",
        "Por quienes anhelan la vida eterna."
      ],
      [
        "Por la unidad de la Iglesia.",
        "Por el Papa, los obispos y los sacerdotes.",
        "Por quienes necesitan sabiduría y discernimiento.",
        "Por los jóvenes que recibirán la confirmación.",
        "Por la renovación espiritual de nuestras comunidades."
      ],
      [
        "Por quienes esperan reunirse con sus seres queridos.",
        "Por las madres que sufren en silencio.",
        "Por quienes necesitan confiar en la vida eterna.",
        "Por los enfermos que invocan a la Virgen María.",
        "Por quienes buscan vivir con pureza de corazón."
      ],
      [
        "Por las familias consagradas a la Virgen María.",
        "Por quienes buscan la protección de nuestra Madre.",
        "Por la paz entre las naciones.",
        "Por los pecadores que necesitan conversión.",
        "Por nuestra perseverancia hasta el encuentro con Dios."
      ]
    ]
  };
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
  const allMysteryIntentions = Object.values(mysteryIntentions).flat(2);
  const defaultIntentions = [...initialIntentions,...allMysteryIntentions];
  state.intentionSelectionMode=saved.intentionSelectionMode==='random'?'random':'mystery';
  const existingIntentions = Array.isArray(saved.intentionPool)
    ? [...new Set(saved.intentionPool.filter(t=>typeof t==='string').map(t=>t.trim()).filter(Boolean))]
    : [...initialIntentions];
  // Ampliar la lista una sola vez en instalaciones existentes, conservando las
  // intenciones personales y respetando posteriores ediciones o eliminaciones.
  state.intentionPool = saved.intentionCatalogVersion===1
    ? existingIntentions.slice(0,200)
    : [...new Set([...existingIntentions,...allMysteryIntentions])].slice(0,200);
  state.intentionCatalogVersion=1;
  state.randomIntentionsEnabled = saved.randomIntentionsEnabled !== false;
  state.intentionCycle = Array.isArray(saved.intentionCycle) &&
    saved.intentionCycle.length === 5 ? saved.intentionCycle : [null,null,null,null,null];
  function intentionFor(m) {
    if (!state.randomIntentionsEnabled || !state.intentionPool.length) return '';
    const relevant=mysteryIntentions[state.group]?.[m] || [];
    const custom=state.intentionPool.filter(t=>!defaultIntentions.includes(t));
    const matched=state.intentionPool.filter(t=>relevant.includes(t)||custom.includes(t));
    const pool=state.intentionSelectionMode==='random'
      ? state.intentionPool : (matched.length?matched:state.intentionPool);
    const current=state.intentionCycle[m];
    if(current && pool.includes(current)) return current;
    const used=state.intentionCycle.filter((t,i)=>i!==m && pool.includes(t));
    const available=pool.filter(t=>!used.includes(t));
    const choices=available.length?available:pool;
    const choice=choices[Math.floor(Math.random()*choices.length)];
    state.intentionCycle[m]=choice;
    persist();
    return choice;
  }
  function resetIntentionCycle() {
    state.intentionCycle = [null,null,null,null,null];
    persist();
  }
  window.rosarioIntentionFor = intentionFor;
  window.rosarioResetIntentionCycle = resetIntentionCycle;

  function buildRosarySteps(legacy = false, legacySalvePosition = false,
                            salvePlacement = state.salvePosition) {
  // Estación, comunión espiritual y oraciones introductorias.
  const nextSteps = [];
  const addSalvePair=()=>{
    nextSteps.push({ title: 'Salve', m: 5 });
    nextSteps.push({ title: 'Ruega por nosotros', m: 5, kind: 'dialogue',
      verse: 'Ruega por nosotros, Santa Madre de Dios.',
      response: 'Para que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo. Amén.' });
  };
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
      verse: 'Virgen purísima y castísima, ' + occasion + ', hacednos, Señora, mansos, humildes, puros y castos.',
      response: 'En pensamientos, palabras y obras.'
    });
    nextSteps.push({
      title: 'Avemaría', m: 5, kind: 'dedication', dedication: i,
      text: originalAvemaria.replace('Dios te salve, María,', 'Dios te salve, María, ' + invocation + ',')
    });
  });
  // Alternativa: inmediatamente después de las tres Avemarías de
  // «Virgen purísima y castísima». Incluye su respuesta independiente.
  if (legacySalvePosition || salvePlacement==='after-dedication')
    addSalvePair();
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
    { name: 'La Iglesia y el Estado', intro: 'Por las necesidades de la Iglesia y el Estado:' },
    { name: 'Las intenciones', intro: 'Por la persona e intenciones del señor Obispo de esta Diócesis:' },
    { name: 'Las almas del purgatorio', intro: 'Por las benditas ánimas del purgatorio:' }
  ].forEach((intention, i) => {
    // Pantalla con el título y la lista inicialmente sin marcar.
    nextSteps.push({ title:'Intenciones finales',kind:'final-intention',m:5,
      intentionNumber:i,intention:intention.intro,text:intention.intro });
    // Cada avance marca la oración alcanzada, sin repetir su título
    // en el encabezado principal de la lectura.
    for (const title of ['Padrenuestro','Avemaría','Gloria']) {
      nextSteps.push({ title, m: 5, intentionNumber: i,
        intention: intention.intro });
    }
    if(i===2) nextSteps.push({ title: 'Descansen en paz',m:5,intentionNumber:i,
      text:'Las almas de todos los fieles difuntos, por la misericordia de Dios descansen en paz. Amén' });
  });
  // Posición tradicional de esta aplicación (predeterminada).
  if (!legacySalvePosition && salvePlacement!=='after-dedication')
    addSalvePair();
  nextSteps.push({title:'Avemaría purísima',kind:'dialogue',m:5,
    verse:'Ave María Purísima.',response:'Sin pecado original concebida.'});
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
  // La misma respuesta «Ruega por nosotros» también aparece tras
  // «Bajo tu amparo»: preservar exactamente la que se estaba rezando.
  function remapCurrentStep(previous,oldSteps,oldIndex){
    if(!previous)return steps.length;
    if(previous.title==='Ruega por nosotros'&&previous.m===5){
      const afterSalve=oldSteps[oldIndex-1]?.title==='Salve';
      return steps.findIndex((item,i)=>sameStep(item,previous)&&
        (steps[i-1]?.title==='Salve')===afterSalve);
    }
    return findStep(previous);
  }
  window.rosarioSetSalvePosition=value=>{
    if(!['final','after-dedication'].includes(value)||value===state.salvePosition)return;
    const oldSteps=steps;
    const oldIndex=state.index;
    const previous=oldSteps[oldIndex];
    state.salvePosition=value;
    steps=buildRosarySteps();
    const mapped=remapCurrentStep(previous,oldSteps,oldIndex);
    state.index=mapped>=0?mapped:Math.min(oldIndex,steps.length);
    state.sequenceVersion=12;
    persist();render();
  };
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
    state.sequenceVersion = 12;
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
  if (Number(saved.sequenceVersion) >= 12) {
    restoredIndex = Number(saved.index);
  } else if (Number(saved.sequenceVersion) === 11) {
    // La v0.1.54 trasladó la Salve al quinto Gloria. Al regresar a
    // la secuencia anterior, conservar la oración concreta y distinguir
    // las dos respuestas «Ruega por nosotros».
    const priorSteps=[...steps];
    const salveIndex=priorSteps.findIndex(s=>s.title==='Salve'&&s.m===5);
    if(salveIndex>=0){
      const salvePair=priorSteps.splice(salveIndex,2);
      const gloriaIndex=priorSteps.findIndex(s=>s.title==='Gloria'&&s.m===4);
      if(gloriaIndex>=0)priorSteps.splice(gloriaIndex+1,0,...salvePair);
    }
    const priorIndex=Math.max(0,Math.min(Number(saved.index)||0,priorSteps.length));
    const previous=priorSteps[priorIndex];
    if(!previous)restoredIndex=steps.length;
    else if(previous.title==='Ruega por nosotros'&&previous.m===5){
      const afterSalve=priorSteps[priorIndex-1]?.title==='Salve';
      restoredIndex=steps.findIndex((step,i)=>sameStep(step,previous)&&
        (steps[i-1]?.title==='Salve')===afterSalve);
    }else restoredIndex=findStep(previous);
  } else if (Number(saved.sequenceVersion) >= 10) {
    // Si llegó de la secuencia original, conservar su oración concreta.
    // Sólo cambia el índice cuando se haya elegido la Salve alternativa.
    const oldSteps=buildRosarySteps(false,false,'final');
    const oldIndex=Math.max(0,Math.min(Number(saved.index)||0,oldSteps.length));
    restoredIndex=state.salvePosition==='final'?oldIndex:
      remapCurrentStep(oldSteps[oldIndex],oldSteps,oldIndex);
  } else if (Number(saved.sequenceVersion) === 9) {
    // V9 no incluía pantallas de presentación de las intenciones.
    // Mapear por identidad de paso y no por índice para no desplazar
    // una oración guardada al insertar las tres nuevas pantallas.
    const oldSteps=steps.filter(item=>item.kind!=='final-intention');
    const oldIndex=Math.max(0,Math.min(Number(saved.index)||0,oldSteps.length));
    restoredIndex=oldIndex===oldSteps.length?steps.length:
      steps.indexOf(oldSteps[oldIndex]);
  } else if (Number(saved.sequenceVersion) === 8) {
    // V8 contenía una sola Avemaría por intención. Reconstruir ese
    // orden para conservar la oración actual sin desplazar el progreso.
    const oldSteps=steps.filter(item=>!
      (item.m===5&&Number.isInteger(item.intentionNumber)&&
       (item.title==='Padrenuestro'||item.title==='Gloria')));
    const oldIndex=Math.max(0,Math.min(Number(saved.index)||0,oldSteps.length));
    restoredIndex=oldIndex===oldSteps.length?steps.length:
      steps.indexOf(oldSteps[oldIndex]);
  } else if (Number(saved.sequenceVersion) === 7) {
    // V7 contenía los tríos de oraciones salvo el último Gloria.
    // Conservar esa misma secuencia anterior para remapear su índice.
    const oldSteps=steps.filter(item=>item.title!=='Avemaría purísima'&&
      !(item.m===5&&item.intentionNumber===2&&item.title==='Gloria'));
    const oldIndex=Math.max(0,Math.min(Number(saved.index)||0,oldSteps.length));
    const previous=oldSteps[oldIndex];
    if(!previous)restoredIndex=steps.length;
    else {
      restoredIndex=steps.findIndex(next=>
        next.title===previous.title&&next.m===previous.m&&
        next.n===previous.n&&next.kind===previous.kind&&
        next.stationNumber===previous.stationNumber&&
        next.dedication===previous.dedication&&
        next.litanyIndex===previous.litanyIndex&&
        next.intentionNumber===previous.intentionNumber);
      // Si estaba en un Padrenuestro o Gloria ahora eliminado,
      // continuar en la Avemaría de la intención correspondiente.
      if(restoredIndex<0&&Number.isInteger(previous.intentionNumber))
        restoredIndex=steps.findIndex(next=>next.m===5&&
          next.title==='Avemaría'&&
          next.intentionNumber===previous.intentionNumber);
      if(restoredIndex<0)restoredIndex=Math.min(oldIndex,steps.length);
    }
  } else if (Number(saved.sequenceVersion) === 6) {
    // Las mismas oraciones cambian de posición; conservar la oración
    // concreta y también distinguir las dos respuestas «Ruega».
    const old = buildRosarySteps(false, true);
    const index = Math.max(0,Math.min(Number(saved.index)||0,old.length));
    const previous = old[index];
    if (!previous) restoredIndex = steps.length;
    else {
      const occurrence = old.slice(0,index+1).filter(s=>sameStep(s,previous)).length;
      const isRuega = previous.title==='Ruega por nosotros' && previous.m===5;
      // La antigua respuesta posterior a la Salve era la primera;
      // ahora, tras trasladar el bloque al final, es la segunda.
      // La respuesta tras «Bajo tu amparo» realiza el movimiento inverso.
      const intendedOccurrence=isRuega?(occurrence===1?2:1):occurrence;
      let seen=0;
      restoredIndex=steps.findIndex(s=>{
        if(!sameStep(s,previous))return false;
        return ++seen===intendedOccurrence;
      });
      if(restoredIndex<0)restoredIndex=findStep(previous);
      if(restoredIndex<0)restoredIndex=Math.min(index,steps.length);
    }
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
  state.sequenceVersion = 12;
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
  // Dos presentaciones excluyentes, manteniendo la secuencia de oraciones.
  state.finalIntentionsDisplay = saved.finalIntentionsDisplay === 'prayers'
    ? 'prayers' : 'checklist';
  // Una sola opción visual controla las marcas Guía/Asamblea.
  const voiceTones=['white','gold','accent'];
  state.voiceGuideTone=voiceTones.includes(saved.voiceGuideTone)?saved.voiceGuideTone:'white';
  state.voiceAssemblyTone=voiceTones.includes(saved.voiceAssemblyTone)?saved.voiceAssemblyTone:'gold';
  const textTransitions=['fade','slide','soft','none'];
  state.textTransition=textTransitions.includes(saved.textTransition)?saved.textTransition:
    (saved.subtleBeadMotion===false?'none':'fade');
  // La barra y el botón compacto comparten ubicación configurada.
  state.controlsPosition = saved.controlsPosition === 'bottom' ? 'bottom' : 'top';
  function applyControlsPosition(){
    document.body.classList.toggle('controls-bottom',state.controlsPosition==='bottom');
  }
  applyControlsPosition();

  const mysterySingular = {
    Gozosos: 'gozoso', Dolorosos: 'doloroso',
    Gloriosos: 'glorioso', Luminosos: 'luminoso'
  };
  const announcement = step => {
    const ordinals = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'];
    return 'En el ' + ordinals[step.m] + ' misterio ' + mysterySingular[state.group] +
      ' contemplamos:\n\n' + groups[state.group][step.m] + '.';
  };
  state.prayerEdits=(saved.prayerEdits&&typeof saved.prayerEdits==='object'&&!Array.isArray(saved.prayerEdits))?saved.prayerEdits:{};
  function applyLitanyText(value){
    const pairs=String(value).split(/\n\s*\nCordero de Dios/)[0];
    const matches=[...pairs.matchAll(/℣\.\s*([^\n]+)\s*\n\s*℟\.\s*([\s\S]*?)(?=\n\s*\n℣\.|$)/g)];
    if(matches.length!==litanyPairs.length)return false;
    matches.forEach((m,i)=>{
      litanyPairs[i].verse=m[1].trim();
      litanyPairs[i].response=m[2].trim();
    });
    steps.filter(step=>step.kind==='litany').forEach(step=>{
      const pair=litanyPairs[step.litanyIndex];
      step.verse=pair.verse;step.response=pair.response;
    });
    return true;
  }
  function applyLambText(value){
    const paragraphs=String(value).trim().split(/\n\s*\n/);
    if(paragraphs.length!==3)return false;
    const pattern=/^(Cordero de Dios,\s*que quitas (?:el|los) pecados? del mundo,)\s*([\s\S]+)$/i;
    const parsed=paragraphs.map(t=>t.trim().match(pattern));
    if(parsed.some(match=>!match))return false;
    parsed.forEach((match,i)=>{
      lambLines[i]=paragraphs[i].trim();
      steps.filter(step=>step.title==='Cordero de Dios'&&step.part===i)
        .forEach(step=>{
          step.verse=match[1];step.response=match[2];step.text=lambLines[i];
        });
    });
    return true;
  }
  function resetLambText(){
    baseLambLines.forEach((line,i)=>{lambLines[i]=line;});
    steps.filter(step=>step.title==='Cordero de Dios').forEach(step=>{
      step.verse='Cordero de Dios, que quitas los pecados del mundo,';
      step.response=['perdónanos, Señor.','escúchanos, Señor.',
        'ten misericordia de nosotros.'][step.part];
      step.text=baseLambLines[step.part];
    });
  }
  if(state.prayerEdits['Cordero de Dios'])
    applyLambText(state.prayerEdits['Cordero de Dios']);
  function resetLitanyPairs(){
    baseLitanyPairs.forEach((pair,i)=>{
      litanyPairs[i].verse=pair.verse;
      litanyPairs[i].response=pair.response;
    });
    steps.filter(step=>step.kind==='litany').forEach(step=>{
      const pair=litanyPairs[step.litanyIndex];
      step.verse=pair.verse;step.response=pair.response;
    });
  }
  if(state.prayerEdits.Letanías)applyLitanyText(state.prayerEdits.Letanías);
  const defaultPrayerText=title=>title==='Señor mío Jesucristo'
    ?window.rosarioContritionText():prayers[title]||'';
  window.rosarioPrayerText=(title,step)=>{
    const key=title==='Señor mío Jesucristo'&&state.contritionVersion==='redentor'
      ?'Acto de contrición (Jesús, mi Señor y Redentor)':title;
    return Object.prototype.hasOwnProperty.call(state.prayerEdits,key)
      ?state.prayerEdits[key]:(step?.text||
          (step?.verse&&step?.response
            ?'℣. '+step.verse+'\n℟. '+step.response
            :defaultPrayerText(key)));
  };
  window.rosarioContritionChoices=[
    ['jesucristo','Señor mío Jesucristo'],
    ['redentor','Jesús, mi Señor y Redentor']
  ];
  window.rosarioSavePrayer=(title,text)=>{
    if(typeof text!=='string'||!title)return false;
    if(text.length>20000)return false;
    if(title==='Letanías'&&!applyLitanyText(text))return false;
    if(title==='Cordero de Dios'&&!applyLambText(text))return false;
    state.prayerEdits[title]=text;
    // Mantener el texto elegido para las futuras lecturas.
    persist();render();
    return true;
  };
  window.rosarioRestorePrayer=title=>{
    delete state.prayerEdits[title];
    if(title==='Letanías')resetLitanyPairs();
    if(title==='Cordero de Dios')resetLambText();
    persist();render();
  };
  window.rosarioSetContrition=key=>{
    if(key!=='redentor'&&key!=='jesucristo')return;
    state.contritionVersion=key;persist();render();
  };
  const stepText = step => {
    if (!step) return '';
    if (step.kind === 'mystery') return announcement(step);
    return window.rosarioPrayerText(step.title,step);
  };
  const rawRender = render;
  render = function () {
    const step = steps[state.index];
    document.body.dataset.voiceGuideTone=state.voiceGuideTone;
    document.body.dataset.voiceAssemblyTone=state.voiceAssemblyTone;
    document.body.classList.remove('subtle-bead-motion');
    if (step) {
      if (step.kind === 'mystery') prayers['Anuncio del misterio'] = announcement(step);
      if (step.kind === 'dialogue'&&!state.prayerEdits[step.title])
        prayers[step.title] = '℣. ' + step.verse + '\n℟. ' + step.response;
      if (step.kind === 'dialogue-group') prayers[step.title] = step.dialogues
        .map(part => '℣. ' + part.verse + '\n℟. ' + part.response).join('\n\n');
      if (step.title === 'Avemaría' && step.kind !== 'dedication') prayers.Avemaría = originalAvemaria;
      if (step.kind === 'final-intention') prayers[step.title]=step.intention;
      if ((step.kind === 'dedication' || step.kind === 'intention') &&
          !state.prayerEdits[step.title]) prayers[step.title] = step.text;
      if (step.title === 'Descansen en paz'&&!state.prayerEdits[step.title]) prayers[step.title] = step.text;
      if (step.kind === 'litany'&&!state.prayerEdits['Letanías']) {
        // La rueda gestiona cada invocación; el devocionario conserva
        // el texto completo en lugar de reemplazarlo por una sola.
        prayers['Letanías']=fullLitany;
      }
      if (step.title === 'Cordero de Dios'&&!state.prayerEdits['Cordero de Dios'])
        prayers['Cordero de Dios'] = lambLines.join('\n\n');
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
    meditationBox.innerHTML = '<button type="button" id="meditationToggle" aria-label="Leer meditación completa">Ver meditación</button>';
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
        ['℣.', step.verse, 'Versículo'],
        ['℟.', step.response, 'Respuesta']
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
      // El único grupo de controles es la barra principal.
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
      const text = window.rosarioMeditationText?.(state.group,m) ?? complete ?? meditations[state.group]?.[m] ?? '';
      show('<div class="meditation-dialog"><div class="meditation-kicker">Meditación · Misterio ' +
        (m+1) + '</div><h2 id="meditationTitle"></h2><div class="meditation-full" id="meditationFull"></div></div>');
      $('meditationTitle').textContent = groups[state.group][m];
      if (window.rosarioRenderMeditation) window.rosarioRenderMeditation($('meditationFull'),text);
      else $('meditationFull').textContent=text;
      // La edición está en Navegación > Misterios, no en la lectura.
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
    // La tarjeta dorada de la intención se crea dentro de #immersiveText.
    // No insertar un encabezado adicional que duplique esa tarjeta.
    const intentionPrayerNames=['Padrenuestro','Avemaría','Gloria'];
    function updateFinalIntentions(step){
      const visible=Number.isInteger(step?.intentionNumber)&&
        (step.kind==='final-intention'||intentionPrayerNames.includes(step.title));
      reading.classList.toggle('is-final-intention',visible);
    }
    function updateEnhancements() {
      const step = steps[state.index];
      updateFinalIntentions(step);
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
        $('litanyPrevious').textContent = i > 0 ?
          litanyPairs[i - 1].verse.replace(/,\s*$/,'') : '';
        $('litanyPrevious').disabled = i === 0;
        $('litanyNext').textContent = i < litanyLines.length - 1 ?
          litanyPairs[i + 1].verse.replace(/,\s*$/,'') : '';
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
      show('<div class="nav-tabs" role="tablist" aria-label="Secciones del rosario">' +
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
      function addPreviewRow(list,label,subtitle,go,active,previewTitle,previewContent,previewLabel='Leer',meditationIndex=null){
        const wrapper=document.createElement('div');
        wrapper.className='nav-entry';
        appendOption(wrapper,label,subtitle,go,active);
        const look=document.createElement('button');
        look.type='button';
        look.className='nav-preview-link';
        look.textContent=previewLabel+' ↗';
        look.setAttribute('aria-label',previewLabel+': '+previewTitle);
        look.onclick=()=>meditationIndex!==null?
          openMeditation(meditationIndex):openPreview(previewTitle,previewContent);
        const edit=document.createElement('button');
        edit.type='button';edit.className='nav-preview-link';
        edit.textContent='Editar';
        edit.setAttribute('aria-label','Editar oración: '+previewTitle);
        edit.onclick=()=>meditationIndex!==null?
          window.rosarioOpenMeditationEditor?.(state.group,meditationIndex):
          openPrayerEditor(previewTitle);
        wrapper.append(look,edit);
        list.append(wrapper);
      }
      function openPrayerEditor(title){
        const key=title==='Tres Avemarías'?'Avemaría':
          title==='Acto de contrición'?'Señor mío Jesucristo':title;
        const editingKey=key==='Señor mío Jesucristo'&&state.contritionVersion==='redentor'
          ?'Acto de contrición (Jesús, mi Señor y Redentor)':key;
        const matchingStep=steps.find(step=>step.title===key);
        const text=window.rosarioPrayerText?.(key,matchingStep)||prayers[key]||'';
        const list=$('navList'),detail=$('navDetail');
        savedScroll=list.scrollTop;
        list.hidden=true;detail.hidden=false;detail.replaceChildren();
        const back=document.createElement('button');
        back.className='nav-preview-back';back.type='button';
        back.textContent='← Volver a las oraciones';
        back.onclick=()=>{detail.hidden=true;list.hidden=false;list.scrollTop=savedScroll;};
        const heading=document.createElement('h3');heading.textContent=title;
        const note=document.createElement('p');
        note.textContent=key==='Letanías'
          ?'Conserva cada pareja ℣. y ℟. en el mismo orden; puedes corregir su texto y añadir saltos de párrafo.'
          :key==='Cordero de Dios'?
           'Conserva las tres invocaciones separadas por un párrafo en blanco.'
          :'Puedes corregir palabras, puntuación y saltos de párrafo. Los cambios se guardan sólo en este dispositivo.';
        const area=document.createElement('textarea');
        area.className='rosario-prayer-editor';area.rows=10;area.value=text;
        area.setAttribute('aria-label','Texto editable de '+title);
        const tools=document.createElement('div');tools.className='rosario-editor-actions';
        const save=document.createElement('button');save.type='button';save.textContent='Guardar cambios';
        save.onclick=()=>{
          if(window.rosarioSavePrayer(editingKey,area.value))openPrayerEditor(title);
          else alert('Revisa el formato de las invocaciones. Las letanías deben conservar las parejas ℣. y ℟.; el Cordero de Dios necesita tres estrofas.');
        };
        const restore=document.createElement('button');restore.type='button';
        restore.textContent='Restaurar original';
        restore.onclick=()=>{window.rosarioRestorePrayer(editingKey);openPrayerEditor(title);};
        tools.append(save,restore);
        detail.append(back,heading,note,area,tools);
      }
      function prayerPreview(title,step) {
        if(title==='Letanías')return state.prayerEdits.Letanías ?? fullLitany;
        if(title==='Cordero de Dios')return state.prayerEdits['Cordero de Dios'] ??
          lambLines.join('\n\n');
        if(title==='Tres Avemarías')return window.rosarioPrayerText('Avemaría');
        if(title==='Anuncio del misterio')return announcement({m:Math.max(0,Math.min(4,step?.m||0))});
        return window.rosarioPrayerText(title,step);
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
          mondayFirst.forEach(i => {
            const day=dayNames[i];
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
            },steps[state.index]?.m===i,name,full,'Meditación',i);
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
            ['Avemaría purísima', 'Antes de la bendición final'],
            ['Avemaría', 'Intenciones finales: Iglesia, intenciones y ánimas']
          ];
          titles.forEach(([title, subtitle]) => {
            const lookup = title === 'Tres Avemarías' ? 'Avemaría' : title;
            const positions = steps.map((item, i) => item.title === lookup &&
              (title !== 'Tres Avemarías' || item.kind === 'dedication') ? i : -1).filter(i => i >= 0);
            if (!positions.length) return;
            const closest = positions.find(i => i >= state.index) ?? positions[0];
            const display=title==='Jaculatoria'?'María, Madre de gracia':
              title==='Oración final'?'Oración':
              title==='Señor mío Jesucristo'?'Acto de contrición':title;
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
        } else if (selected === 'intentions') {
          const caption=document.createElement('p');
          caption.className='jac-intro';
          caption.textContent='Una intención antes de cada misterio. Elige si prefieres cualquier intención o las relacionadas con el misterio.';
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
          const modeRow=document.createElement('div');
          modeRow.className='rosario-inline-options';
          [['mystery','Según el misterio'],['random','Completamente aleatorias']].forEach(([value,label])=>{
            const option=document.createElement('label');
            const radio=document.createElement('input');
            radio.type='radio';radio.name='intentionSelectionMode';
            radio.value=value;radio.checked=state.intentionSelectionMode===value;
            radio.onchange=()=>{
              state.intentionSelectionMode=value;
              resetIntentionCycle();fill('intentions');render();
            };
            const caption=document.createElement('span');caption.textContent=label;
            option.append(radio,caption);modeRow.append(option);
          });
          list.append(modeRow);
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
          const backup=document.createElement('details');
          backup.className='intention-backup';
          const summary=document.createElement('summary');
          summary.textContent='Exportar';
          const backupPanel=document.createElement('div');
          backupPanel.className='intention-backup-panel';
          const exportButton=document.createElement('button');
          exportButton.type='button';
          exportButton.textContent='Descargar archivo JSON';
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
          const restoreLabel=document.createElement('label');
          restoreLabel.className='intention-backup-restore-label';
          restoreLabel.textContent='Restaurar copia';
          backupPanel.append(exportButton,restoreLabel,restore,restoreButton,feedback);
          backup.append(summary,backupPanel);
          list.append(backup);
        } else if (selected === 'voices') {
          const description=document.createElement('p');
          description.className='jac-intro';
          description.textContent='Personaliza las intervenciones del guía y la asamblea, independientemente del tema del rosario.';
          list.append(description);
          [
            ['voiceColors','Diferenciar las voces por color',
              'Guía y asamblea pueden conservar colores distintos.'],
            ['voiceLabels','Mostrar «Guía» y «Asamblea»',
              'Muestra sus nombres; habilita el Gloria especial y «saludamos» en la Salve.']
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
          [['voiceGuideTone','Color de Guía'],['voiceAssemblyTone','Color de Asamblea']].forEach(([key,label])=>{
            const field=document.createElement('label');
            field.className='rosario-tone-setting';
            const title=document.createElement('span');title.textContent=label;
            const control=document.createElement('select');
            [['white','Blanco / color del texto'],['gold','Dorado clásico'],
              ['accent','Color de acento del tema']].forEach(([value,name])=>{
              const option=document.createElement('option');option.value=value;
              option.textContent=name;control.append(option);
            });
            control.value=state[key];
            control.onchange=()=>{state[key]=control.value;persist();render();};
            field.append(title,control);list.append(field);
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
      const attachTabSwipe=surface=>{
        surface.addEventListener('touchstart',e=>{
          if(e.touches.length!==1||e.target.closest('textarea,input,select'))return;
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
      };
      // Ambos nodos se crean de nuevo al abrir el menú, así no se acumulan listeners.
      attachTabSwipe($('navList'));
      attachTabSwipe($('modal').querySelector('.nav-tabs'));
      fill(tab);
    }

    // Menú de navegación accesible desde Preferencias sin mostrar
    // otra lista interminable en la página principal.
    window.rosarioOpenNavigation=openNavigation;
    window.rosarioOpenVoiceSettings = () => openNavigation('voices');
    const animationOptions=[
      ['fade','Fundido','El texto desaparece y aparece con suavidad.'],
      ['slide','Deslizamiento','El nuevo texto aparece con un leve movimiento hacia arriba.'],
      ['soft','Enfoque','El texto aparece suavemente de un ligero desenfoque.'],
      ['none','Sin animación','Cambio inmediato de una oración a otra.']
    ];
    function openNavigationPreferences(container){
      const embedded=container?.nodeType===1;
      let root;
      if(embedded){
        root=document.createElement('div');
        root.className='rosario-nav-dialog';
        container.append(root);
      }else{
        show('<h2>Controles e interacción</h2><div class="rosario-nav-dialog" id="rosarioNavSettings"></div>');
        root=$('rosarioNavSettings');
      }
      const selectRow=(title,options,value,callback)=>{
        const row=document.createElement('label');row.className='rosario-nav-setting';
        const name=document.createElement('span');name.textContent=title;
        const control=document.createElement('select');
        options.forEach(([id,label])=>{
          const option=document.createElement('option');
          option.value=id;option.textContent=label;control.append(option);
        });
        control.value=value;control.onchange=()=>callback(control.value);
        row.append(name,control);root.append(row);
      };
      selectRow('Lado del Rosario completo',
        [['left','Izquierda'],['right','Derecha']],state.rosarySide,
        value=>window.rosarioSetSide?.(value));
      selectRow('Posición de los controles',
        [['top','Arriba'],['bottom','Abajo']],state.controlsPosition,
        value=>{
          state.controlsPosition=value;applyControlsPosition();persist();
        });
      const row=document.createElement('label');row.className='rosario-nav-setting';
      const label=document.createElement('span');
      label.textContent='Navegar tocando el fondo';
      const small=document.createElement('small');
      small.textContent='Arriba: oración anterior · Abajo: siguiente.';
      label.append(small);
      const check=document.createElement('input');
      check.type='checkbox';check.checked=state.screenTapNavigation===true;
      check.onchange=()=>{state.screenTapNavigation=check.checked;persist();render();};
      row.append(label,check);root.append(row);
      const swipeSection=document.createElement('section');
      swipeSection.className='rosario-swipe-settings';
      const swipeTitle=document.createElement('h3');
      swipeTitle.textContent='Sentido del deslizamiento';
      const swipeIntro=document.createElement('p');
      swipeIntro.textContent='Elige cómo avanzar deslizando sobre el texto.';
      const swipeOptions=document.createElement('div');
      swipeOptions.className='rosario-swipe-options';
      [
        {value:'follow',title:'Seguir el recorrido',
         hint:'Al llegar al arco superior, se invierte el gesto de avance.',
         arrows:['down','up']},
        {value:'uniform',title:'Siempre hacia arriba',
         hint:'El mismo gesto avanza durante todo el Rosario.',
         arrows:['up','up']},
        {value:'down',title:'Siempre hacia abajo',
         hint:'El mismo gesto hacia abajo avanza durante todo el Rosario.',
         arrows:['down','down']}
      ].forEach(choice=>{
        const card=document.createElement('label');
        card.className='rosario-swipe-choice';
        const input=document.createElement('input');
        input.type='radio';input.name='rosarioSwipeMode';
        input.value=choice.value;
        input.checked=state.rosarySwipeMode===choice.value;
        const details=document.createElement('span');
        details.className='rosario-swipe-choice-copy';
        const name=document.createElement('strong');
        name.textContent=choice.title;
        const hint=document.createElement('small');
        hint.textContent=choice.hint;
        details.append(name,hint);
        const tutorial=document.createElement('div');
        tutorial.className='rosario-swipe-tutorial';
        tutorial.setAttribute('aria-label',
          'Antes del arco: '+(choice.arrows[0]==='down'?'hacia abajo':'hacia arriba')+
          '; después del arco: '+(choice.arrows[1]==='down'?'hacia abajo':'hacia arriba'));
        choice.arrows.forEach((arrow,i)=>{
          const phase=document.createElement('span');
          phase.className='rosario-swipe-phase';
          const caption=document.createElement('span');
          caption.textContent=i===0?'Subiendo':'Tras el arco';
          const visual=document.createElement('span');
          visual.className='rosario-swipe-visual';
          visual.innerHTML='<svg viewBox="0 0 68 62" aria-hidden="true" focusable="false">'+
            '<path class="rosario-demo-thread" d="M18 8 C18 -1 50 -1 50 8 M18 8V58 M50 8V58"/>'+
            '<circle class="rosario-demo-bead" cx="'+(i?50:18)+'" cy="24" r="7"/>'+
            '<circle class="rosario-demo-bead" cx="'+(i?50:18)+'" cy="45" r="7"/>'+
            '<path class="rosario-demo-arrow '+(arrow==='down'?'is-down':'is-up')+
            '" d="'+(arrow==='down'?'M35 14V48 M27 40l8 8 8-8':'M35 48V14 M27 22l8-8 8 8')+'"/>'+
            '</svg>';
          phase.append(caption,visual);tutorial.append(phase);
        });
        input.onchange=()=>{
          if(!input.checked)return;
          state.rosarySwipeMode=choice.value;
          persist();
          swipeOptions.querySelectorAll('.rosario-swipe-choice').forEach(row=>
            row.classList.toggle('selected',row.querySelector('input').checked));
        };
        card.classList.toggle('selected',input.checked);
        card.append(input,details,tutorial);
        swipeOptions.append(card);
      });
      swipeSection.append(swipeTitle,swipeIntro,swipeOptions);
      root.append(swipeSection);
      const section=document.createElement('section');
      section.className='rosario-text-animation-settings';
      const heading=document.createElement('h3');
      heading.textContent='Transición del texto';
      const caption=document.createElement('p');
      caption.textContent='Se aplica al pasar de una Avemaría a otra.';
      const example=document.createElement('div');
      example.className='rosario-text-preview';
      const sample=document.createElement('p');
      sample.textContent='Dios te salve, María, llena eres de gracia.';
      example.append(sample);
      const options=document.createElement('div');
      options.className='rosario-animation-choices';
      const examples=[
        'Dios te salve, María, llena eres de gracia.',
        'Santa María, Madre de Dios, ruega por nosotros.'
      ];
      let exampleIndex=0;
      const replay=mode=>{
        const next=(exampleIndex+1)%examples.length;
        const replaceText=()=>{
          sample.textContent=examples[next];
          exampleIndex=next;
        };
        if(window.rosarioAnimateText)
          window.rosarioAnimateText(sample,mode,replaceText);
        else replaceText();
      };
      animationOptions.forEach(([value,title,description])=>{
        const item=document.createElement('label');
        item.className='rosario-animation-option';
        const radio=document.createElement('input');
        radio.type='radio';radio.name='rosarioTextTransition';
        radio.value=value;radio.checked=state.textTransition===value;
        const words=document.createElement('span');
        const name=document.createElement('strong');name.textContent=title;
        const hint=document.createElement('small');hint.textContent=description;
        words.append(name,hint);
        radio.onchange=()=>{
          state.textTransition=value;persist();render();
          replay(value);
        };
        item.append(radio,words);options.append(item);
      });
      const replayButton=document.createElement('button');
      replayButton.type='button';replayButton.className='rosario-preview-replay';
      replayButton.textContent='Reproducir ejemplo';
      replayButton.onclick=()=>replay(state.textTransition);
      section.append(heading,caption,example,options,replayButton);
      root.append(section);
      window.rosarioAndroidNavigationKeys?.(root);
      // El diálogo reutiliza un único contenedor desplazable entre pantallas.
      // Mantener la cabecera y el primer ajuste visibles al cambiar de sección.
      if(!embedded)$('modal').scrollTop=0;
    }
    window.rosarioRenderNavigationPreferences=host=>openNavigationPreferences(host);
    window.rosarioOpenNavigationPreferences=openNavigationPreferences;
    function openContritionChoice(){
      show('<h2>Acto de contrición</h2><div class="rosario-contrition-choices" id="contritionOptions"></div>');
      const root=$('contritionOptions');
      window.rosarioContritionChoices.forEach(([value,name])=>{
        const button=document.createElement('button');
        button.type='button';button.className='rosario-contrition-option';
        button.textContent=name;
        button.setAttribute('aria-pressed',String(state.contritionVersion===value));
        button.onclick=()=>{
          window.rosarioSetContrition(value);$('modal').close();
        };
        root.append(button);
      });
    }
    window.rosarioOpenContritionChoice=openContritionChoice;
    const originalSettings = $('settings').onclick;
    $('settings').onclick = () => {
      originalSettings();
      const host=$('modalContent');
      const group=(title,klass)=>{
        const root=document.createElement('section');
        root.className='rosario-preferences-group '+klass;
        const heading=document.createElement('h3');
        heading.textContent=title;
        root.append(heading);host.append(root);
        return root;
      };
      const interaction=group('Controles e interacción','rosario-interaction-group');
      // Los controles se muestran directamente dentro de su sección.
      const hapticRow=document.createElement('label');
      hapticRow.className='rosario-mystery-haptics';
      const hapticTitle=document.createElement('span');
      hapticTitle.textContent='Vibración al anunciar el misterio';
      const hapticChoice=document.createElement('select');
      hapticChoice.setAttribute('aria-label','Vibración al anunciar el misterio');
      [
        ['long','Larga · 1 segundo'],
        ['double','Dos vibraciones'],
        ['triple','Tres vibraciones']
      ].forEach(([value,name])=>{
        const option=document.createElement('option');
        option.value=value;
        option.textContent=name;
        hapticChoice.append(option);
      });
      hapticChoice.value=state.mysteryHapticMode||'long';
      hapticChoice.addEventListener('change',()=>{
        state.mysteryHapticMode=hapticChoice.value;
        persist();
        window.rosarioPreviewMysteryHaptic?.(hapticChoice.value);
      });
      hapticRow.append(hapticTitle,hapticChoice);
      // Intensidad de todos los patrones, con muestra háptica al cambiar.
      const intensityRow=document.createElement('label');
      intensityRow.className='rosario-haptic-intensity rosario-mystery-haptics';
      const intensityTitle=document.createElement('span');
      intensityTitle.textContent='Intensidad de la vibración';
      const intensityChoice=document.createElement('select');
      intensityChoice.setAttribute('aria-label','Intensidad de las vibraciones');
      [
        ['system','Del dispositivo'],
        ['soft','Suave'],
        ['medium','Media'],
        ['strong','Fuerte']
      ].forEach(([value,name])=>{
        const option=document.createElement('option');
        option.value=value;option.textContent=name;intensityChoice.append(option);
      });
      intensityChoice.value=state.hapticIntensity||'system';
      intensityChoice.onchange=()=>{
        state.hapticIntensity=intensityChoice.value;
        persist();
        rosarioVibrate(440,true);
      };
      intensityRow.append(intensityTitle,intensityChoice);
      // Orden común: interruptor, intensidad y patrón del misterio.
      $('vibration')?.closest('label')?.after(intensityRow,hapticRow);
      if ((/iPad|iPhone|iPod/.test(navigator.userAgent)||
           (navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1))&&
          !window.RosarioAndroid) {
        const iosNotice=document.createElement('p');
        iosNotice.className='rosario-haptic-compatibility';
        iosNotice.textContent='En iPhone, Safari y Chrome no ofrecen vibraciones web compatibles. Los patrones hápticos están disponibles en Android.';
        iosNotice.style.cssText='font:12px/1.55 system-ui;color:var(--ui-muted,#999);padding:0 12px 10px;margin:0';
        hapticRow.after(iosNotice);
      }
      const prayersGroup=group('Oraciones','rosario-prayer-settings-group');
      const contrition=document.createElement('label');
      contrition.className='rosario-tone-setting';
      const name=document.createElement('span');name.textContent='Acto de contrición';
      const choice=document.createElement('select');
      window.rosarioContritionChoices.forEach(([value,title])=>{
        const option=document.createElement('option');
        option.value=value;option.textContent=title;choice.append(option);
      });
      choice.value=state.contritionVersion;
      choice.onchange=()=>window.rosarioSetContrition(choice.value);
      contrition.append(name,choice);prayersGroup.append(contrition);
      const salveRow=document.createElement('label');
      salveRow.className='rosario-tone-setting';
      const salveName=document.createElement('span');
      salveName.textContent='Ubicación de la Salve';
      const salveChoice=document.createElement('select');
      salveChoice.setAttribute('aria-label','Ubicación de la Salve');
      [['final','Al finalizar las intenciones'],
       ['after-dedication','Después de las tres Avemarías']].forEach(([value,label])=>{
        const option=document.createElement('option');
        option.value=value;option.textContent=label;salveChoice.append(option);
      });
      salveChoice.value=state.salvePosition;
      salveChoice.onchange=()=>window.rosarioSetSalvePosition(salveChoice.value);
      salveRow.append(salveName,salveChoice);prayersGroup.append(salveRow);
      const intentionsDisplay=document.createElement('label');
      intentionsDisplay.className='rosario-tone-setting';
      const intentionsDisplayTitle=document.createElement('span');
      intentionsDisplayTitle.textContent='Intenciones finales';
      const intentionsDisplayChoice=document.createElement('select');
      intentionsDisplayChoice.setAttribute('aria-label','Formato de las intenciones finales');
      [['prayers','Oraciones completas'],['checklist','Lista con marcas']].forEach(([value,label])=>{
        const option=document.createElement('option');
        option.value=value;option.textContent=label;
        intentionsDisplayChoice.append(option);
      });
      intentionsDisplayChoice.value=state.finalIntentionsDisplay;
      intentionsDisplayChoice.onchange=()=>{
        state.finalIntentionsDisplay=intentionsDisplayChoice.value;
        persist();render();
      };
      intentionsDisplay.append(intentionsDisplayTitle,intentionsDisplayChoice);
      prayersGroup.append(intentionsDisplay);
      const voicesGroup=group('Participación','rosario-voice-settings-group');
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='voice-settings-link';
      btn.textContent='Configurar guía y asamblea';
      btn.onclick=()=>openNavigation('voices');
      voicesGroup.append(btn);
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
    alignButton.title='Alineación del texto';
    $('modal').querySelector('.close').after(alignButton);
    const alignNames={justify:'Justificado',left:'Izquierda',center:'Centrado',right:'Derecha'};
    const alignFeedback=document.createElement('div');
    alignFeedback.className='modal-alignment-feedback';
    alignFeedback.setAttribute('role','status');
    alignFeedback.setAttribute('aria-live','polite');
    alignFeedback.hidden=true;
    $('modal').append(alignFeedback);
    let alignmentFeedbackTimer;
    function updateModalAlign(){
      alignButton.innerHTML='<span class="text-align-icon" aria-hidden="true">Aa</span>';
      alignButton.dataset.align=state.textAlign;
      alignButton.setAttribute('aria-label','Alineación del texto: '+alignNames[state.textAlign]+'. Pulsar para cambiar.');
      alignButton.title='Alineación: '+alignNames[state.textAlign];
    }
    alignButton.onclick=()=>{
      state.textAlign=alignments[(alignments.indexOf(state.textAlign)+1)%alignments.length];
      applyAlignment();
      persist();
      updateModalAlign();
      alignFeedback.textContent='Alineación: '+alignNames[state.textAlign];
      alignFeedback.hidden=false;
      alignButton.classList.add('align-changed');
      clearTimeout(alignmentFeedbackTimer);
      alignmentFeedbackTimer=setTimeout(()=>{
        alignFeedback.hidden=true;
        alignButton.classList.remove('align-changed');
      },1700);
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
        option.textContent = name === 'Jaculatoria' ? 'María, Madre de gracia' :
          name === 'Oración final' ? 'Oración' : name;
        select.append(option);
      });
      const showSelectedPrayer = () => {
        const text=window.rosarioPrayerText(select.value) ||
          (select.value==='Letanías'?fullLitany:prayers[select.value]);
        $('reading').replaceChildren();
        if (window.rosaryFormatAmens) window.rosaryFormatAmens($('reading'), text);
        else $('reading').textContent = text;
      };
      const actions=document.createElement('div');
      actions.className='rosario-editor-actions';
      const editor=document.createElement('textarea');
      editor.className='rosario-prayer-editor';
      editor.rows=7;editor.hidden=true;
      const editBtn=document.createElement('button');
      editBtn.type='button';editBtn.textContent='Editar oración';
      const saveBtn=document.createElement('button');
      saveBtn.type='button';saveBtn.textContent='Guardar';saveBtn.hidden=true;
      const undoBtn=document.createElement('button');
      undoBtn.type='button';undoBtn.textContent='Restaurar original';undoBtn.hidden=true;
      const loadEditor=()=>{
        editor.value=window.rosarioPrayerText(select.value) || prayers[select.value] || '';
        editor.hidden=false;saveBtn.hidden=false;undoBtn.hidden=false;
        editBtn.hidden=true;
      };
      editBtn.onclick=loadEditor;
      saveBtn.onclick=()=>{
        if(window.rosarioSavePrayer(select.value,editor.value)){
          editor.hidden=saveBtn.hidden=undoBtn.hidden=true;
          editBtn.hidden=false;showSelectedPrayer();
        }else alert('Revisa el formato: conserva las parejas ℣. y ℟. de las letanías o las tres estrofas del Cordero de Dios.');
      };
      undoBtn.onclick=()=>{
        window.rosarioRestorePrayer(select.value);
        editor.hidden=saveBtn.hidden=undoBtn.hidden=true;
        editBtn.hidden=false;showSelectedPrayer();
      };
      actions.append(editBtn,saveBtn,undoBtn);
      $('reading').after(editor,actions);
      select.onchange=()=>{
        editor.hidden=saveBtn.hidden=undoBtn.hidden=true;
        editBtn.hidden=false;showSelectedPrayer();
      };
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