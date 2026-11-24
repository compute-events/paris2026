// Venue component: floor plans of the Hôtel du Port with a "Where is…?" list, mounted into
// <div data-c26-venue> (venue.html). It shows light 2D plans (SVG) by default; the 3D model
// (three.js, ~600 KB) is only loaded when someone asks for it, so older phones stay fast.
// Links like venue.html#inside/track2 or #inside/floor-2 open a place or a floor.
(() => {
  const host = document.querySelector('[data-c26-venue]');
  if (!host) return;
  const BASE = 'assets/event/';
  const touch = matchMedia('(pointer: coarse)').matches;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  host.classList.add('c26');
  host.innerHTML = `
    <div class="c26-venue">
      <div class="c26-map">
        <div class="c26-map__bar">
          <div class="c26-map__floors" role="tablist" aria-label="Floor"></div>
          <button class="c26-map__btn c26-map__mode" type="button">View in 3D</button>
        </div>
        <div class="c26-chips" role="group" aria-label="Where is…?"></div>
        <p class="c26-map__note" aria-live="polite"></p>
        <div class="c26-plan"><p class="c26-map__msg">Loading the floor plans…</p></div>
        <div class="c26-map__3d" hidden>
          <div class="c26-map__canvas" aria-label="3D model of the venue floors. Drag to turn, pinch or scroll to zoom."></div>
          <button class="c26-map__btn c26-map__reset" type="button">Reset view</button>
          ${touch ? '<button class="c26-map__touch" type="button">Tap to move the model</button><button class="c26-map__btn c26-map__done" type="button" hidden>Done</button>' : ''}
        </div>
      </div>
      <div class="c26-places"></div>
    </div>`;
  const $ = s => host.querySelector(s);
  const plan = $('.c26-plan'), box3d = $('.c26-map__3d'), canvas = $('.c26-map__canvas'), modeBtn = $('.c26-map__mode');
  let floor = 0, place = null, mode = '2d', venue = null, ready = false, pending = null;

  // bumped with every change to the venue files: the plans and the 3D model are loaded on demand, and browsers keep
  // serving old copies of on-demand scripts even after a hard reload of the page
  const REV = '2026-11-24r';
  const load = src => new Promise((ok, fail) => { const s = document.createElement('script'); s.src = BASE + src + '?v=' + REV; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });

  /* ---------- 2D ---------- */
  const note = $('.c26-map__note');
  function draw() {
    const p = place && (place.all || place.floor === floor) ? place : null;   // all: lifts and toilets, on every floor
    plan.innerHTML = VenuePlan.svg(FLOORS[floor], p && p.route, p ? p.rooms.concat(p.kind ? ['kind:' + p.kind] : [], p.area ? [p.area] : []) : []);
    note.innerHTML = p ? `<b>${esc(p.name)}</b> ${esc(p.how)}` : `<b>${esc(floor === 0 ? 'Ground floor' : FLOORS[floor].name)}</b> ${esc(ACCESS[floor])}`;
  }
  // 3D: floor buttons switch floors on and off; all floors are on by default
  let shown = new Set();
  const allIds = () => FLOORS.map(f => f.id);
  const mark3d = () => host.querySelectorAll('.c26-map__floors button').forEach(b => b.setAttribute('aria-selected', String(shown.has(+b.dataset.f))));
  function allOn() { shown = new Set(allIds()); mark3d(); }
  function toggle3d(id) {
    shown.has(id) ? shown.delete(id) : shown.add(id);
    if (!shown.size) shown = new Set(allIds());   // never hide everything
    mark3d(); venue.show([...shown]);
    if (!place) {
      const names = [...shown].sort().map(i => i === 0 ? 'Ground' : FLOORS[i].name.replace(' floor', ''));
      note.innerHTML = shown.size === FLOORS.length ? '<b>All floors</b> The main lift and the main stairs connect every floor. Tap a floor to hide or show it.' : `<b>Showing ${esc(names.join(', '))}</b> Tap a floor to hide or show it.`;
    }
  }
  // i = null: all floors (3D only)
  function setFloor(i) {
    if (i !== null) floor = i;
    host.querySelectorAll('.c26-map__floors button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.f === String(i))));
    if (mode === '2d') draw();
    else { venue.floor(i); if (!place) note.innerHTML = i === null ? '<b>All floors</b> The main lift and the main stairs connect every floor.' : `<b>${esc(i === 0 ? 'Ground floor' : FLOORS[i].name)}</b> ${esc(ACCESS[i])}`; }
  }

  /* ---------- 3D, on request ---------- */
  async function to3d() {
    modeBtn.disabled = true; modeBtn.textContent = 'Loading 3D…';
    try {
      if (!venue) {
        await load('vendor/three.min.js'); await load('vendor/OrbitControls.js'); await load('venue3d.js');
        venue = window.Venue3D(canvas);
        if (!venue) throw new Error('no WebGL');
        if (touch) venue.controls(false);
      }
    } catch (e) {
      modeBtn.textContent = '3D not available on this device'; return;
    }
    mode = '3d'; plan.hidden = true; box3d.hidden = false;
    // 3D fills the screen on phones; the page snaps to it when scrolled close (see .c26-map.is-3d)
    $('.c26-map').classList.add('is-3d'); document.documentElement.classList.add('c26-snap');
    if (matchMedia('(max-width: 899px)').matches) $('.c26-map').scrollIntoView({block: 'start'});
    modeBtn.disabled = false; modeBtn.textContent = '2D'; modeBtn.title = 'Back to the 2D plans';
    if (!place) note.innerHTML = '<b>All floors</b> The main lift and the main stairs connect every floor.';
    venue.start(); venue.floor(null); venue.place(place);
    allOn();
  }
  function to2d() {
    mode = '2d'; if (venue) venue.stop();
    box3d.hidden = true; plan.hidden = false; modeBtn.textContent = 'View in 3D';
    $('.c26-map').classList.remove('is-3d'); document.documentElement.classList.remove('c26-snap');
    setFloor(floor);
  }

  function buildUi() {
    const fb = $('.c26-map__floors');
    fb.innerHTML = FLOORS.map(f => `<button type="button" role="tab" class="c26-map__btn" data-f="${f.id}" aria-selected="false" title="${esc(f.name)} · ${esc(f.sub)}">${f.id === 0 ? 'Ground' : f.name.replace(' floor', '')}</button>`).join('');
    fb.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; const id = +b.dataset.f; if (mode === '3d') toggle3d(id); else setFloor(id); });
    modeBtn.addEventListener('click', () => mode === '2d' ? to3d() : to2d());
    $('.c26-map__reset').addEventListener('click', () => { venue.reset(); allOn(); });
    if (touch) {
      const on = $('.c26-map__touch'), done = $('.c26-map__done');
      on.addEventListener('click', () => { venue.controls(true); canvas.classList.add('is-live'); on.hidden = true; done.hidden = false; });
      done.addEventListener('click', () => { venue.controls(false); canvas.classList.remove('is-live'); on.hidden = false; done.hidden = true; });
    }
    const ps = $('.c26-places');
    ps.innerHTML = '<h3 class="c26-routes__h">Where is…?</h3><div class="c26-places__list">' + PLACES.map(p =>
      `<button type="button" class="c26-place" data-p="${p.id}" aria-pressed="false">${esc(p.name)}<small>${p.all ? 'Every floor' : p.floor === 0 ? 'Ground' : FLOORS[p.floor].name.replace(' floor', '')}</small></button>`).join('') + '</div>';
    // phones: the same places as a row of chips inside the map, so picking one never scrolls the page
    const cs = $('.c26-chips');
    cs.innerHTML = '<span class="c26-chips__h">Where is</span>' + PLACES.map(p => `<button type="button" class="c26-place c26-chip2" data-p="${p.id}" aria-pressed="false">${esc(p.short || p.name)}</button>`).join('');
    host.addEventListener('click', e => { const b = e.target.closest('.c26-place'); if (b) pick(place && place.id === b.dataset.p ? null : b.dataset.p); });
  }
  function pick(id) {
    place = PLACES.find(p => p.id === id) || null;
    host.querySelectorAll('.c26-place').forEach(b => b.setAttribute('aria-pressed', String(!!place && b.dataset.p === place.id)));
    if (mode === '3d') { venue.place(place); if (place) allOn(); note.innerHTML = place ? `<b>${esc(place.name)}</b> ${esc(place.how)}` : 'Tap a place to find it in the building.'; }
    else if (place && !place.all) setFloor(place.floor); else draw();
    const chip = place && host.querySelector(`.c26-chip2[data-p="${place.id}"]`);
    if (chip) chip.scrollIntoView({block: 'nearest', inline: 'nearest'});
  }

  // #inside, #inside/<place id>, #inside/floor-<n>
  function go(hash) {
    const m = /^#inside(?:\/(.+))?$/.exec(hash); if (!m) return;
    $('.c26-map').scrollIntoView({block: 'start'});   // straight to the map, not the section heading (offset: scroll-margin-top)
    if (!ready) { pending = hash; return; }
    const sub = m[1] || '', fl = /^floor-(\d)$/.exec(sub);
    if (fl) { if (mode === '3d') to2d(); return setFloor(+fl[1]); }
    const alias = {salons: 'track2', up: 'plaisance', free: 'lifts', wayin: 'welcome'};   // older route links
    if (PLACES.some(p => p.id === (alias[sub] || sub))) pick(alias[sub] || sub);
  }

  // the plans (small: data + SVG renderer) load when the section comes near the screen
  const near = new IntersectionObserver(async ([e]) => {
    if (!e.isIntersecting) return;
    near.disconnect();
    try { await load('venue-data.js'); await load('venue-plan.js'); }
    catch (err) { plan.innerHTML = '<p class="c26-map__msg">The floor plans could not load.</p>'; return; }
    buildUi(); ready = true; setFloor(0);
    if (pending) { const h = pending; pending = null; go(h); }
  }, {rootMargin: '600px'});
  near.observe(host);
  // pause the 3D render loop while it is off screen
  new IntersectionObserver(([e]) => { if (venue && mode === '3d') e.isIntersecting ? venue.start() : venue.stop(); }).observe(host);
  if (/^#inside/.test(location.hash)) go(location.hash);
  addEventListener('hashchange', () => go(location.hash));
})();
