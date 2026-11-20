// Schedule component: the pretalx program as a mobile-first list, mounted into
// <div data-c26-schedule> (schedule.html). Two public pretalx exports are merged: the widget
// feed (breaks, tracks, avatars) and the c3voc-style export (abstracts, speaker bios).
// Loaded live on every visit and refreshed every few minutes while the page is open; the last
// good copy is kept in this browser and shown when pretalx can't be reached.
(() => {
  const host = document.querySelector('[data-c26-schedule]');
  if (!host) return;
  const EVENT = 'https://pretalx.com/compute-paris-2026/';
  const SRC = {
    widget: EVENT + 'schedule/widgets/schedule.json',
    full:   EVENT + 'schedule/export/schedule.json',
  };
  const KEEP = 'c26-schedule-copy', REFRESH = 5 * 60000;
  const TZ = 'Europe/Paris';
  // pretalx room names → the hotel's spaces (route = the venue page's place id, for "Show on the venue map")
  const ROOMS = {
    'Auditorium': {name: 'Track 1 · Amphitheater', where: 'Ground floor', route: 'amphi'},
    'Room 1': {name: 'BoF room · Salon 1', where: '1st floor', route: 'bof'},
    'Room 2': {name: 'Track 2 · Salon 3', where: '1st floor', route: 'track2'},
    'Room 3': {name: 'Track 3 · Salon 2', where: '1st floor', route: 'track3'},
    'Salle panoramique': {name: 'Sprints · Salon Panoramique', where: '3rd floor', route: 'sprints'},
    'Guinguette': {name: 'La Guinguette des Maquereaux', where: 'island in the harbor, in front of the hotel'},
  };
  // Events that are not in pretalx
  const LOCAL = [
    {id: 'guinguette', title: 'Evening at the guinguette', start: '2026-11-25T18:30:00+01:00', end: '2026-11-25T22:00:00+01:00', room: 'Guinguette', type: 'Social',
     abstract: 'After the first day, join us at La Guinguette des Maquereaux, on the little island in the harbor right in front of the hotel (Square Tino Rossi, Port de Plaisance), from 18:30 to 22:00.'},
  ];
  const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const tx = v => (v && typeof v === 'object') ? (v.en ?? Object.values(v)[0] ?? '') : (v ?? '');
  const fmt = o => new Intl.DateTimeFormat('en-GB', {timeZone: TZ, ...o});
  const hm = fmt({hour: '2-digit', minute: '2-digit'});
  const dayKey = fmt({year: 'numeric', month: '2-digit', day: '2-digit'});
  const keyOf = d => dayKey.formatToParts(d).filter(p => p.type !== 'literal').map(p => p.value).reverse().join('-');   // dd/mm/yyyy → yyyy-mm-dd
  const wd = fmt({weekday: 'short'}), dnum = fmt({day: 'numeric'}), mon = fmt({month: 'short'}), full = fmt({weekday: 'long', day: 'numeric', month: 'long'});

  let talks = [], days = [], curDay = null, onlySaved = false, curRoom = '', curTopic = '';
  let saved = new Set();
  try { saved = new Set(JSON.parse(localStorage.getItem('c26-saved') || '[]')); } catch (e) {}
  const persist = () => { try { localStorage.setItem('c26-saved', JSON.stringify([...saved])); } catch (e) {} };

  /* ---------- skeleton ---------- */
  host.classList.add('c26');
  host.innerHTML = `
    <div class="c26-view" role="group" aria-label="Schedule view">
      <button type="button" data-view="list" aria-pressed="true">List</button>
      <button type="button" data-view="grid" aria-pressed="false" title="The pretalx widget: all rooms side by side">pretalx grid</button>
    </div>
    <div class="c26-sbar">
      <div class="c26-days" role="tablist" aria-label="Day"></div>
      <div class="c26-filters">
        <button type="button" class="c26-chip" data-saved aria-pressed="false">★ My schedule</button>
        <select class="c26-chip c26-chip--sel" data-room aria-label="Room"><option value="">All rooms</option></select>
        <select class="c26-chip c26-chip--sel" data-topic aria-label="Track or tag"><option value="">All topics</option></select>
        <a class="c26-chip c26-chip--link" href="${EVENT}schedule/" target="_blank" rel="noopener" title="Full schedule on pretalx" aria-label="Full schedule on pretalx">pretalx ↗</a>
      </div>
    </div>
    <div class="c26-list"><p class="c26-empty">Loading the schedule…</p></div>
    <div class="c26-grid" hidden></div>
    <p class="c26-src"></p>`;
  const $ = s => host.querySelector(s);
  const bar = $('.c26-sbar'), list = $('.c26-list');
  const dlg = document.createElement('dialog');
  dlg.className = 'c26 c26-sheet'; dlg.setAttribute('aria-labelledby', 'c26-talk-title');
  dlg.innerHTML = '<div class="c26-sheet__inner"></div>';
  document.body.appendChild(dlg);
  // sticky time headers sit just under the (variable-height) filter bar
  new ResizeObserver(() => host.style.setProperty('--c26-bar-h', bar.offsetHeight + 'px')).observe(bar);

  /* ---------- data ---------- */
  const getJson = async url => { const r = await fetch(url, {cache: 'no-cache'}); if (!r.ok) throw new Error(r.status); return r.json(); };
  // live from pretalx; if that fails, the copy this browser saved last time
  async function fetchData() {
    try {
      const [w, f] = await Promise.all([getJson(SRC.widget), getJson(SRC.full).catch(() => null)]);
      try { localStorage.setItem(KEEP, JSON.stringify({w, f, at: Date.now()})); } catch (e) {}   // full storage: just don't keep a copy
      return {w, f, at: Date.now(), live: true};
    } catch (e) {
      const kept = JSON.parse(localStorage.getItem(KEEP) || 'null');
      if (!kept) throw e;
      return {...kept, live: false};
    }
  }
  function merge(w, f) {
    const roomName = Object.fromEntries((w.rooms || []).map(r => [r.id, tx(r.name)]));
    const tracks = Object.fromEntries((w.tracks || []).map(t => [t.id, {name: tx(t.name), color: t.color}]));
    const tags = Object.fromEntries((w.tags || []).map(t => [t.id, {name: tx(t.name ?? t.tag), color: t.color}]));
    const spk = Object.fromEntries((w.speakers || []).map(s => [s.code, s]));
    const extra = {};
    (f?.schedule?.conference?.days || []).forEach(d => Object.values(d.rooms).flat().forEach(e => { extra[e.code] = e; }));
    return (w.talks || []).map(t => {
      const x = extra[t.code] || {};
      const persons = (t.speakers || []).map(c => {
        const p = (x.persons || []).find(p => p.code === c) || {}, s = spk[c] || {};
        return {name: s.name || p.public_name || p.name || '', avatar: s.avatar_thumbnail_default || s.avatar || p.avatar || null, bio: p.biography || ''};
      });
      const start = new Date(t.start);
      return {
        id: t.code || 'b' + t.id, title: tx(t.title), start, end: new Date(t.end),
        room: roomName[t.room] || '', brk: t.slot_type === 'break' || !t.code,
        track: tracks[t.track] || null, tags: (t.tags || []).map(id => tags[id]).filter(Boolean), type: x.type || '', abstract: x.abstract || t.abstract || '',
        description: x.description || '', persons, url: x.url || (t.code ? EVENT + 'talk/' + t.code + '/' : null), day: keyOf(start),
      };
    }).sort((a, b) => a.start - b.start || a.room.localeCompare(b.room))
      // pretalx repeats a break once per room: keep one, not tied to a room
      .filter((t, i, all) => !t.brk || all.findIndex(o => o.brk && o.title === t.title && +o.start === +t.start && +o.end === +t.end) === i)
      .map(t => t.brk ? {...t, room: ''} : t);
  }

  /* ---------- rendering ---------- */
  // Plain text with blank-line paragraphs; links made clickable. Input is escaped first.
  function prose(s) {
    if (!s || /^\s*tbc\.?\s*$/i.test(s)) return '';
    return s.trim().split(/\n\s*\n/).map(p => '<p>' + esc(p).replace(/\n/g, '<br>')
      .replace(/https?:\/\/[^\s<]+[^\s<.,;:!?)\]]/g, u => `<a href="${u}" target="_blank" rel="noopener">${u}</a>`) + '</p>').join('');
  }
  // dark or white text, whichever reads better on a tag colour from pretalx
  const ink = hex => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '#fff'; const n = parseInt(m[1], 16), l = (.299 * (n >> 16) + .587 * (n >> 8 & 255) + .114 * (n & 255)) / 255; return l > .6 ? '#111827' : '#fff'; };
  // Birds of a Feather: open discussions, marked differently from talks and selectable in the topic filter
  const FORMAT_BOF = 'format:bof', isBof = t => /^bof$|birds of a feather/i.test(t.type || '');
  const roomLabel = r => ROOMS[r] ? ROOMS[r].name : r;
  const who = t => t.persons.map(p => p.name).filter(Boolean).join(', ');

  const ALL = 'all';   // day tab showing the whole program, one day below the other
  function render() {
    const now = new Date();
    // breaks shorter than 10 min ("Room Change") are noise on a phone
    let items = talks.filter(t => (curDay === ALL || t.day === curDay) && !(t.brk && t.end - t.start < 600000));
    if (curRoom) items = items.filter(t => t.room === curRoom || (t.brk && !t.room));
    if (curTopic) items = items.filter(t => t.brk || (curTopic === FORMAT_BOF ? isBof(t) : t.track?.name === curTopic || (t.tags || []).some(g => g.name === curTopic)));
    if (onlySaved) items = items.filter(t => saved.has(t.id));
    if (!items.length) { list.innerHTML = `<p class="c26-empty">${onlySaved ? `Nothing saved ${curDay === ALL ? '' : 'for this day '}yet. Tap ☆ on a talk to add it here.` : 'Nothing scheduled.'}</p>`; return; }
    const slots = [];
    items.forEach(t => { const k = +t.start; let s = slots.find(s => s.k === k); if (!s) slots.push(s = {k, start: t.start, items: []}); s.items.push(t); });
    let lastDay = null;
    list.innerHTML = slots.map(s => {
      // All days: a heading where a new day starts
      const day = keyOf(s.start), head = curDay === ALL && day !== lastDay ? `<h3 class="c26-dayh">${esc(full.format(s.start))}</h3>` : '';
      lastDay = day;
      const end = new Date(Math.max(...s.items.map(t => +t.end)));
      const cls = (now >= s.start && now < end ? ' is-now' : now >= end ? ' is-past' : '') + (s.items.every(t => t.brk) ? ' c26-slot--brk' : '');
      return head + `<div class="c26-slot${cls}"><div class="c26-slot__t">${curDay === ALL ? `<span class="wd">${esc(wd.format(s.start))}</span> ` : ''}${hm.format(s.start)}<small>${hm.format(end)}</small></div><div class="c26-slot__items">` +
        s.items.map(t => t.brk
          ? `<div class="c26-brk"><b>${esc(t.title)}</b><span>${hm.format(t.start)}–${hm.format(t.end)}</span></div>`
          : `<div class="c26-talk${isBof(t) ? ' c26-talk--bof' : ''}" role="button" tabindex="0" data-id="${esc(t.id)}" style="${t.track ? `--tc:${esc(t.track.color)}` : ''}">
              <span class="c26-talk__title">${esc(t.title)}</span>
              ${who(t) ? `<span class="c26-talk__who">${esc(who(t))}</span>` : ''}
              <span class="c26-talk__meta">${t.type === 'Keynote' ? '<span class="kn">Keynote</span>' : isBof(t) ? '<span class="bof">Birds of a Feather</span>' : t.type && t.type !== 'Talk' ? `<span>${esc(t.type)}</span>` : ''}<span class="room">${esc(roomLabel(t.room))}</span><span>${Math.round((t.end - t.start) / 60000)} min</span>${t.track ? `<span>${esc(t.track.name)}</span>` : ''}${(t.tags || []).map(g => `<span class="tag" style="--gc:${esc(g.color || '#14274E')};--gt:${ink(g.color)}">${esc(g.name)}</span>`).join('')}</span>
              <button class="c26-star" type="button" aria-pressed="${saved.has(t.id)}" aria-label="Save to my schedule" data-star="${esc(t.id)}">${saved.has(t.id) ? '★' : '☆'}</button>
            </div>`).join('') + `</div></div>`;
    }).join('');
  }
  function renderDays() {
    $('.c26-days').innerHTML = days.map(d => { const dt = new Date(d + 'T12:00:00Z'); return `<button type="button" role="tab" data-day="${d}" aria-selected="${d === curDay}"><b>${wd.format(dt)} ${dnum.format(dt)}</b><small>${mon.format(dt)}${talks.some(t => t.day === d && /sprint/i.test(t.title)) ? ' · sprints' : ''}</small></button>`; }).join('')
      + `<button type="button" role="tab" data-day="${ALL}" aria-selected="${curDay === ALL}"><b>All days</b><small>${days.length} days</small></button>`;
  }

  function open(id) {
    const t = talks.find(x => x.id === id); if (!t) return false;
    const r = ROOMS[t.room];
    dlg.firstChild.innerHTML = `
      <div class="c26-sheet__head"><h2 id="c26-talk-title">${esc(t.title)}</h2><button class="c26-sheet__close" type="button" data-close aria-label="Close">✕</button></div>
      <div class="c26-sheet__when"><span><b>${esc(full.format(t.start))}</b></span><span>${hm.format(t.start)}–${hm.format(t.end)}</span><span>${esc(roomLabel(t.room))}${r ? ` · ${esc(r.where)}` : ''}</span>${t.type ? `<span>${esc(t.type)}</span>` : ''}${t.track ? `<span style="color:${esc(t.track.color)}">● ${esc(t.track.name)}</span>` : ''}${(t.tags || []).map(g => `<span style="color:${esc(g.color || '#14274E')}">● ${esc(g.name)}</span>`).join('')}</div>
      <div class="c26-sheet__actions">
        <button class="c26-btn${saved.has(t.id) ? '' : ' c26-btn--ghost'}" type="button" data-star="${esc(t.id)}">${saved.has(t.id) ? '★ Saved' : '☆ Save'}</button>
        ${r && r.route ? `<a class="c26-btn c26-btn--ghost" href="venue.html#inside/${r.route}">Show on the venue map</a>` : ''}
        ${t.url ? `<a class="c26-btn c26-btn--ghost" href="${esc(t.url)}" target="_blank" rel="noopener">pretalx ↗</a>` : ''}
      </div>
      ${prose(t.abstract) || prose(t.description) ? `<div class="c26-sheet__txt">${prose(t.abstract)}${prose(t.description)}</div>` : ''}
      ${t.persons.map(p => `<div class="c26-spk">${p.avatar ? `<img src="${esc(p.avatar)}" alt="" loading="lazy">` : `<span class="ph">${esc((p.name || '?')[0])}</span>`}<h3>${esc(p.name)}</h3>${prose(p.bio)}</div>`).join('')}`;
    if (!dlg.open) dlg.showModal();
    dlg.firstChild.scrollTop = 0;
    history.replaceState(null, '', '#talk/' + id);
    return true;
  }
  function toggle(id) {
    saved.has(id) ? saved.delete(id) : saved.add(id); persist(); render();
    if (dlg.open) open(id);
  }

  /* ---------- events ---------- */
  $('.c26-days').addEventListener('click', e => {
    const b = e.target.closest('[data-day]'); if (!b) return;
    curDay = b.dataset.day; renderDays(); render();
    // back to the start of the new day, just below the fixed site nav (explicit scrollTo: works the same in every browser)
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    const top = host.getBoundingClientRect().top + scrollY - navH;
    if (scrollY > top) scrollTo({top, behavior: 'instant'});
  });
  $('[data-saved]').addEventListener('click', e => { onlySaved = !onlySaved; e.currentTarget.setAttribute('aria-pressed', onlySaved); render(); });
  $('[data-room]').addEventListener('change', e => { curRoom = e.target.value; render(); });
  $('[data-topic]').addEventListener('change', e => { curTopic = e.target.value; render(); });
  // View switch: our list, or the original pretalx widget (all rooms side by side), loaded only when asked for
  let gridLoaded = false;
  $('.c26-view').addEventListener('click', e => {
    const b = e.target.closest('[data-view]'); if (!b) return;
    const on = b.dataset.view === 'grid';
    host.querySelectorAll('[data-view]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    host.classList.toggle('is-grid', on);
    $('.c26-grid').hidden = !on; list.hidden = on; bar.hidden = on;
    if (on && !gridLoaded) {
      gridLoaded = true;
      $('.c26-grid').innerHTML = `<pretalx-schedule event-url="${EVENT}" locale="en" format="grid" style="--pretalx-clr-primary: #eac535"></pretalx-schedule>`;
      const sc = document.createElement('script'); sc.src = EVENT + 'widgets/schedule.js'; document.head.appendChild(sc);
    }
  });
  list.addEventListener('click', e => {
    const s = e.target.closest('[data-star]'); if (s) { e.stopPropagation(); toggle(s.dataset.star); return; }
    const t = e.target.closest('.c26-talk'); if (t) open(t.dataset.id);
  });
  list.addEventListener('keydown', e => { const t = e.target.closest('.c26-talk'); if (t && e.target === t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(t.dataset.id); } });
  dlg.addEventListener('click', e => {
    if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
    const s = e.target.closest('[data-star]'); if (s) toggle(s.dataset.star);
  });
  dlg.addEventListener('close', () => { if (location.hash.startsWith('#talk/')) history.replaceState(null, '', location.pathname + location.search); });

  /* ---------- load ---------- */
  const hhmm = new Intl.DateTimeFormat('en-GB', {weekday: 'short', hour: '2-digit', minute: '2-digit'});
  function apply(d) {
    talks = merge(d.w, d.f).concat(LOCAL.map(e => { const start = new Date(e.start); return {...e, brk: false, start, end: new Date(e.end), track: null, description: '', persons: [], url: null, day: keyOf(start)}; }))
      .sort((a, b) => a.start - b.start);
    days = [...new Set(talks.map(t => t.day))];
    const rooms = [...new Set(talks.filter(t => !t.brk).map(t => t.room))], sel = $('[data-room]');
    sel.innerHTML = '<option value="">All rooms</option>' + rooms.map(r => `<option value="${esc(r)}">${esc(roomLabel(r))}</option>`).join('');
    sel.value = rooms.includes(curRoom) ? curRoom : (curRoom = '');
    // topics: pretalx tracks, then tags (e.g. Jupyter); only those used by a talk
    const tr = [...new Set(talks.map(t => t.track?.name).filter(Boolean))].sort(), tg = [...new Set(talks.flatMap(t => (t.tags || []).map(g => g.name)))].sort();
    const top = $('[data-topic]');
    top.innerHTML = '<option value="">All topics</option>' + (talks.some(isBof) ? `<optgroup label="Format"><option value="${FORMAT_BOF}">Birds of a Feather</option></optgroup>` : '') + (tr.length ? '<optgroup label="Tracks">' + tr.map(n => `<option>${esc(n)}</option>`).join('') + '</optgroup>' : '') + (tg.length ? '<optgroup label="Tags">' + tg.map(n => `<option>${esc(n)}</option>`).join('') + '</optgroup>' : '');
    top.value = tr.concat(tg, [FORMAT_BOF]).includes(curTopic) ? curTopic : (curTopic = '');
    if (curDay !== ALL && !days.includes(curDay)) { const today = keyOf(new Date()); curDay = days.includes(today) ? today : days[0]; }
    $('.c26-src').innerHTML = d.live
      ? `Live from <a href="${EVENT}schedule/" target="_blank" rel="noopener">pretalx ↗</a>, refreshed every few minutes.`
      : `Offline: showing the copy saved on this device on ${esc(hhmm.format(new Date(d.at)))}. It may be out of date.`;
    renderDays(); render();
    if (dlg.open) { const m = /^#talk\/(.+)$/.exec(location.hash); if (m) open(decodeURIComponent(m[1])); }
  }
  let lastTry = Date.now();
  async function refresh() {
    if (Date.now() - lastTry < 60000) return;   // at most once a minute, however often the tab is switched
    lastTry = Date.now();
    try { apply(await fetchData()); } catch (e) { /* keep what is shown */ }
  }

  (async () => {
    try {
      apply(await fetchData());
      const m = /^#talk\/(.+)$/.exec(location.hash); if (m) open(decodeURIComponent(m[1]));
    } catch (e) {
      list.innerHTML = `<p class="c26-empty">The schedule could not load. <a href="${EVENT}schedule/" target="_blank" rel="noopener">Open it on pretalx ↗</a></p>`;
      console.error(e); return;
    }
    setInterval(() => { if (!document.hidden) render(); }, 60000);         // keep the "now" marker current
    setInterval(() => { if (!document.hidden) refresh(); }, REFRESH);      // pick up changes made on pretalx
    addEventListener('online', refresh);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  })();
})();
