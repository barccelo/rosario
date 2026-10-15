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
  const mysteryNames = {
    Gozosos: [
      'La Encarnación del Hijo de Dios',
      'La Visitación de Nuestra Señora a santa Isabel',
      'El Nacimiento del Hijo de Dios',
      'La Presentación de Jesús en el templo',
      'El Niño Jesús perdido y hallado en el templo'
    ],
    Luminosos: [
      'El Bautismo de Jesús en el Jordán',
      'La autorrevelación de Jesús en las bodas de Caná',
      'El anuncio del Reino de Dios y la llamada a la conversión',
      'La Transfiguración del Señor',
      'La institución de la Eucaristía'
    ],
    Dolorosos: [
      'La oración de Jesús en el huerto',
      'La flagelación del Señor',
      'La coronación de espinas',
      'Jesús con la cruz a cuestas',
      'La crucifixión y muerte de Jesús'
    ],
    Gloriosos: [
      'La Resurrección del Señor',
      'La Ascensión del Señor',
      'La venida del Espíritu Santo',
      'La Asunción de la Virgen María',
      'La Coronación de María como Reina del cielo y de la tierra'
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
    'Ruega por nosotros, Santa Madre de Dios.\n\nPara que seamos dignos de alcanzar las promesas de nuestro Señor Jesucristo.';
  prayers['Bajo tu amparo'] =
    'Bajo tu amparo nos acogemos, Santa Madre de Dios: no desprecies las súplicas que te dirigimos en nuestras necesidades; ' +
    'antes bien, líbranos siempre de todos los peligros, Virgen gloriosa y bendita.';
  prayers['Oración final'] =
    'Te suplicamos, Señor, que derrames tu gracia en nuestras almas, para que los que, por el anuncio del ángel, ' +
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
  const lambLines = [
    'Cordero de Dios, que quitas el pecado del mundo, perdónanos, Señor.',
    'Cordero de Dios, que quitas el pecado del mundo, escúchanos, Señor.',
    'Cordero de Dios, que quitas el pecado del mundo, ten misericordia de nosotros.'
  ];
  const fullLitany = litanyLines.join('\n\n') + '\n\n' + lambLines.join('\n\n');
  prayers['Letanías'] = fullLitany;
  prayers['Cordero de Dios'] = lambLines.join('\n\n');

  // Conservar el lugar correspondiente a la oración guardada antes de añadir pasos.
  const previousSteps = steps.slice();
  const previousIndex = Math.max(0, Math.min(Number(state.index) || 0, previousSteps.length));
  const previousStep = previousSteps[previousIndex];
  const nextSteps = [{ title: 'Señal de la cruz', m: -1 }];
  for (let m = 0; m < 5; m++) {
    nextSteps.push({ title: 'Anuncio del misterio', kind: 'mystery', m });
    nextSteps.push({ title: 'Padrenuestro', m, bead: m * 11 });
    for (let n = 1; n <= 10; n++) nextSteps.push({ title: 'Avemaría', m, n, bead: m * 11 + n });
    nextSteps.push({ title: 'Gloria', m });
    nextSteps.push({ title: 'Jaculatoria', m });
    nextSteps.push({ title: 'Alabanzas al Santísimo', m });
  }
  nextSteps.push({ title: 'Salve', m: 5 });
  nextSteps.push({ title: 'Ruega por nosotros', m: 5 });
  litanyLines.forEach((line, i) => nextSteps.push({
    title: 'Letanías', kind: 'litany', m: 5, text: line, litanyIndex: i
  }));
  lambLines.forEach((line, i) => nextSteps.push({
    title: 'Cordero de Dios', kind: 'final', m: 5, text: line, part: i
  }));
  nextSteps.push({ title: 'Bajo tu amparo', m: 5 });
  nextSteps.push({ title: 'Ruega por nosotros', m: 5 });
  nextSteps.push({ title: 'Oración final', m: 5 });
  steps = nextSteps;

  let restoredIndex;
  if (Number(saved.sequenceVersion) >= 3) {
    restoredIndex = Number(saved.index);
  } else if (!previousStep) {
    restoredIndex = steps.length;
  } else if (previousStep.title === 'Letanías') {
    restoredIndex = steps.findIndex(item => item.kind === 'litany');
  } else {
    restoredIndex = steps.findIndex(item =>
      item.title === previousStep.title && item.m === previousStep.m &&
      item.n === previousStep.n
    );
  }
  state.index = Number.isFinite(restoredIndex)
    ? Math.max(0, Math.min(restoredIndex, steps.length)) : 0;
  state.sequenceVersion = 3;
  if (saved.dayDate !== dateKey() || !Number.isInteger(saved.day)) {
    state.day = new Date().getDay();
    state.group = dayGroups[state.day];
  } else {
    state.day = saved.day;
    state.group = groups[saved.group] ? saved.group : (dayGroups[state.day] || dayGroups[new Date().getDay()]);
  }
  state.dayDate = dateKey();

  const announcement = step => {
    const ordinals = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'];
    return 'En el ' + ordinals[step.m] + ' misterio ' + state.group.toLowerCase() +
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
      if (step.kind === 'litany') prayers['Letanías'] = step.text;
      if (step.title === 'Cordero de Dios') prayers['Cordero de Dios'] = step.text;
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
      '<div class="wheel-current" aria-live="polite">' +
      '<div class="wheel-main" id="litanyCurrent"></div>' +
      '<div class="wheel-response" id="litanyResponse"></div>' +
      '<div class="wheel-progress" id="litanyProgress"></div></div>' +
      '<button type="button" class="wheel-side" id="litanyNext" aria-label="Letanía siguiente"></button>';
    reading.insertBefore(wheel, $('immersiveCount'));
    const meditationBox = document.createElement('div');
    meditationBox.className = 'meditation-tools';
    meditationBox.hidden = true;
    meditationBox.innerHTML = '<button type="button" id="meditationToggle" aria-expanded="false">Ver meditación ⌄</button>' +
      '<div class="meditation-copy" id="meditationCopy" hidden></div>';
    reading.insertBefore(meditationBox, $('immersiveCount'));
    let openMeditationAt = -1;

    function litanyLabel(line) {
      return line.replace(/, ruega por nosotros\.$/, '');
    }
    function goTo(index) {
      state.index = Math.max(0, Math.min(index, steps.length));
      openMeditationAt = -1;
      render();
      if ($('modal').open) $('modal').close();
      const toolbar = document.querySelector('.prayer-toolbar');
      if (toolbar) toolbar.hidden = true;
    }
    $('litanyPrevious').onclick = () => {
      if (steps[state.index - 1]?.kind === 'litany') goTo(state.index - 1);
    };
    $('litanyNext').onclick = () => {
      if (steps[state.index + 1]?.kind === 'litany') goTo(state.index + 1);
      else advance();
    };
    $('meditationToggle').onclick = () => {
      openMeditationAt = openMeditationAt === state.index ? -1 : state.index;
      updateEnhancements();
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
      if (isLitany) {
        const i = step.litanyIndex;
        const line = litanyLines[i];
        const name = litanyLabel(line);
        $('litanyCurrent').textContent = name === line ? line : name;
        $('litanyResponse').textContent = name === line ? '' : 'Ruega por nosotros.';
        $('litanyProgress').textContent = (i + 1) + ' / ' + litanyLines.length;
        $('litanyPrevious').textContent = i > 0 ? litanyLabel(litanyLines[i - 1]) : '';
        $('litanyPrevious').disabled = i === 0;
        $('litanyNext').textContent = i < litanyLines.length - 1 ? litanyLabel(litanyLines[i + 1]) : '';
        $('litanyNext').disabled = i === litanyLines.length - 1;
      }
      if (isAnnouncement) {
        const expanded = openMeditationAt === state.index;
        $('meditationToggle').textContent = expanded ? 'Ocultar meditación ⌃' : 'Ver meditación ⌄';
        $('meditationToggle').setAttribute('aria-expanded', String(expanded));
        $('meditationCopy').hidden = !expanded;
        $('meditationCopy').textContent = expanded ? meditations[state.group][step.m] : '';
      }
      // Mientras se anuncian los misterios, centrar la cuenta de su decena.
      if (isAnnouncement && typeof chain !== 'undefined') {
        const bead = step.m * 11;
        const w = document.documentElement.clientWidth;
        const h = window.innerHeight;
        const track = chain.querySelector('.chain-track');
        if (track) track.style.transform =
          'translate(' + (Math.min(w * .22, 220) - 89) + 'px,' + (h / 2 - point(bead).y) + 'px)';
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
    }

    function openNavigation(tab = 'days') {
      show('<h2>Navegar por el rosario</h2>' +
        '<div class="nav-tabs" role="tablist" aria-label="Secciones del rosario">' +
        '<button type="button" data-nav="days" role="tab">Días</button>' +
        '<button type="button" data-nav="mysteries" role="tab">Misterios</button>' +
        '<button type="button" data-nav="prayers" role="tab">Oraciones</button></div>' +
        '<div class="nav-list" id="navList"></div>');
      function fill(selected) {
        $('modal').querySelectorAll('[data-nav]').forEach(btn => {
          btn.setAttribute('aria-selected', String(btn.dataset.nav === selected));
        });
        const list = $('navList');
        list.replaceChildren();
        if (selected === 'days') {
          dayNames.forEach((day, i) => {
            appendOption(list, day, 'Misterios ' + dayGroups[i].toLowerCase(), () => {
              state.day = i;
              state.group = dayGroups[i];
              state.dayDate = dateKey();
              goTo(steps.findIndex(item => item.kind === 'mystery'));
            }, state.day === i);
          });
        } else if (selected === 'mysteries') {
          groups[state.group].forEach((name, i) => {
            appendOption(list, (i + 1) + '. ' + name, state.group + ' · Meditación opcional', () => {
              goTo(steps.findIndex(item => item.kind === 'mystery' && item.m === i));
            }, steps[state.index]?.m === i);
          });
        } else {
          const titles = [
            ['Señal de la cruz', 'Inicio'],
            ['Anuncio del misterio', 'Antes de cada decena'],
            ['Padrenuestro', 'Cada decena'],
            ['Avemaría', 'Diez veces por misterio'],
            ['Gloria', 'Al terminar la decena'],
            ['Jaculatoria', 'María, Madre de gracia'],
            ['Alabanzas al Santísimo', 'Después de la jaculatoria'],
            ['Salve', 'Oración final de los cinco misterios'],
            ['Ruega por nosotros', 'Respuesta a la Virgen'],
            ['Letanías', 'Una invocación por deslizamiento'],
            ['Cordero de Dios', 'Tres peticiones'],
            ['Bajo tu amparo', 'Oración a la Virgen'],
            ['Oración final', 'Conclusión']
          ];
          titles.forEach(([title, subtitle]) => {
            const positions = steps.map((item, i) => item.title === title ? i : -1).filter(i => i >= 0);
            const closest = positions.find(i => i >= state.index) ?? positions[0];
            appendOption(list, title === 'Jaculatoria' ? 'María, Madre de gracia' : title, subtitle, () => goTo(closest),
              steps[state.index]?.title === title);
          });
        }
      }
      $('modal').querySelectorAll('[data-nav]').forEach(button => {
        button.onclick = () => fill(button.dataset.nav);
      });
      fill(tab);
    }

    // El menú reemplaza el atajo aislado a los misterios: días, misterios y oraciones.
    const navButton = $('iMysteries');
    navButton.textContent = 'Navegar';
    navButton.setAttribute('aria-label', 'Abrir menú de días, misterios y oraciones');
    navButton.onclick = () => openNavigation('days');
    $('allMysteries').onclick = () => openNavigation('mysteries');

    // El devocionario conserva las letanías completas como texto de consulta.
    $('prayers').onclick = () => {
      const options = Object.keys(prayers).filter(name => name !== 'Anuncio del misterio');
      show('<h2>Oraciones</h2><select id="prayerSelect"></select>' +
        '<div class="prayer" id="reading"></div>' +
        '<p><a href="https://press.vatican.va/special/rosary/documents/litanie-lauretane_sp.html" target="_blank" rel="noopener">Letanías de referencia · Santa Sede ↗</a></p>');
      const select = $('prayerSelect');
      options.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name === 'Jaculatoria' ? 'María, Madre de gracia' : name;
        select.append(option);
      });
      const showSelectedPrayer = () => {
        $('reading').textContent = select.value === 'Letanías' ? fullLitany :
          select.value === 'Cordero de Dios' ? lambLines.join('\n\n') : prayers[select.value];
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
        render();
      }
    });
    render();
  });
})();