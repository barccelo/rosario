/* Lectura: anuncios, voces, Amén alineado y título de la decena activa. */
(() => {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const prayer = document.getElementById('immersiveText');
    const reading = document.querySelector('.immersive-prayer');
    if (!prayer || !reading) return;
    const sheet = document.createElement('link');
    sheet.rel = 'stylesheet';
    sheet.href = 'rosary-polish.css?v=20261015-7';
    document.head.append(sheet);

    const context = document.createElement('div');
    context.className = 'rosary-mystery-context';
    context.hidden = true;
    context.setAttribute('role', 'heading');
    context.setAttribute('aria-level', '2');
    context.innerHTML =
      '<div class="rosary-mystery-badge" id="rosaryMysteryRoman"></div>' +
      '<div class="rosary-mystery-name" id="rosaryMysteryName"></div>';
    document.querySelector('.rosary').append(context);

    function addPlain(container, value) {
      const text = String(value || '');
      const matcher = /Amén\.?/gi;
      let last = 0, match;
      while ((match = matcher.exec(text))) {
        const previous = text.slice(last, match.index).replace(/[ \t]+$/, '');
        if (previous) container.append(document.createTextNode(previous));
        const amen = document.createElement('span');
        amen.className = 'amen-line';
        amen.textContent = match[0];
        container.append(amen);
        last = matcher.lastIndex;
      }
      if (last < text.length)
        container.append(document.createTextNode(text.slice(last).replace(/^[ \t]+/, '')));
    }

    window.rosaryFormatAmens = (container, value) => {
      container.replaceChildren();
      addPlain(container, value);
    };

    function addVoicePart(text, role) {
      const span = document.createElement('span');
      span.className = 'prayer-part voice-' + role;
      const label = document.createElement('span');
      label.className = 'voice-label';
      label.textContent = role === 'guide' ? 'Guía' : 'Asamblea';
      span.append(label);
      addPlain(span, text);
      prayer.append(span);
    }
    function addDialogue(step) {
      prayer.replaceChildren();
      [['V/', step.verse], ['R/', step.response]].forEach(([mark, value]) => {
        const line = document.createElement('span');
        line.className = 'dialogue-line';
        const badge = document.createElement('span');
        badge.className = 'verse-mark';
        badge.textContent = mark;
        line.append(badge);
        addPlain(line, value);
        prayer.append(line);
      });
    }
    function addAnnouncement(step) {
      prayer.replaceChildren();
      const ordinal = ['primer', 'segundo', 'tercer', 'cuarto', 'quinto'][step.m];
      const adjective = {
        Gozosos:'gozoso', Dolorosos:'doloroso',
        Gloriosos:'glorioso', Luminosos:'luminoso'
      }[state.group];
      const label = document.createElement('span');
      label.className = 'mystery-announcement-label';
      label.textContent = ordinal + ' misterio ' + adjective;
      const name = document.createElement('span');
      name.className = 'mystery-announcement-name';
      name.textContent = groups[state.group][step.m];
      prayer.append(label, name);
    }

    const previousRender = render;
    render = function () {
      previousRender();
      const step = steps[state.index];
      const inDecade = step && step.m >= 0 && step.m < 5;
      const announced = inDecade && step.kind === 'mystery';
      reading.classList.toggle('is-mystery-announcement', !!announced);
      const headVisible = inDecade && !announced &&
        (step.title === 'Padrenuestro' || step.title === 'Avemaría');
      context.hidden = !headVisible;
      if (headVisible) {
        document.getElementById('rosaryMysteryRoman').textContent = ['I','II','III','IV','V'][step.m];
        document.getElementById('rosaryMysteryName').textContent = groups[state.group][step.m];
      }
      if (announced) addAnnouncement(step);
      else if (step?.kind !== 'litany' && step?.verse && step?.response) addDialogue(step);
      else if (step) {
        prayer.replaceChildren();
        const source = step.text || prayers[step.title] || '';
        const isVoice = inDecade && (step.title === 'Avemaría' || step.title === 'Padrenuestro');
        const parts = source.split(/\n\s*\n/);
        if (isVoice && parts.length > 1) {
          const firstRole = step.m % 2 === 0 ? 'guide' : 'assembly';
          addVoicePart(parts[0], firstRole);
          addVoicePart(parts.slice(1).join('\n\n'),
            firstRole === 'guide' ? 'assembly' : 'guide');
        } else addPlain(prayer, source);
      } else {
        prayer.replaceChildren();
        addPlain(prayer, 'Has terminado el rosario. Que la paz te acompañe.');
      }
      if (typeof updateReading === 'function') requestAnimationFrame(updateReading);
    };
    const readFull = document.getElementById('readFull');
    if (readFull) readFull.onclick = () => {
      const step = steps[state.index];
      if (!step) return;
      show('<h2 id="fullPrayerTitle"></h2><div id="fullPrayerText"></div>');
      document.getElementById('fullPrayerTitle').textContent = step.title;
      addPlain(document.getElementById('fullPrayerText'), step.text || prayers[step.title] || '');
    };
    render();
  });
})();
